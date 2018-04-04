import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import SimplexNoise from 'simplex-noise';

const init = ({visualSettings, canvWidth, canvHeight, bgColour}) => {

  return new Promise(function(resolve, reject) {
    const camera = new THREE.PerspectiveCamera(35,
    canvWidth / canvHeight, 0.1, 3000);

    camera.position.set(0, -1000, 100);
    const controls = new OrbitControls(camera);

    const scene = new THREE.Scene();

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(0, 1000, 1000);
    scene.add(pointLight);

    const pointLightHelper = new THREE.PointLightHelper( pointLight, 10, 0xff0000);
    scene.add( pointLightHelper );

    const hemisphere = new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.5 );
    scene.add(hemisphere);

    scene.background = new THREE.Color(bgColour);
    scene.fog = new THREE.Fog( 0xff4da0, 0.1, 3000 );

    function setupTerrain(width, height, scale){

      simplex = new SimplexNoise(Math.random);

      terrainGeo = new THREE.PlaneGeometry(width, height, scale, scale);

      const terrainMat = new THREE.MeshPhongMaterial({color: 0x4deaff, transparent: true, opacity: 0.7});
      // terrainMat.flatShading = true;
      terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);

      terrainGeo.computeFaceNormals();

      scene.add(terrainMesh);
      // controls.dispose();
    }

    let terrainGeo, terrainMesh, simplex;
    const yOff = 100;

    setupTerrain(2500, 2500, 50);

    const ownSettings = {
      scene, camera, controls,
      terrainGeo, terrainMesh, simplex,
      yOff
    }

    resolve(ownSettings);
  });
};


const draw = ({
    visualSettings, ownSettings,
    canvWidth, canvHeight,
    bufferLength, dataArray,
    renderer
  }) => {

  const { scene, camera, controls,
    terrainGeo, terrainMesh, simplex, } = ownSettings;
  let { yOff } = ownSettings;

  const hue = (dataArray[0]/255).toFixed(2);
  // console.log(terrainGeo);
  terrainMesh.material.color.setHSL(hue, 0.8, 0.8);
  scene.fog.color.setHSL(1-hue, 0.8, 0.8);

  controls.update();

  const amplitude = (dataArray[0]/255) //normalise
              *200+50;

  for (let i = 0; i < terrainGeo.vertices.length; i++) {
      terrainGeo.vertices[i].z = simplex.noise2D(terrainGeo.vertices[i].x/500, terrainGeo.vertices[i].y/500 - yOff) *amplitude;
  }

  terrainGeo.verticesNeedUpdate = true;

  const speed = (dataArray[0]/25500) //normalise
              *30-0.01;

  if (!isNaN(speed)) {
    yOff -= speed;
  }

  renderer.render(scene, camera);

  return {
    scene, camera, controls,
    terrainGeo, terrainMesh, simplex, yOff
  };
}

export default {
  init,
  draw,
  type: 'three',
  renderer: 'three',
  description: 'Simplex noise generative terrain',
  thumbImg: 'three/oscil_thumb_terraingen.jpg'
}

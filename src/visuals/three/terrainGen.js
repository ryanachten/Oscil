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
    const xOff = 100;
    const daIndex = 0;

    setupTerrain(2500, 2500, 50);

    const ownSettings = {
      scene, camera, controls,
      terrainGeo, simplex,
      yOff, xOff, daIndex
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
    terrainGeo, simplex, } = ownSettings;
  let { yOff, xOff, daIndex } = ownSettings;



  controls.update();

  const amplitude = (dataArray[50]/255) //normalise
              *150+50;

  for (let i = 0; i < terrainGeo.vertices.length; i++) {
      terrainGeo.vertices[i].z = simplex.noise2D(terrainGeo.vertices[i].x/500 -xOff, terrainGeo.vertices[i].y/500 - yOff) *100;
  }

  terrainGeo.verticesNeedUpdate = true;

  const speed = (dataArray[0]/25500) //normalise
              *20-0.01;
  const speed2 = (dataArray[20]/25500) //normalise
              *10-0.03;

  if (!isNaN(speed)) {
    yOff -= speed;
  }
  if (!isNaN(speed2)) {
    xOff -= speed2;
  }

  daIndex++;
  if (daIndex >= dataArray.length) {
    daIndex = 0;
  }

  renderer.render(scene, camera);



  return {
    scene, camera, controls,
    terrainGeo, simplex, yOff, xOff, daIndex
  };
}

export default {
  init,
  draw,
  type: 'three',
  renderer: 'three',
  description: 'Simplex noise generative terrain',
  thumbImg: 'https://c1.staticflickr.com/9/8663/16531600749_8969f842a0_q.jpg'
}

import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';
import SimplexNoise from 'simplex-noise';

const init = ({visualSettings, canvWidth, canvHeight}) => {

  return new Promise(function(resolve, reject) {
    var camera = new THREE.PerspectiveCamera(35,
    canvWidth / canvHeight, 0.1, 3000);

    camera.position.set(0, -1000, 100);
    var controls = new OrbitControls(camera);

    // Scene setup
    var scene, ambientLight, pointLight, worldMesh;

    scene = new THREE.Scene();

    pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(0, 1000, 1000);
    scene.add(pointLight);

    var pointLightHelper = new THREE.PointLightHelper( pointLight, 10, 0xff0000);
    console.log(pointLightHelper);
    scene.add( pointLightHelper );

    var hemisphere = new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.5 );
    scene.add(hemisphere);

    scene.fog = new THREE.Fog( 0xff4da0, 0.1, 3000 );

    var terrainGeo, terrainMesh;

    var simplex;

    function setupTerrain(width, height, scale){

      simplex = new SimplexNoise(Math.random);

      terrainGeo = new THREE.PlaneGeometry(width, height, scale, scale);

      var terrainMat = new THREE.MeshPhongMaterial({color: 0x4deaff, transparent: true, opacity: 0.7});
      // terrainMat.flatShading = true;
      terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);

      terrainGeo.computeFaceNormals();

      scene.add(terrainMesh);
    }

    var yOff = 100;
    var xOff = 100;
    var daIndex = 0;

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
    stats, renderer
  }) => {

  const { scene, camera, controls,
    terrainGeo, simplex, } = ownSettings;
  let { yOff, xOff, daIndex } = ownSettings;

  stats.begin();

  controls.update();

  var amplitude = (dataArray[50]/255) //normalise
              *150+50;

  for (var i = 0; i < terrainGeo.vertices.length; i++) {
      terrainGeo.vertices[i].z = simplex.noise2D(terrainGeo.vertices[i].x/500 -xOff, terrainGeo.vertices[i].y/500 - yOff) *100;
  }

  terrainGeo.verticesNeedUpdate = true;

  var speed = (dataArray[0]/25500) //normalise
              *20-0.01;
  var speed2 = (dataArray[20]/25500) //normalise
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

  stats.end();

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
  thumbImg: 'https://c1.staticflickr.com/9/8888/18438501761_c26ec73209_q.jpg'
}

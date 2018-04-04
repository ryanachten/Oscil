import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import {mapRange} from '../../utilities/visualUtilities';

function superShapeRadius(theta, m, n1, n2, n3){
  const a = 1;
  const b = 1;

  let t1 = Math.abs((1/a) * Math.cos(m * theta /4));
  t1 = Math.pow(t1, n2);

  let t2 = Math.abs((1/b) * Math.sin(m * theta /4));
  t2 = Math.pow(t2, n3);

  const t3 = t1 + t2;
  const r = Math.pow(t3, -1/n1);

  // const r = 1; == sphere
  return r;
}

function calcSphere(radius, detailLevel, latSuperRadForumla, longSuperRadForumla){

  const globePoints = [];

  for (let i = 0; i < detailLevel+1; i++) { //latitude
    const lat = mapRange(i, 0, detailLevel, -Math.PI/2, Math.PI/2);
    // get lat supershape radius based off formula
    const f = latSuperRadForumla;
    const r2 = superShapeRadius(lat, f.m, f.n1, f.n2, f.n3);

    const latPoints = [];
    for (let j = 0; j < detailLevel+1; j++) { //longitude
      const long = mapRange(j, 0, detailLevel, -Math.PI, Math.PI);
      // get lat supershape radius based off formula
      const f = longSuperRadForumla;
      const r1 = superShapeRadius(long, f.m, f.n1, f.n2, f.n3);

      // convert lat and long to cartesian coords
      const x = radius * r1 * Math.cos(long) * r2 * Math.cos(lat);
      const y = radius * r1 * Math.sin(long) * r2 *  Math.cos(lat);
      const z = radius * r2 * Math.sin(lat);

      latPoints.push({x, y, z});
    }
    globePoints.push(latPoints);
  }
  return globePoints;
}

function buildSphere(globePoints, sphereGeo) {

  for (let i = 0; i < globePoints.length-1; i++) {

    const hue = mapRange(i, 0, globePoints.length-1, 0, 360*6);

    for (let j = 0; j < globePoints[i].length-1; j++) {

        const curIndex = sphereGeo.vertices.length; //used for tracking cur location in vertices array

        const v1 = globePoints[i][j];
        const v2 = globePoints[i+1][j];
        const v3 = globePoints[i][j+1];
        const v4 = globePoints[i+1][j+1];

        sphereGeo.vertices.push( new THREE.Vector3(v1.x, v1.y, v1.z) );
        sphereGeo.vertices.push( new THREE.Vector3(v2.x, v2.y, v2.z) );
        sphereGeo.vertices.push( new THREE.Vector3(v3.x, v3.y, v3.z) );
        sphereGeo.vertices.push( new THREE.Vector3(v4.x, v4.y, v4.z) );

        const f1 = new THREE.Face3(
          curIndex+0,
          curIndex+1,
          curIndex+2);
          f1.color = new THREE.Color("hsl("+(hue%360)+", 100%, 50%)");
        const f2 = new THREE.Face3(
          curIndex+1,
          curIndex+2,
          curIndex+3);
          f2.color = new THREE.Color("hsl("+(hue%360)+", 100%, 50%)");

        sphereGeo.faces.push(f1);
        sphereGeo.faces.push(f2);
    }
  }
  return sphereGeo;
}

const init = ({visualSettings, canvWidth, canvHeight, bgColour}) => {

  return new Promise(function(resolve, reject) {
    // Camera setup
    const camera = new THREE.PerspectiveCamera(35,
      canvWidth / canvHeight, 0.1, 3000);

    camera.position.set(0, 0, 1000);
    const controls = new OrbitControls(camera);

    const latSuperRadForumla = {
      m: 2,
      n1: 10,
      n2: 10,
      n3: 10,
    };

    const longSuperRadForumla = {
      m: 8,
      n1: 60,
      n2: 100,
      n3: 30,
    };

    let sphereGeo = new THREE.Geometry();
    const sphereMat = new THREE.MeshLambertMaterial({vertexColors: THREE.FaceColors});
    sphereMat.side = THREE.DoubleSide;
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);

    const scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    ambientLight.position.set(0, 0, 0);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(0, 1000, 1000);
    // scene.add(pointLight);

    const worldGeo = new THREE.SphereGeometry(1000, 20, 20);
    const worldMat = new THREE.MeshLambertMaterial({ color: bgColour, side: THREE.BackSide });
    const worldMesh = new THREE.Mesh(worldGeo, worldMat);
    scene.add(worldMesh);

    scene.fog = new THREE.Fog( bgColour, 0.1, 2000 );

    const spherePoints = calcSphere(200, 20, latSuperRadForumla, longSuperRadForumla);
    sphereGeo = buildSphere(spherePoints, sphereGeo);
    scene.add(sphereMesh);


    sphereGeo.computeFaceNormals();

    const colOffset = 1;

    const ownSettings = {
        scene, camera, controls,
        colOffset, sphereGeo, sphereMesh,
        latSuperRadForumla, longSuperRadForumla
    }

    resolve(ownSettings);
  });
}

const draw = ({
    visualSettings, ownSettings,
    canvWidth, canvHeight,
    bufferLength, dataArray,
    renderer
  }) => {

  let { scene, camera, controls,
      colOffset, sphereGeo, sphereMesh,
      latSuperRadForumla, longSuperRadForumla } = ownSettings;

  function updateSphere(globePoints) {

    const newPoints = [];

    for (let i = 0; i < globePoints.length-1; i++) {

      const hue = mapRange(i, 0, globePoints.length-1, 0, 360*6);

      for (let j = 0; j < globePoints[i].length-1; j++) {

          const v1 = globePoints[i][j];
          const v2 = globePoints[i+1][j];
          const v3 = globePoints[i][j+1];
          const v4 = globePoints[i+1][j+1];

          // sphereGeo.vertices.push( new THREE.Vector3(v1.x, v1.y, v1.z) );
          newPoints.push( {x: v1.x, y: v1.y, z: v1.z} );
          newPoints.push( {x: v2.x, y: v2.y, z: v2.z} );
          newPoints.push( {x: v3.x, y: v3.y, z: v3.z} );
          newPoints.push( {x: v4.x, y: v4.y, z: v4.z} );

      }
    }

    for (let i = 0; i < sphereGeo.vertices.length; i++) {

      sphereGeo.vertices[i].set(newPoints[i].x, newPoints[i].y, newPoints[i].z);
    }
    sphereGeo.verticesNeedUpdate = true;

    for (let i = 0; i < sphereGeo.faces.length; i++) {
      const hue = mapRange(i, 0, sphereGeo.faces.length, 0, 360*visualSettings.colorCycle.active);

      const newCol = new THREE.Color("hsl("+((hue+colOffset)%360)+", 100%, 50%)");
      sphereGeo.faces[i].color.copy(newCol)
    }
    colOffset += 5;
    sphereGeo.colorsNeedUpdate = true;
  }

  controls.update();

  const da = dataArray[0];

  if (visualSettings.react_lat_m.active) {
    latSuperRadForumla.m = (da/255) * visualSettings.lat_m.active;
  }else{
    latSuperRadForumla.m = visualSettings.lat_m.active;
  }
  if (visualSettings.react_lat_n1.active) {
    latSuperRadForumla.n1 = (da/255) * visualSettings.lat_n1.active;
  }else{
    latSuperRadForumla.n1 = visualSettings.lat_n1.active;
  }
  if (visualSettings.react_lat_n2.active) {
    latSuperRadForumla.n2 = (da/255) * visualSettings.lat_n2.active;
  }else{
    latSuperRadForumla.n2 = visualSettings.lat_n2.active;
  }
  if (visualSettings.react_lat_n3.active) {
    latSuperRadForumla.n3 = (da/255) * visualSettings.lat_n3.active;
  }else{
    latSuperRadForumla.n3 = visualSettings.lat_n3.active;
  }

  if (visualSettings.react_long_m.active) {
    longSuperRadForumla.m = (da/255) * visualSettings.long_m.active;
  }else{
    longSuperRadForumla.m = visualSettings.long_m.active;
  }
  if (visualSettings.react_long_n1.active) {
    longSuperRadForumla.n1 = (da/255) * visualSettings.long_n1.active;
  }else{
    longSuperRadForumla.n1 = visualSettings.long_n1.active;
  }
  if (visualSettings.react_long_n2.active) {
    longSuperRadForumla.n2 = (da/255) * visualSettings.long_n2.active;
  }else{
    longSuperRadForumla.n2 = visualSettings.long_n2.active;
  }
  if (visualSettings.react_long_n3.active) {
    longSuperRadForumla.n3 = (da/255) * visualSettings.long_n3.active;
  }else{
    longSuperRadForumla.n3 = visualSettings.long_n3.active;
  }


  const spherePoints = calcSphere(200, 20, latSuperRadForumla, longSuperRadForumla);
  updateSphere(spherePoints);

  sphereMesh.rotation.x += 0.01;
  sphereMesh.rotation.y += 0.01;

  renderer.render(scene, camera);

  ownSettings = {
    scene, camera, controls,
    colOffset, sphereGeo, sphereMesh,
    latSuperRadForumla, longSuperRadForumla
  }

  return ownSettings;
};


export default {
  init,
  draw,
  type: 'three',
  renderer: 'three',
  description: 'Parametric surface from multiplying two superformulas',
  thumbImg: 'three/oscil_thumb_supershapes.jpg',
  settings: {
    colorCycle: {
      active: 6,
      min: 0,
      max: 50
    },
    react_lat_m: {
      active: true,
    },
    react_lat_n1: {
      active: false,
    },
    react_lat_n2: {
      active: false,
    },
    react_lat_n3: {
      active: false,
    },
    lat_m:  {
      active: 2,
      min: -20,
      max: 20
    },
    lat_n1: {
      active: 10,
      min: -100,
      max: 100
    },
    lat_n2: {
      active: 10,
      min: -100,
      max: 100
    },
    lat_n3: {
      active: 10,
      min: -100,
      max: 100
    },

    react_long_m: {
      active: false,
    },
    react_long_n1: {
      active: false,
    },
    react_long_n2: {
      active: false,
    },
    react_long_n3: {
      active: false,
    },
    long_m:  {
      active: 8,
      min: -100,
      max: 100
    },
    long_n1: {
      active: 60,
      min: -100,
      max: 100
    },
    long_n2: {
      active: 100,
      min: -100,
      max: 100
    },
    long_n3: {
      active: 30,
      min: -100,
      max: 100
    }
  }
};

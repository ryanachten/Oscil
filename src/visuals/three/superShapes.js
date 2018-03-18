import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';
import {mapRange} from '../../utilities/visualUtilities';

function superShapeRadius(theta, m, n1, n2, n3){
  var a = 1;
  var b = 1;

  var t1 = Math.abs((1/a) * Math.cos(m * theta /4));
  t1 = Math.pow(t1, n2);

  var t2 = Math.abs((1/b) * Math.sin(m * theta /4));
  t2 = Math.pow(t2, n3);

  var t3 = t1 + t2;
  var r = Math.pow(t3, -1/n1);

  // var r = 1; == sphere
  return r;
}

function calcSphere(radius, detailLevel, latSuperRadForumla, longSuperRadForumla){

  console.log(latSuperRadForumla);

  var globePoints = [];

  for (var i = 0; i < detailLevel+1; i++) { //latitude
    var lat = mapRange(i, 0, detailLevel, -Math.PI/2, Math.PI/2);
    // get lat supershape radius based off formula
    var f = latSuperRadForumla;
    var r2 = superShapeRadius(lat, f.m, f.n1, f.n2, f.n3);

    var latPoints = [];
    for (var j = 0; j < detailLevel+1; j++) { //longitude
      var long = mapRange(j, 0, detailLevel, -Math.PI, Math.PI);
      // get lat supershape radius based off formula
      var f = longSuperRadForumla;
      var r1 = superShapeRadius(long, f.m, f.n1, f.n2, f.n3);

      // convert lat and long to cartesian coords
      var x = radius * r1 * Math.cos(long) * r2 * Math.cos(lat);
      var y = radius * r1 * Math.sin(long) * r2 *  Math.cos(lat);
      var z = radius * r2 * Math.sin(lat);

      latPoints.push({x, y, z});
    }
    globePoints.push(latPoints);
  }
  return globePoints;
}

function buildSphere(globePoints, sphereGeo) {

  for (var i = 0; i < globePoints.length-1; i++) {

    var hue = mapRange(i, 0, globePoints.length-1, 0, 360*6);

    for (var j = 0; j < globePoints[i].length-1; j++) {

        var curIndex = sphereGeo.vertices.length; //used for tracking cur location in vertices array

        var v1 = globePoints[i][j];
        var v2 = globePoints[i+1][j];
        var v3 = globePoints[i][j+1];
        var v4 = globePoints[i+1][j+1];

        sphereGeo.vertices.push( new THREE.Vector3(v1.x, v1.y, v1.z) );
        sphereGeo.vertices.push( new THREE.Vector3(v2.x, v2.y, v2.z) );
        sphereGeo.vertices.push( new THREE.Vector3(v3.x, v3.y, v3.z) );
        sphereGeo.vertices.push( new THREE.Vector3(v4.x, v4.y, v4.z) );

        var f1 = new THREE.Face3(
          curIndex+0,
          curIndex+1,
          curIndex+2);
          f1.color = new THREE.Color("hsl("+(hue%360)+", 100%, 50%)");
        var f2 = new THREE.Face3(
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

const init = ({visualSettings, canvWidth, canvHeight}) => {

  return new Promise(function(resolve, reject) {
    // Camera setup
    var camera = new THREE.PerspectiveCamera(35,
      window.innerWidth / window.innerHeight, 0.1, 3000);

    camera.position.set(0, 0, 1000);
    const controls = new OrbitControls(camera);


    // Scene setup
    var scene,
    ambientLight, pointLight, worldMesh;

    var latSuperRadForumla = {
      m: 2,
      n1: 10,
      n2: 10,
      n3: 10,
    };

    var longSuperRadForumla = {
      m: 8,
      n1: 60,
      n2: 100,
      n3: 30,
    };

    var sphereGeo = new THREE.Geometry();
    var sphereMat = new THREE.MeshLambertMaterial({vertexColors: THREE.FaceColors});
    sphereMat.side = THREE.DoubleSide;
    var sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);

    scene = new THREE.Scene();

    ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    ambientLight.position.set(0, 0, 0);
    scene.add(ambientLight);

    pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(0, 1000, 1000);
    // scene.add(pointLight);

    var worldGeo = new THREE.SphereGeometry(1000, 20, 20);
    var worldMat = new THREE.MeshLambertMaterial({ color: 0xef4773, side: THREE.BackSide });
    var worldMesh = new THREE.Mesh(worldGeo, worldMat);
    scene.add(worldMesh);

    scene.fog = new THREE.Fog( 0xefd1b5, 0.1, 2000 );

    var spherePoints = calcSphere(200, 20, latSuperRadForumla, longSuperRadForumla);
    sphereGeo = buildSphere(spherePoints, sphereGeo);
    scene.add(sphereMesh);


    sphereGeo.computeFaceNormals();

    var colOffset = 1;

    const ownSettings = {
        scene, camera, controls,
        colOffset, sphereGeo,
        latSuperRadForumla, longSuperRadForumla
    }

    resolve(ownSettings);
  });
}

const draw = ({
    visualSettings, ownSettings,
    canvWidth, canvHeight,
    bufferLength, dataArray,
    stats, renderer
  }) => {

  let { scene, camera, controls,
      colOffset, sphereGeo, latSuperRadForumla, longSuperRadForumla } = ownSettings;

  function updateSphere(globePoints) {

    var newPoints = [];

    for (var i = 0; i < globePoints.length-1; i++) {

      var hue = mapRange(i, 0, globePoints.length-1, 0, 360*6);

      for (var j = 0; j < globePoints[i].length-1; j++) {

          var v1 = globePoints[i][j];
          var v2 = globePoints[i+1][j];
          var v3 = globePoints[i][j+1];
          var v4 = globePoints[i+1][j+1];

          // sphereGeo.vertices.push( new THREE.Vector3(v1.x, v1.y, v1.z) );
          newPoints.push( {x: v1.x, y: v1.y, z: v1.z} );
          newPoints.push( {x: v2.x, y: v2.y, z: v2.z} );
          newPoints.push( {x: v3.x, y: v3.y, z: v3.z} );
          newPoints.push( {x: v4.x, y: v4.y, z: v4.z} );

      }
    }

    for (var i = 0; i < sphereGeo.vertices.length; i++) {

      sphereGeo.vertices[i].set(newPoints[i].x, newPoints[i].y, newPoints[i].z);
    }
    sphereGeo.verticesNeedUpdate = true;

    for (var i = 0; i < sphereGeo.faces.length; i++) {
      var hue = mapRange(i, 0, sphereGeo.faces.length, 0, 360*visualSettings.colorCycle.active);

      var newCol = new THREE.Color("hsl("+((hue+colOffset)%360)+", 100%, 50%)");
      sphereGeo.faces[i].color.copy(newCol)
    }
    colOffset += 5;
    sphereGeo.colorsNeedUpdate = true;
  }

  stats.begin();

  controls.update();

  var da = dataArray[0];

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


  var spherePoints = calcSphere(200, 20);
  updateSphere(spherePoints);

  sphereMesh.rotation.x += 0.01;
  sphereMesh.rotation.y += 0.01;

  renderer.render(scene, camera);

  stats.end();

  console.log(latSuperRadForumla, longSuperRadForumla);

  ownSettings = {
      scene, camera, controls,
      colOffset, sphereGeo,
      latSuperRadForumla, longSuperRadForumla
  }

  return ownSettings;
};


export default {
  init,
  draw,
  type: 'three',
  renderer: 'three',
  thumbImg: 'https://c1.staticflickr.com/9/8888/18438501761_c26ec73209_q.jpg',
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

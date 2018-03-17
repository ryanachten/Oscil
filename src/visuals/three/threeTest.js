import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';

const init = ({visualSettings, canvWidth, canvHeight}) => {

  return new Promise(function(resolve, reject) {

    // Camera setup
    const camera = new THREE.PerspectiveCamera(35,
    canvWidth /  canvHeight, 0.1, 3000);
    camera.position.set(0, 0, 1000);

    const controls = new OrbitControls(camera);

    // Scene setup
    var scene = new THREE.Scene();

    scene.fog = new THREE.Fog( 0xefd1b5, 0.1, 2000 );

    // Light setup
      // light( colour, strength)
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    ambientLight.position.set(0, 0, 0);
    scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xffffff, 0.3);
    pointLight.position.set(0, 1000, 1000);
    scene.add(pointLight);


    // Geometry
    var worldGeo = new THREE.SphereGeometry(1100, 32, 32);
    var worldMat = new THREE.MeshLambertMaterial({ color: 0xef4773, side: THREE.BackSide });
    var worldMesh = new THREE.Mesh(worldGeo, worldMat);
    worldMesh.name = 'worldMesh';
    scene.add(worldMesh);


    // React Particle system

    function createReactParticle(){
      var reactParticle = new THREE.Object3D();
      reactParticle.name = 'reactParticle';

      // Particle nucleus
      var nucleusGeo = new THREE.IcosahedronGeometry(50, 1);
      var nucleusMat = new THREE.MeshStandardMaterial(
        { color: 0xbd95ef, metalness: 1, roughness: 0.50, transparent: true, opacity: 0.7} );
      var nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
      nucleusMesh.name = 'nucleusMesh';
      reactParticle.add(nucleusMesh);


      var particleLight = new THREE.PointLight(0xffffff, 0.5, 300, 2);
      particleLight.position.set(nucleusMesh.position.x, nucleusMesh.position.y, nucleusMesh.position.z);
      reactParticle.add(particleLight);

      // Particle outer dust
      var sphereParticles = new THREE.Object3D();
      sphereParticles.name = 'sphereParticles';

      for (var i = 0; i < nucleusGeo.vertices.length; i++){
        var tempVert = new THREE.Vector3(nucleusGeo.vertices[i].x, nucleusGeo.vertices[i].y, nucleusGeo.vertices[i].z);

        var tempSphereGeo = new THREE.SphereGeometry(5, 10, 10)
        var tempSphereMat = new THREE.MeshLambertMaterial(
          { color: 0x47d0ef });
        var tempSphereMesh = new THREE.Mesh(tempSphereGeo, tempSphereMat);
        tempSphereMesh.position.set(tempVert.x, tempVert.y, tempVert.z);
        sphereParticles.add(tempSphereMesh);
      }

      reactParticle.add(sphereParticles);
      return reactParticle;
    }

    var reactParticles = new THREE.Object3D();

    var particleGridGeo = new THREE.DodecahedronGeometry(500, 0);
    particleGridGeo.computeLineDistances();
    console.log(particleGridGeo);

    var particleGridMat = new THREE.LineDashedMaterial({ color: 0xffffff, linewidth: 100, scale: 100, dashSize: 100, gapSize: 100 });

    var particleGridLines = new THREE.LineSegments(particleGridGeo, particleGridMat);
    particleGridLines.name = 'particleGrid';


    for (var i = 0; i < particleGridGeo.vertices.length; i++) {
      var tempPart = createReactParticle();
      var tempPos = particleGridGeo.vertices[i];
      tempPart.position.set(tempPos.x, tempPos.y, tempPos.z);
      reactParticles.add(tempPart);
    }

    reactParticles.add(particleGridLines);

    scene.add(reactParticles);

    // Central Torus
      //r, t, ts, rs, p, q
    var centralTorusGeo = new THREE.TorusKnotGeometry(250, 5, 50, 4, 2, 5);
    var centralTorusMat = new THREE.MeshStandardMaterial(
      { color: 0xbd95ef, metalness: 1, roughness: 0.50, transparent: true, opacity: 0.7} );
    var centralTorusMesh = new THREE.Mesh(centralTorusGeo, centralTorusMat);
    scene.add(centralTorusMesh);


    const ownSettings = {
        scene, camera,
        centralTorusMesh, reactParticles
    };

    resolve(ownSettings);
  });
};

const draw = ({
    visualSettings, ownSettings,
    canvWidth, canvHeight,
    bufferLength, dataArray,
    stats, renderer
  }) => {

  const {centralTorusMesh, reactParticles,
        scene, camera} = ownSettings;

  centralTorusMesh.rotation.x -= 0.01;
  centralTorusMesh.rotation.y -= 0.01;
  centralTorusMesh.rotation.z -= 0.01;

  // // Rotate main grid
  reactParticles.rotation.x += 0.01;
  reactParticles.rotation.y += 0.01;
  reactParticles.rotation.z += 0.01;

  function updateReactParticle(particle, curDa){
    particle.rotation.x += 0.01;
    particle.rotation.y += 0.01;
    particle.rotation.z += 0.01;

    // console.log(particle);
    // debugger;
    var nucleus = particle.children[0];
    var sphereParticles = particle.children[2];

    sphereParticles.scale.x = sphereParticles.scale.y = sphereParticles.scale.z = 1+curDa;

    for (var i = 0; i < sphereParticles.children.length; i++) {
      sphereParticles.children[i].scale.x = sphereParticles.children[i].scale.y = sphereParticles.children[i].scale.z = 1-curDa;
    }
    sphereParticles.rotation.x -= 0.01;
    sphereParticles.rotation.y -= 0.01;
    sphereParticles.rotation.z -= 0.01;

    nucleus.scale.x = nucleus.scale.y = nucleus.scale.z = curDa;
    nucleus.rotation.x += 0.01;
    nucleus.rotation.y += 0.01;
    nucleus.rotation.z += 0.01;
  }

  var indexIncrement = Math.floor(dataArray.length / reactParticles.children.length);
  for (var i = 0; i < reactParticles.children.length; i++) {
    var da = dataArray[i*indexIncrement]/255 +0.01;
    if(reactParticles.children[i].name !== 'particleGrid'){
        updateReactParticle(reactParticles.children[i], da);
    }

  }

  // Update environment
  var hue = (dataArray[0]/255)
            *40 //range
            +172; //base colour
  scene.fog.color = new THREE.Color('hsl('+hue+', 50%, 79%)');

  renderer.render(scene, camera);

  return ownSettings;
}

export default {
  init,
  draw,
  type: 'three',
  renderer: 'three',
  thumbImg: 'https://c1.staticflickr.com/9/8888/18438501761_c26ec73209_q.jpg'
};

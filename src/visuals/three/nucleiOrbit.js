import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';

const init = ({visualSettings, canvWidth, canvHeight}) => {

  return new Promise(function(resolve, reject) {

    // Camera setup
    const camera = new THREE.PerspectiveCamera(35,
    canvWidth /  canvHeight, 0.1, 3000);
    camera.position.set(0, 0, 1000);

    const controls = new OrbitControls(camera);

    // Scene setup
    const scene = new THREE.Scene();

    scene.fog = new THREE.Fog( 0xefd1b5, 0.1, 2000 );

    // Light setup
      // light( colour, strength)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    ambientLight.position.set(0, 0, 0);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.3);
    pointLight.position.set(0, 1000, 1000);
    scene.add(pointLight);


    // Geometry
    const worldGeo = new THREE.SphereGeometry(1100, 32, 32);
    const worldMat = new THREE.MeshLambertMaterial({ color: 0xef4773, side: THREE.BackSide });
    const worldMesh = new THREE.Mesh(worldGeo, worldMat);
    worldMesh.name = 'worldMesh';
    scene.add(worldMesh);


    // React Particle system

    function createReactParticle(){
      const reactParticle = new THREE.Object3D();
      reactParticle.name = 'reactParticle';

      // Particle nucleus
      const nucleusGeo = new THREE.IcosahedronGeometry(50, 1);
      const nucleusMat = new THREE.MeshStandardMaterial(
        { color: 0xffffff, metalness: 1, roughness: 0.50, transparent: true, opacity: 0.7} );
      const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
      nucleusMesh.name = 'nucleusMesh';
      reactParticle.add(nucleusMesh);


      const particleLight = new THREE.PointLight(0xffffff, 0.5, 300, 2);
      particleLight.position.set(nucleusMesh.position.x, nucleusMesh.position.y, nucleusMesh.position.z);
      reactParticle.add(particleLight);

      // Particle outer dust
      const sphereParticles = new THREE.Object3D();
      sphereParticles.name = 'sphereParticles';

      for (let i = 0; i < nucleusGeo.vertices.length; i++){
        const tempVert = new THREE.Vector3(nucleusGeo.vertices[i].x, nucleusGeo.vertices[i].y, nucleusGeo.vertices[i].z);

        const tempSphereGeo = new THREE.SphereGeometry(5, 10, 10)
        const tempSphereMat = new THREE.MeshLambertMaterial(
          { color: 0x47d0ef });
        const tempSphereMesh = new THREE.Mesh(tempSphereGeo, tempSphereMat);
        tempSphereMesh.position.set(tempVert.x, tempVert.y, tempVert.z);
        sphereParticles.add(tempSphereMesh);
      }

      reactParticle.add(sphereParticles);
      return reactParticle;
    }

    const reactParticles = new THREE.Object3D();

    const particleGridGeo = new THREE.DodecahedronGeometry(500, 0);
    // particleGridGeo.computeLineDistances();

    const particleGridMat = new THREE.LineDashedMaterial({ color: 0xffffff, linewidth: 100, scale: 100, dashSize: 100, gapSize: 100 });

    const particleGridLines = new THREE.LineSegments(particleGridGeo, particleGridMat);
    particleGridLines.name = 'particleGrid';


    for (let i = 0; i < particleGridGeo.vertices.length; i++) {
      const tempPart = createReactParticle();
      const tempPos = particleGridGeo.vertices[i];
      tempPart.position.set(tempPos.x, tempPos.y, tempPos.z);
      reactParticles.add(tempPart);
    }

    reactParticles.add(particleGridLines);

    scene.add(reactParticles);

    const ownSettings = {
        scene, camera, controls,
        reactParticles
    };

    resolve(ownSettings);
  });
};

const draw = ({
    visualSettings, ownSettings,
    canvWidth, canvHeight,
    bufferLength, dataArray,
    renderer
  }) => {

  const {reactParticles, scene, camera} = ownSettings;

  // // Rotate main grid
  reactParticles.rotation.x += 0.01;
  reactParticles.rotation.y += 0.01;
  reactParticles.rotation.z += 0.01;

  const hue = (dataArray[0]/255)
            *360 //range
            +0; //base colour

  function updateReactParticle(particle, curDa){
    particle.rotation.x += 0.01;
    particle.rotation.y += 0.01;
    particle.rotation.z += 0.01;

    // console.log(particle);
    // debugger;
    const nucleus = particle.children[0];
    const sphereParticles = particle.children[2];

    sphereParticles.scale.x = sphereParticles.scale.y = sphereParticles.scale.z = 1+curDa;

    for (let i = 0; i < sphereParticles.children.length; i++) {
      sphereParticles.children[i].scale.x = sphereParticles.children[i].scale.y = sphereParticles.children[i].scale.z = 1-curDa;

      sphereParticles.children[i].material.color.setHSL(1-(hue/360), 0.5, 0.8);
    }
    sphereParticles.rotation.x -= 0.01;
    sphereParticles.rotation.y -= 0.01;
    sphereParticles.rotation.z -= 0.01;

    nucleus.scale.x = nucleus.scale.y = nucleus.scale.z = curDa;
    nucleus.rotation.x += 0.01;
    nucleus.rotation.y += 0.01;
    nucleus.rotation.z += 0.01;
  }

  const indexIncrement = Math.floor(dataArray.length / reactParticles.children.length);
  for (let i = 0; i < reactParticles.children.length; i++) {
    const da = dataArray[i*indexIncrement]/255 +0.01;
    if(reactParticles.children[i].name !== 'particleGrid'){
        updateReactParticle(reactParticles.children[i], da);
    }

  }

  // Update environment

  scene.fog.color = new THREE.Color('hsl('+hue+', 50%, 79%)');

  renderer.render(scene, camera);

  return ownSettings;
}

export default {
  init,
  draw,
  type: 'three',
  renderer: 'three',
  description: 'Nuclei reacting to different parts of audio waveform',
  thumbImg: 'three/oscil_thumb_nucleiorbit.jpg'
};

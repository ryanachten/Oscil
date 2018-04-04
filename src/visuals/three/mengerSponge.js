import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';

const init = ({visualSettings, canvWidth, canvHeight}) => {

  return new Promise(function(resolve, reject) {
    // Camera setup
      //PerspectiveCamera( fieldOfView, aspectRatio, minDist, maxDist)
    const camera = new THREE.PerspectiveCamera(75,
      window.innerWidth / window.innerHeight, 0.1, 3000);

    camera.position.set(0, 0, 500);
    const controls = new OrbitControls(camera);


    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0xefd1b5, 0.1, 2000 );

    const worldGeo = new THREE.SphereGeometry(1100, 32, 32);
    const worldMat = new THREE.MeshLambertMaterial({ color: 0xef4773, side: THREE.BackSide });
    const worldMesh = new THREE.Mesh(worldGeo, worldMat);
    worldMesh.name = 'worldMesh';
    scene.add(worldMesh);

    // Light setup
      // light( colour, strength)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    ambientLight.position.set(0, 0, 0);
    // scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(0, 1000, 1000);
    scene.add(pointLight);

    const hemisphereLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    scene.add(hemisphereLight);

    // Geometry
    function Box( x, y, z, r){
      this.pos = new THREE.Vector3( x, y, z);
      this.r = r;

      const boxGeo = new THREE.BoxGeometry(this.r, this.r, this.r);
      // THREE.Line.computeLineDistances
      // boxGeo.computeLineDistances();

      const boxMat = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0xffffff, wireframe: false, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
      const boxMesh = new THREE.Mesh(boxGeo, boxMat);

      const boxObj = new THREE.Object3D();
      boxObj.add(boxMesh);
      boxObj.position.set( x, y, z );

      boxObj.name = 'boxObj';
      boxObj.userData = {
        posX : x,
        posY: y,
        posZ: z
      }

      this.mesh = boxObj;

      // scene.add(this.mesh);

      this.generate = function(){
          const boxes = [];
          for (let x = -1; x < 2; x++) {
            for (let y = -1; y < 2; y++) {
              for (let z = -1; z < 2; z++) {

                // Find the holes for the sponge
                const sum = Math.abs(x) + Math.abs(y) + Math.abs(z);
                const newR = this.r /3; //reduces size for ea. fractal step
                if (sum > 1) {
                  // const b = new Box( Math.random() * 60, Math.random() * 60, Math.random() * 60, newR);
                  const b = new Box( this.pos.x + x * newR, this.pos.y + y * newR, this.pos.z + z * newR, newR);
                  boxes.push(b);
                }
              }
            }
          }
        return boxes;
      }
    }

    const a = 0;
    const sponge = new THREE.Object3D();

    const starterBox = new Box(0, 0, 0, 200);
    const gen2boxes = starterBox.generate();
    const gen3boxes = [];
    for (let i = 0; i < gen2boxes.length; i++) {
      gen3boxes.push(gen2boxes[i].generate());
    }
    for (let i = 0; i < gen3boxes.length; i++) {
      for (let j = 0; j < gen3boxes[i].length; j++) {
        sponge.add(gen3boxes[i][j].mesh);
      }
    }
    scene.add(sponge);

    const delta = 0.01;

    const ownSettings = {
      scene, camera, controls,
      sponge, worldMat, delta
    };

    resolve(ownSettings);
  });

}


const draw = ({
    visualSettings, ownSettings,
    canvWidth, canvHeight,
    bufferLength, dataArray,
    renderer
  }) => {

  let { scene, camera,
    sponge, worldMat, delta } = ownSettings;

  const da = dataArray[0]/255;

  const sinSize = Math.sin(delta);
  delta += 0.001;

  sponge.rotation.x += 0.01;
  sponge.rotation.y += 0.01;

  let hue = undefined;

  for (let i = 0; i < sponge.children.length; i++) {

    const len = sinSize * 500;
    const scl = Math.abs(
        3*(1-da) //music reaction scale
        * sinSize //scaled according boxes distance
        + 0.1 ); //prevents errors from being too small

    sponge.children[i].scale.set(1,1,1);
    sponge.children[i].scale.multiplyScalar(scl);

    sponge.children[i].rotation.x -= 0.01;
    sponge.children[i].rotation.y -= 0.01;

    let originalPos = sponge.children[i].userData;
    originalPos = new THREE.Vector3(originalPos.posX, originalPos.posY, originalPos.posZ);
    const oldLength = originalPos.length();

    if ( oldLength !== 0 ) {
        originalPos.multiplyScalar( 1 + ( len / oldLength ) );
        sponge.children[i].position.copy(originalPos);
    }

    hue = Math.abs(((45/sponge.children.length) * i + 90)
              + (sinSize*180));
    // console.log(hue);
    const tempColor = new THREE.Color("hsl(" + hue + ", 70%, 50%)");
    sponge.children[i].children[0].material.color = tempColor;

    const tempSpecular = new THREE.Color("hsl(" + (Math.abs(180-hue)) + ", 70%, 50%)");
    sponge.children[i].children[0].material.specular = tempColor;
  }

  worldMat.color = new THREE.Color("hsl(" + (Math.abs(90+hue)) + ", 50%, 50%)");
  scene.fog.color= new THREE.Color("hsl(" + (Math.abs(50+hue)) + ", 20%, 80%)");

  renderer.render(scene, camera);

  return  {
    ...ownSettings,
    scene, camera,
    sponge, worldMat, delta
  };
}

export default {
  init,
  draw,
  type: 'three',
  renderer: 'three',
  description: 'Generalization of the Cantor set and Sierpinski carpet',
  thumbImg: 'three/oscil_thumb_mengersponge.jpg'
};

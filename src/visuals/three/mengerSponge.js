import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';

const init = ({visualSettings, canvWidth, canvHeight}) => {

  return new Promise(function(resolve, reject) {
    // Camera setup
      //PerspectiveCamera( fieldOfView, aspectRatio, minDist, maxDist)
    var camera = new THREE.PerspectiveCamera(75,
      window.innerWidth / window.innerHeight, 0.1, 3000);

    camera.position.set(0, 0, 500);
    const controls = new OrbitControls(camera);


    // Scene setup
    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0xefd1b5, 0.1, 2000 );

    var worldGeo = new THREE.SphereGeometry(1100, 32, 32);
    var worldMat = new THREE.MeshLambertMaterial({ color: 0xef4773, side: THREE.BackSide });
    var worldMesh = new THREE.Mesh(worldGeo, worldMat);
    worldMesh.name = 'worldMesh';
    scene.add(worldMesh);

    // Light setup
      // light( colour, strength)
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    ambientLight.position.set(0, 0, 0);
    // scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(0, 1000, 1000);
    scene.add(pointLight);

    var hemisphereLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    scene.add(hemisphereLight);

    // Geometry
    function Box( x, y, z, r){
      this.pos = new THREE.Vector3( x, y, z);
      this.r = r;

      var boxGeo = new THREE.BoxGeometry(this.r, this.r, this.r);
      boxGeo.computeLineDistances();

      var boxMat = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0xffffff, wireframe: false, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
      var boxMesh = new THREE.Mesh(boxGeo, boxMat);

      var boxObj = new THREE.Object3D();
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
          var boxes = [];
          for (var x = -1; x < 2; x++) {
            for (var y = -1; y < 2; y++) {
              for (var z = -1; z < 2; z++) {

                // Find the holes for the sponge
                var sum = Math.abs(x) + Math.abs(y) + Math.abs(z);
                var newR = this.r /3; //reduces size for ea. fractal step
                if (sum > 1) {
                  // var b = new Box( Math.random() * 60, Math.random() * 60, Math.random() * 60, newR);
                  var b = new Box( this.pos.x + x * newR, this.pos.y + y * newR, this.pos.z + z * newR, newR);
                  boxes.push(b);
                }
              }
            }
          }
        return boxes;
      }
    }

    var a = 0;
    var sponge = new THREE.Object3D();

    var starterBox = new Box(0, 0, 0, 200);
    var gen2boxes = starterBox.generate();
    var gen3boxes = [];
    for (var i = 0; i < gen2boxes.length; i++) {
      gen3boxes.push(gen2boxes[i].generate());
    }
    for (var i = 0; i < gen3boxes.length; i++) {
      for (var j = 0; j < gen3boxes[i].length; j++) {
        sponge.add(gen3boxes[i][j].mesh);
      }
    }
    scene.add(sponge);

    const ownSettings = {
      sponge, worldMat
    };
  });

}


const draw = ({
    visualSettings, ownSettings,
    canvWidth, canvHeight,
    bufferLength, dataArray,
    stats, renderer
  }) => {

  stats.begin();

  var da = dataArray[0]/255;

  var sinSize = Math.sin(delta);
  delta += 0.001;

  sponge.rotation.x += 0.01;
  sponge.rotation.y += 0.01;

  for (var i = 0; i < sponge.children.length; i++) {

    var len = sinSize * 500;
    var scl = Math.abs(
        3*(1-da) //music reaction scale
        * sinSize //scaled according boxes distance
        + 0.1 ); //prevents errors from being too small

    sponge.children[i].scale.set(1,1,1);
    sponge.children[i].scale.multiplyScalar(scl);

    sponge.children[i].rotation.x -= 0.01;
    sponge.children[i].rotation.y -= 0.01;

    var originalPos = sponge.children[i].userData;
    originalPos = new THREE.Vector3(originalPos.posX, originalPos.posY, originalPos.posZ);
    var oldLength = originalPos.length();

    if ( oldLength !== 0 ) {
        originalPos.multiplyScalar( 1 + ( len / oldLength ) );
        sponge.children[i].position.copy(originalPos);
    }

    var hue = Math.abs(((45/sponge.children.length) * i + 90)
              + (sinSize*180));
    var tempColor = new THREE.Color("hsl(" + hue + ", 70%, 50%)");
    sponge.children[i].children[0].material.color = tempColor;

    var tempSpecular = new THREE.Color("hsl(" + (Math.abs(180-hue)) + ", 70%, 50%)");
    sponge.children[i].children[0].material.specular = tempColor;
  }

  worldMat.color = new THREE.Color("hsl(" + (Math.abs(90+hue)) + ", 50%, 50%)");
  scene.fog.color= new THREE.Color("hsl(" + (Math.abs(50+hue)) + ", 20%, 80%)");

  renderer.render(scene, camera);

  stats.end();
}

export default {
  init,
  draw,
  type: 'three',
  renderer: 'three',
  thumbImg: 'https://c1.staticflickr.com/9/8888/18438501761_c26ec73209_q.jpg'
};

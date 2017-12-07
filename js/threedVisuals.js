function threedTest(dataArray, bufferLength){

    $('#visualiser').hide();

    // Stats performance visualiser
    var stats = new Stats();
    console.log(stats.domElement);
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.domElement );
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.right = 0;

    // Renderer setup
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    document.body.appendChild( renderer.domElement ); //add canvas to dom
    renderer.domElement.id = 'threed-canvas';
    renderer.setClearColor( new THREE.Color(0xede6e0) ); //same as bgColor
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Camera setup
      //PerspectiveCamera( fieldOfView, aspectRatio, minDist, maxDist)
    var camera = new THREE.PerspectiveCamera(35,
      window.innerWidth / window.innerHeight, 0.1, 3000);

      camera.position.set(0, 0, 1000);

      document.addEventListener("keydown", function(event) {
        if (event.keyCode == '38') {
          //Up
          camera.position.z += 50;
        }
        else if (event.keyCode == '40') {
          //Down
          camera.position.z -= 50;
        }
      });


    // Scene setup
    var scene = new THREE.Scene();

    // Light setup
      // light( colour, strength)
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    ambientLight.position.set(0, 0, 0);
    scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(0, 1000, 1000);
    scene.add(pointLight);

    // Geometry
    function createReactParticle(){
      var reactParticle = new THREE.Object3D();
      reactParticle.name = 'reactParticle';

      // Particle nucleus
      var nucleusGeo = new THREE.IcosahedronGeometry(50, 1);
      var nucleusMat = new THREE.MeshLambertMaterial(
        { color: 0xef4773, emissive: 0xffffff, emissiveIntensity: 0} );
      var nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);

      reactParticle.add(nucleusMesh);
      nucleusMesh.name = 'nucleusMesh';

      // Particle outer dust
      var sphereParticles = new THREE.Object3D();
      sphereParticles.name = 'sphereParticles';

      for (var i = 0; i < nucleusGeo.vertices.length; i++){
        var tempVert = new THREE.Vector3(nucleusGeo.vertices[i].x, nucleusGeo.vertices[i].y, nucleusGeo.vertices[i].z);

        var tempSphereGeo = new THREE.SphereGeometry(5, 20, 20)
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
    for (var i = 0; i < particleGridGeo.vertices.length; i++) {
      var tempPart = createReactParticle();
      var tempPos = particleGridGeo.vertices[i];
      tempPart.position.set(tempPos.x, tempPos.y, tempPos.z);
      reactParticles.add(tempPart);
    }
    scene.add(reactParticles);

    // Render Loop
    requestAnimationFrame(render);

    function render(){

      stats.begin();

      analyser.getByteFrequencyData(dataArray);

      reactParticles.rotation.x += 0.01;
      reactParticles.rotation.y += 0.01;
      reactParticles.rotation.z += 0.01;

      function updateReactParticle(particle, curDa){
        var nucleus = particle.children[0];
        var sphereParticles = particle.children[1];

        sphereParticles.scale.x = sphereParticles.scale.y = sphereParticles.scale.z = 1+curDa;

        for (var i = 0; i < sphereParticles.children.length; i++) {
          sphereParticles.children[i].scale.x = sphereParticles.children[i].scale.y = sphereParticles.children[i].scale.z = 1-curDa;
        }
        sphereParticles.rotation.x -= 0.01;
        sphereParticles.rotation.y -= 0.01;
        sphereParticles.rotation.z -= 0.01;

        // console.log('nucleus', nucleus.material);
        // nucleus.material.emissiveIntensity = da/2;

        nucleus.scale.x = nucleus.scale.y = nucleus.scale.z = curDa;
        nucleus.rotation.x += 0.01;
        nucleus.rotation.y += 0.01;
        nucleus.rotation.z += 0.01;
      }

      var indexIncrement = Math.floor(dataArray.length / reactParticles.children.length);
      for (var i = 0; i < reactParticles.children.length; i++) {
        var da = dataArray[i*indexIncrement]/255 +0.01;
        updateReactParticle(reactParticles.children[i], da);
      }

      renderer.render(scene, camera);

      stats.end();

      requestAnimationFrame(render);
    }
}

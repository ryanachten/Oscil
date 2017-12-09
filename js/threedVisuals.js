function threedTest(dataArray, bufferLength){

    $('#visualiser').hide();

    // Stats performance visualiser
    var stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.domElement );
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.right = 0;

    // Renderer setup
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    document.body.appendChild( renderer.domElement ); //add canvas to dom
    renderer.domElement.id = 'threed-canvas';
    renderer.setClearColor( new THREE.Color(0x000000) ); //same as bgColor
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Camera setup
      //PerspectiveCamera( fieldOfView, aspectRatio, minDist, maxDist)
    var camera = new THREE.PerspectiveCamera(35,
      window.innerWidth / window.innerHeight, 0.1, 3000);

      camera.position.set(0, 0, 1000);

      document.addEventListener("keydown", function(event) {
        if (event.keyCode == '38' && camera.position.z + 50 < 1950) {
          //Up
          camera.position.z += 50;
        }
        else if (event.keyCode == '40' && camera.position.z - 50 > 0) {
          //Down
          camera.position.z -= 50;
        }
      });


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

    // Render Loop
    requestAnimationFrame(render);

    function render(){

      stats.begin();

      analyser.getByteFrequencyData(dataArray);

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

      stats.end();

      requestAnimationFrame(render);
    }
}

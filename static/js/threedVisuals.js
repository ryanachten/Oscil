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

function mengerSponge(dataArray, bufferLength){

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
    renderer.setClearColor( new THREE.Color(0x000000) );
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Camera setup
      //PerspectiveCamera( fieldOfView, aspectRatio, minDist, maxDist)
    var camera = new THREE.PerspectiveCamera(75,
      window.innerWidth / window.innerHeight, 0.1, 3000);

      camera.position.set(0, 0, 500);

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

    function init(){

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
      // console.log(gen3boxes[0][0]);
      scene.add(sponge);
    }
    init();


    // Render Loop
    requestAnimationFrame(render);

    var delta = 0.01;

    function render(){

      stats.begin();

      analyser.getByteFrequencyData(dataArray);
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

      requestAnimationFrame(render);
    }
}

function superShapes(dataArray, bufferLength){

    $('#visualiser').hide();

    var visGui = new dat.GUI({ autoPlace: false });
  	visGui.domElement.id = 'visdat-gui';
  	$('#visual-options').append(visGui.domElement);
  	var visGuiSettings = {
      colorCycle: 6,
      react_lat_m: true,
      react_lat_n1: false,
      react_lat_n2: false,
      react_lat_n3: false,
  		lat_m:  2,
  		lat_n1: 10,
      lat_n2: 10,
      lat_n3: 10,

      react_long_m: false,
      react_long_n1: false,
      react_long_n2: false,
      react_long_n3: false,
      long_m:  8,
      long_n1: 60,
      long_n2: 100,
      long_n3: 30
  	};
    visGui.add(visGuiSettings, 'colorCycle').min(0).max(50);
    var latFolder = visGui.addFolder('Latitude');
    latFolder.add(visGuiSettings, 'react_lat_m');
    latFolder.add(visGuiSettings, 'lat_m').min(-20).max(20);
    latFolder.add(visGuiSettings, 'react_lat_n1');
    latFolder.add(visGuiSettings, 'lat_n1').min(-100).max(100);
    latFolder.add(visGuiSettings, 'react_lat_n2');
    latFolder.add(visGuiSettings, 'lat_n2').min(-100).max(100);
    latFolder.add(visGuiSettings, 'react_lat_n3');
    latFolder.add(visGuiSettings, 'lat_n3').min(-100).max(100);

    var longFolder = visGui.addFolder('Longitude');
    longFolder.add(visGuiSettings, 'react_long_m');
    longFolder.add(visGuiSettings, 'long_m').min(-100).max(100);
    longFolder.add(visGuiSettings, 'react_long_n1');
    longFolder.add(visGuiSettings, 'long_n1').min(-100).max(100);
    longFolder.add(visGuiSettings, 'react_long_n2');
    longFolder.add(visGuiSettings, 'long_n2').min(-100).max(100);
    longFolder.add(visGuiSettings, 'react_long_n3');
    longFolder.add(visGuiSettings, 'long_n3').min(-100).max(100);

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
      renderer.setClearColor( new THREE.Color(0x000000) );
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

    // Camera setup
    var camera = new THREE.PerspectiveCamera(35,
      window.innerWidth / window.innerHeight, 0.1, 3000);

      camera.position.set(0, 0, 1000);
      var controls = new THREE.OrbitControls( camera);


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

    function init(){
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

      var spherePoints = calcSphere(200, 20);
      buildSphere(spherePoints);
      scene.add(sphereMesh);
    }
    init();


    function superShapeRadius(theta, m, n1, n2, n3){
      var a = 1;
      var b = 1;

      var t1 = Math.abs((1/a) * Math.cos(m * theta /4));
      t1 = Math.pow(t1, n2);

      var t2 = Math.abs((1/b) * Math.sin(m * theta /4));
      t2 = Math.pow(t2, n3);

      var t3 = t1 + t2;
      r = Math.pow(t3, -1/n1);

      // var r = 1; == sphere
      return r;
    }

    function calcSphere(radius, detailLevel){
      var globePoints = [];

      for (var i = 0; i < detailLevel+1; i++) { //latitude
        var lat = map_range(i, 0, detailLevel, -Math.PI/2, Math.PI/2);
        // get lat supershape radius based off formula
        var f = latSuperRadForumla;
        var r2 = superShapeRadius(lat, f.m, f.n1, f.n2, f.n3);

        var latPoints = [];
        for (var j = 0; j < detailLevel+1; j++) { //longitude
          var long = map_range(j, 0, detailLevel, -Math.PI, Math.PI);
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

    function buildSphere(globePoints) {

      for (var i = 0; i < globePoints.length-1; i++) {

        var hue = map_range(i, 0, globePoints.length-1, 0, 360*6);

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

      sphereGeo.computeFaceNormals();

      // var helper = new THREE.FaceNormalsHelper( sphereMesh, 10, 0xF98F9E, 5 );
      // scene.add(helper);
    }

    var colOffset = 1;

    function updateSphere(globePoints) {

      var newPoints = [];

      for (var i = 0; i < globePoints.length-1; i++) {

        var hue = map_range(i, 0, globePoints.length-1, 0, 360*6);

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
        var hue = map_range(i, 0, sphereGeo.faces.length, 0, 360*visGuiSettings.colorCycle);

        var newCol = new THREE.Color("hsl("+((hue+colOffset)%360)+", 100%, 50%)");
        sphereGeo.faces[i].color.copy(newCol)
      }
      colOffset += 5;
      sphereGeo.colorsNeedUpdate = true;
    }

    function map_range(value, low1, high1, low2, high2) {
			return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
		}

    // Render Loop
    render();

    function render(){

      stats.begin();

      controls.update();

      analyser.getByteFrequencyData(dataArray);
      var da = dataArray[0];

      if (visGuiSettings.react_lat_m) {
        latSuperRadForumla.m = (da/255) * visGuiSettings.lat_m;
      }else{
        latSuperRadForumla.m = visGuiSettings.lat_m;
      }
      if (visGuiSettings.react_lat_n1) {
        latSuperRadForumla.n1 = (da/255) * visGuiSettings.lat_n1;
      }else{
        latSuperRadForumla.n1 = visGuiSettings.lat_n1;
      }
      if (visGuiSettings.react_lat_n2) {
        latSuperRadForumla.n2 = (da/255) * visGuiSettings.lat_n2;
      }else{
        latSuperRadForumla.n2 = visGuiSettings.lat_n2;
      }
      if (visGuiSettings.react_lat_n3) {
        latSuperRadForumla.n3 = (da/255) * visGuiSettings.lat_n3;
      }else{
        latSuperRadForumla.n3 = visGuiSettings.lat_n3;
      }

      if (visGuiSettings.react_long_m) {
        longSuperRadForumla.m = (da/255) * visGuiSettings.long_m;
      }else{
        longSuperRadForumla.m = visGuiSettings.long_m;
      }
      if (visGuiSettings.react_long_n1) {
        longSuperRadForumla.n1 = (da/255) * visGuiSettings.long_n1;
      }else{
        longSuperRadForumla.n1 = visGuiSettings.long_n1;
      }
      if (visGuiSettings.react_long_n2) {
        longSuperRadForumla.n2 = (da/255) * visGuiSettings.long_n2;
      }else{
        longSuperRadForumla.n2 = visGuiSettings.long_n2;
      }
      if (visGuiSettings.react_long_n3) {
        longSuperRadForumla.n3 = (da/255) * visGuiSettings.long_n3;
      }else{
        longSuperRadForumla.n3 = visGuiSettings.long_n3;
      }


      var spherePoints = calcSphere(200, 20);
      updateSphere(spherePoints);

      sphereMesh.rotation.x += 0.01;
      sphereMesh.rotation.y += 0.01;

      renderer.render(scene, camera);

      stats.end();

      requestAnimationFrame(render);
    }
}

function terrainGen(dataArray, bufferLength){

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
      renderer.setClearColor( new THREE.Color(0xefd1b5) );
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

    // Camera setup
    var camera = new THREE.PerspectiveCamera(35,
      window.innerWidth / window.innerHeight, 0.1, 3000);

      camera.position.set(0, -1000, 100);
      var controls = new THREE.OrbitControls(camera);
      // controls.autoRotate = true;
      // controls.minPolarAngle = 0;
      // controls.maxPolarAngle = 0;



    // Scene setup
    var scene, ambientLight, pointLight, worldMesh;


    function init(){
      scene = new THREE.Scene();

      // ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      // ambientLight.position.set(0, 0, 0);
      // scene.add(ambientLight);
      //
      pointLight = new THREE.PointLight(0xffffff, 0.5);
      pointLight.position.set(0, 1000, 1000);
      scene.add(pointLight);

      var pointLightHelper = new THREE.PointLightHelper( pointLight, 10, 0xff0000);
      console.log(pointLightHelper);
      scene.add( pointLightHelper );

      var hemisphere = new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.5 );
      scene.add(hemisphere);

      // var worldGeo = new THREE.SphereGeometry(200, 20, 20);
      // var worldMat = new THREE.MeshStandardMaterial({ color: 0x0000ff, flatShading: true, transparent:true, opacity: 0.5 });
      // var worldMesh = new THREE.Mesh(worldGeo, worldMat);
      // scene.add(worldMesh);

      scene.fog = new THREE.Fog( 0xff4da0, 0.1, 3000 );

      setupTerrain(2500, 2500, 50);
    }
    init();

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

      // var helper = new THREE.FaceNormalsHelper( terrainMesh, 10, 0xF98F9E, 5 );
      // scene.add(helper);
    }

    var yOff = 0;
    var xOff = 0;
    var daIndex = 0;

    function map_range(value, low1, high1, low2, high2) {
			return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
		}

    // Render Loop
    render();

    function render(){

      analyser.getByteFrequencyData(dataArray);

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
      yOff -= speed;
      xOff -= speed2;

      daIndex++;
      if (daIndex >= dataArray.length) {
        daIndex = 0;
      }

      renderer.render(scene, camera);

      stats.end();

      requestAnimationFrame(render);
    }
}

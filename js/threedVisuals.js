function threedTest(){

    $('#visualiser').hide();

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

    // Scene setup
    var scene = new THREE.Scene();

    // Light setup
      // light( colour, strength)
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xffffff, 0.5);
    scene.add(pointLight);

    // Geometry
      // cube(x,y,z)
    var geometry = new THREE.CubeGeometry(100, 100, 100);
    var material = new THREE.MeshLambertMaterial( {color: 0x47d0ef} );
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, -1000);

    scene.add(mesh);

    // Render Loop
    requestAnimationFrame(render);

    function render(){
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }

}

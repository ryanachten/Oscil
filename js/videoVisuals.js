function drosteVideo(dataArray, bufferLength){

  $('#visualiser').hide();

  function resetCanv(){
    var newVis = $('.visual-mode.active').data('visual');
		if( newVis !== 'DrosteVideo'){
			removeP5Canvas(newVis);
			$('.visual-mode').off('click', resetCanv);
		}
	}
	$('.visual-mode').on('click', resetCanv);

  var visGui = new dat.GUI({ autoPlace: false });
	visGui.domElement.id = 'visdat-gui';
	$('#visual-options').append(visGui.domElement);
	var visGuiSettings = {
		positionMode : 'perlin',
		perlinScale : 0.01,
	};
	visGui.add(visGuiSettings, 'positionMode', ['fixed', 'perlin', 'mouse']);
	visGui.add(visGuiSettings, 'perlinScale').min(0.01).max(0.1);

  var p5Init = function( p ) {

    var video;

    p.setup = function() {
      var canvas = p.createCanvas(canvWidth, canvHeight);
      canvas.id('p5-canvas');
      p.background(bgColor);
      video = p.createCapture( p.VIDEO );
      video.id('videoCapture');
      video.size(320, 240);
      video.hide();
    };

    var xoff = 0.01;
    var yoff = 10.01;

    p.draw = function() {

      analyser.getByteFrequencyData(dataArray);
      var da = dataArray[0]/255;
      if(da!==0){
        var vWidth = p.map(da, 0, 1, 0, canvWidth);
        var vHeight = p.map(da, 0, 1, 0, canvHeight);
      }

      // Fixed postion mode
      if(visGuiSettings.positionMode === 'fixed'){
        p.image(video, canvWidth/2-vWidth/2, canvHeight/2-vHeight/2, vWidth, vHeight);
      }

      // Mouse position mode
      else if(visGuiSettings.positionMode === 'mouse'){
        p.image(video, p.mouseX-vWidth/2, p.mouseY-vHeight/2, vWidth, vHeight);
      }

      // Noise position mode
      else if(visGuiSettings.positionMode === 'perlin'){
        var noiseX = p.noise(xoff)*(canvWidth+vWidth);
        var noiseY = p.noise(yoff)*(canvHeight+vHeight);
        xoff+=visGuiSettings.perlinScale;
        yoff+=visGuiSettings.perlinScale;
        p.image(video, noiseX-vWidth, noiseY-vHeight, vWidth, vHeight);
      }

    };
  };

  var myp5 = new p5(p5Init, 'container');
}

function muybridge(dataArray, bufferLength){

    function resetCanv(){
      var newVis = $('.visual-mode.active').data('visual');
      if( newVis !== 'Muybridge'){
        removeP5Canvas(newVis);
        $('.visual-mode').off('click', resetCanv);
      }
    }
    $('.visual-mode').on('click', resetCanv);

    var visGui = new dat.GUI({ autoPlace: false });
  	visGui.domElement.id = 'visdat-gui';
  	$('#visual-options').append(visGui.domElement);
  	var visGuiSettings = {
  		tileCount : 10,
  	};
    visGui.add(visGuiSettings, 'tileCount').min(2).max(20).step(1);

    var p5Init = function( p ) {

      var video, total;
      var snapshots = [];
      var counter = 0;
      var prevTileCount = visGuiSettings.tileCount;

      p.setup = function() {
        $('#visualiser').hide();
        var canvas = p.createCanvas(canvWidth, canvHeight);
        canvas.id('p5-canvas');

        video = p.createCapture( p.VIDEO );
        video.id('videoCapture');
        video.size(320, 240);
        video.hide();

        p.background(bgColor);
      };

      p.draw = function() {
        // If the current tileCount is not the same as GUI's
        // reset the visualisation
        if(visGuiSettings.tileCount !== prevTileCount){
          snapshots = [];
          counter = 0;
          i = 0;
          prevTileCount = visGuiSettings.tileCount;
        }
        // console.log(snapshots.length);
        var w = canvWidth / visGuiSettings.tileCount;
        var h = canvHeight / visGuiSettings.tileCount;
        var x = 0;
        var y = 0;
        var i;

        // How many cells fit in the canvas
        total = p.floor(canvWidth / w) * p.floor(canvHeight / h);

        snapshots[counter] = video.get();
        counter++;
        if (counter === total) {
          counter = 0;
        }

        for (i = 0; i < snapshots.length; i++) {
          // Use counter instead of p5's frameCount
          // to allow for reset functionality
          var index = (i + counter) % snapshots.length;
          p.image(snapshots[index], x, y, w, h);
          x = x + w;
          if (x >= canvWidth) {
            x = 0;
            y = y + h;
          }
        }
      };
    };

    var myp5 = new p5(p5Init, 'container');
}

function rippleTank(dataArray, bufferLength){

    $('#visualiser').hide();

    function resetCanv(){
      var newVis = $('.visual-mode.active').data('visual');
      if( newVis !== 'RippleTank'){
        removeP5Canvas(newVis);
        $('.visual-mode').off('click', resetCanv);
      }
    }
    $('.visual-mode').on('click', resetCanv);

    var visGui = new dat.GUI({ autoPlace: false });
  	visGui.domElement.id = 'visdat-gui';
  	$('#visual-options').append(visGui.domElement);
  	var visGuiSettings = {
  		xReact : true,
      yReact : true,
      minCellSize : 1,
      maxCellSize : 20,
  	};
    visGui.add(visGuiSettings, 'xReact');
    visGui.add(visGuiSettings, 'yReact');
    visGui.add(visGuiSettings, 'minCellSize').min(0).max(50);
    visGui.add(visGuiSettings, 'maxCellSize').min(0).max(50);

    var p5Init = function( p ) {

      var video;
      var vScale = 16

      p.setup = function() {
        var canvas = p.createCanvas(canvWidth, canvHeight);
        canvas.id('p5-canvas');
        p.pixelDensity(1); //for retina displays

        video = p.createCapture(p.VIDEO);
        video.id('videoCapture');
        video.size(canvWidth/vScale, canvHeight/vScale);
        video.hide();
      };

      p.draw = function() {
        analyser.getByteFrequencyData(dataArray);
        p.background(bgColor);

        video.loadPixels();
        p.loadPixels();

        for (var y = 0; y < video.height; y++) {
          for (var x = 0; x < video.width; x++) {
            var index = (x + y * video.width) *4;
            var r = video.pixels[index +0];
            var g = video.pixels[index +1];
            var b = video.pixels[index +2];

            var cellSizeX, cellSizeY;
            cellSizeY = cellSizeX = vScale;

            if(visGuiSettings.xReact){
              cellSizeX = p.map(dataArray[x], 0, 255, vScale*visGuiSettings.minCellSize, vScale*visGuiSettings.maxCellSize);
            }
            if(visGuiSettings.yReact){
              cellSizeY = p.map(dataArray[x], 0, 255, vScale*visGuiSettings.minCellSize, vScale*visGuiSettings.maxCellSize);
            }

            p.noStroke();
            p.fill(r, g, b);
            p.rectMode(p.CENTER);
            p.rect(x*vScale, y*vScale, cellSizeX, cellSizeY);
          }
        }
      };
    };

    var myp5 = new p5(p5Init, 'container');
}

function tesserae(dataArray, bufferLength){

    $('#visualiser').hide();

    function resetCanv(){
      var newVis = $('.visual-mode.active').data('visual');
      if( newVis !== 'Tesserae'){
        removeP5Canvas(newVis);
        $('.visual-mode').off('click', resetCanv);
      }
    }
    $('.visual-mode').on('click', resetCanv);

    var visGui = new dat.GUI({ autoPlace: false });
  	visGui.domElement.id = 'visdat-gui';
  	$('#visual-options').append(visGui.domElement);
  	var visGuiSettings = {
  		threshold : 25,
      minCellSize : 1,
      maxCellSize : 90
  	};
    visGui.add(visGuiSettings, 'threshold').min(0).max(255);
    visGui.add(visGuiSettings, 'minCellSize').min(0).max(200);
    visGui.add(visGuiSettings, 'maxCellSize').min(0).max(200);

    var p5Init = function( p ) {

      var video;
      var vScale = 16

      p.setup = function() {
        var canvas = p.createCanvas(canvWidth, canvHeight);
        canvas.id('p5-canvas');
        p.pixelDensity(1); //for retina displays

        video = p.createCapture(p.VIDEO);
        video.id('videoCapture');
        video.size(canvWidth/vScale, canvHeight/vScale);
        video.hide();
      };


      p.draw = function() {
        p.background(bgColor);

        video.loadPixels();
        p.loadPixels();

        var threshold = visGuiSettings.threshold;
        analyser.getByteFrequencyData(dataArray);
        // console.log(dataArray.length);

        for (var y = 0; y < video.height; y++) {
          for (var x = 0; x < video.width; x++) {
            var index = (x + y * video.width) *4;
            var r = video.pixels[index +0];
            var g = video.pixels[index +1];
            var b = video.pixels[index +2];

            var bright = (r + g + b) /3;
            var da = p.map(dataArray[p.floor(x/2)], 0, 255, 0, 1);
            // console.log('da', da);

            cellSize = p.map(bright, 0, 255, visGuiSettings.minCellSize,  da*visGuiSettings.maxCellSize);

            p.noStroke();
            if( bright > threshold ){
              p.fill(r, g, b);
            }
            else{
              p.fill(bgColor);
            }
            p.rectMode(p.CENTER);
            p.rect(x*vScale, y*vScale, cellSize, cellSize);
          }
        }
      };
    };

    var myp5 = new p5(p5Init, 'container');
}

function particlePainting(dataArray, bufferLength){

  $('#visualiser').hide();

    function resetCanv(){
      var newVis = $('.visual-mode.active').data('visual');
      if( newVis !== 'ParticlePainting'){
        removeP5Canvas(newVis);
        $('.visual-mode').off('click', resetCanv);
      }
    }
    $('.visual-mode').on('click', resetCanv);

    var visGui = new dat.GUI({ autoPlace: false });
  	visGui.domElement.id = 'visdat-gui';
  	$('#visual-options').append(visGui.domElement);
  	var visGuiSettings = {
      clearBg : false,
  		paintAlpha : 127,
      particleCount : 200,
      maxParticleSize : 100,
      minParticleSize : 10,
  	};
    visGui.add(visGuiSettings, 'clearBg');
    visGui.add(visGuiSettings, 'paintAlpha').min(0).max(255);

    visGui.add(visGuiSettings, 'maxParticleSize').min(30).max(200);
    visGui.add(visGuiSettings, 'minParticleSize').min(0).max(100);

    var p5Init = function( p ) {

      var video;
      var vScale = 16;

      var particles;
      visGui.add(visGuiSettings, 'particleCount').min(50).max(400).onChange(setupParticles);

      function P5Particle(x, y){

        this.x = x;
        this.y = y;
        this.r = p.random(4, 32);

        this.update = function(){
          this.x += p.random(-10, 10);
          this.y += p.random(-10, 10);

          this.x = p.constrain(this.x, 0, canvWidth);
          this.y = p.constrain(this.y, 0, canvHeight);
        }

        this.show = function(){
          p.noStroke();

          var col = video.get(p.floor(this.x/vScale), p.floor(this.y/vScale));

          p.fill(col[0], col[1], col[2], visGuiSettings.paintAlpha);
          p.ellipse(this.x, this.y, this.r, this.r);
        };

      };

      function setupParticles(){
        console.log('setupParticles');
        particles = [];
        for (var i = 0; i < visGuiSettings.particleCount; i++) {
          particles.push( new P5Particle(
            p.random(0,canvWidth),
            p.random(0,canvHeight)
          ));
        }
        console.log('particles.length', particles.length);
      }

      p.setup = function() {

        var canvas = p.createCanvas(canvWidth, canvHeight);
        canvas.id('p5-canvas');
        p.pixelDensity(1); //for retina displays

        video = p.createCapture(p.VIDEO);
        video.id('videoCapture');
        video.size(canvWidth/vScale, canvHeight/vScale);
        video.hide();

        setupParticles();

        p.background(bgColor);
      };

      p.draw = function() {

        analyser.getByteFrequencyData(dataArray);

        if(visGuiSettings.clearBg){
          p.background(bgColor);
        }

        video.loadPixels();
        for (var i = 0; i < particles.length; i++) {

          var daIndex = p.floor(
            p.map(i, 0, particles.length, 0, dataArray.length)
          );

          var newSize = p.map(dataArray[daIndex], 0, 255, visGuiSettings.minParticleSize, visGuiSettings.maxParticleSize);
          particles[i].r = newSize;

          particles[i].update();
          particles[i].show();
        }

      };
    };

    var myp5 = new p5(p5Init, 'container');
}

function slitScan(dataArray, bufferLength){

  $('#visualiser').hide();

    function resetCanv(){
      var newVis = $('.visual-mode.active').data('visual');
      if( newVis !== 'SlitScan'){
        removeP5Canvas(newVis);
        $('.visual-mode').off('click', resetCanv);
      }
    }
    $('.visual-mode').on('click', resetCanv);

    var visGui = new dat.GUI({ autoPlace: false });
  	visGui.domElement.id = 'visdat-gui';
  	$('#visual-options').append(visGui.domElement);
  	var visGuiSettings = {
  		maxWidth : 50,
  	};

    var p5Init = function( p ) {

      var video;
      var xPos = 0;
      var soundIndex = 0;

      p.setup = function() {

        var canvas = p.createCanvas(canvWidth, canvHeight);
        canvas.id('p5-canvas');
        p.pixelDensity(1); //for retina displays

        video = p.createCapture(p.VIDEO);
        video.id('videoCapture');
        video.size(320, 240);
        video.hide();
        visGui.add(visGuiSettings, 'maxWidth').min(0).max(video.width);

        p.background(bgColor);

      };

      p.draw = function() {

        analyser.getByteFrequencyData(dataArray);

        var soundWidth = p.map(dataArray[0], 0, 255, 1, visGuiSettings.maxWidth);

        video.loadPixels();
        //(src, x, w, y, h, xD, wD, yD, hD)
        p.copy(video, (video.width/2) - (soundWidth/2), 0, soundWidth, video.height,
              xPos, 0, soundWidth, canvHeight);

        // increase/reset xPos
        xPos += soundWidth;
        if( xPos > canvWidth) xPos = 0;

        // increase/reset soundIndex
        soundIndex++;
        if(soundIndex > dataArray.length) soundIndex = 0;
      };
    };

    var myp5 = new p5(p5Init, 'container');
}

// Boilerplate p5 video
/*
function testVis(dataArray, bufferLength){

  $('#visualiser').hide();

    function resetCanv(){
      var newVis = $('.visual-mode.active').data('visual');
      if( newVis !== 'TestVis'){
        removeP5Canvas(newVis);
        $('.visual-mode').off('click', resetCanv);
      }
    }
    $('.visual-mode').on('click', resetCanv);

    // var visGui = new dat.GUI({ autoPlace: false });
  	// visGui.domElement.id = 'visdat-gui';
  	// $('#visual-options').append(visGui.domElement);
  	// var visGuiSettings = {
  	// 	tileCount : 10,
  	// };
    // visGui.add(visGuiSettings, 'tileCount').min(2).max(20).step(1);

    var p5Init = function( p ) {

      p.setup = function() {

      };

      p.draw = function() {

      };
    };

    var myp5 = new p5(p5Init, 'container');
}*/

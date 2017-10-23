// Utility function for removing p5 video canvases
function removeP5Canvas(newVisual){
  console.log('Remove p5canv');
  // Remove the p5 canvas
  $('#p5-canvas').remove();
  // Remove the video element
  $('#videoCapture').remove();
  switch (newVisual) {
    // If the new visual is a p5video visual
    // do not show the html canvas (event occurs) after transition
    case 'DrosteVideo':
    case 'Muybridge':
      break;
    default:
      $('#visualiser').show();
  }
}

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

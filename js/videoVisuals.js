function drosteVideo(dataArray, bufferLength){

  $('#visualiser').hide();

  function resetCanv(){
		if($('.visual-mode.active').data('visual') !== 'DrosteVideo'){
			console.log('Remove p5canv');
			// Removes secondary canvas
			$('#p5-canvas').remove();
      $('#visualiser').show();
			// Removes event listener
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

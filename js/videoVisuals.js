function drosteVideo(dataArray, bufferLength){

  $('#visualiser').hide();
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

      // Mouse control mode
      // p.image(video, p.mouseX-vWidth/2, p.mouseY-vHeight/2, vWidth, vHeight);

      // Noise mode
      var noiseX = p.noise(xoff)*(canvWidth+vWidth);
      var noiseY = p.noise(yoff)*(canvHeight+vHeight);
      xoff+=0.05;
      yoff+=0.05;

      p.image(video, noiseX-vWidth, noiseY-vHeight, vWidth, vHeight);
    };
  };

  var myp5 = new p5(p5Init, 'container');
}

function videoTest(dataArray, bufferLength){

  $('#visualiser').hide();
  var p5Init = function( p ) {

    var video;

    p.setup = function() {
      var canvas = p.createCanvas(canvWidth, canvHeight);
      canvas.id('p5-canvas');
      p.background(0);
      video = p.createCapture( p.VIDEO );
      video.size(320, 240);
    };

    p.draw = function() {

      p.tint(255, 0, 150);
      p.image(video, 0, 0, p.mouseX, p.height);
    };
  };

  var myp5 = new p5(p5Init, 'container');
}

import $ from 'jquery';

export function sketch (p) {
  let da = 0;
  let positionMode = 'perlin';
  let perlinScale;
  let video;
  let xoff = 0.01;
  let yoff = 10.01;
  const canvWidth = $(window).width();
  const canvHeight = $(window).height();


  p.setup = function () {
    const existingCanv = $('#p5-canvas');
    if (existingCanv.length > 0) {
      console.log('existingCanv');
      existingCanv.remove();
    }
    const existingCam = $('#videoCapture');
    if (existingCam.length > 0) {
      console.log('existingCam');
      existingCam.remove();
    }


    var canvas = p.createCanvas(canvWidth, canvHeight);
    canvas.id('p5-canvas');

    // p.background('white');
    video = p.createCapture( p.VIDEO );
    video.id('videoCapture');
    video.size(320, 240);
    video.hide();

    console.log('init canvas', canvas);
    console.log('init video', video);

    p.background('blue');

  };

  p.myCustomRedrawAccordingToNewPropsHandler = function (props) {

    da = props.dataArray[0]/255;
    positionMode = props.visualSettings.positionMode.active;
    perlinScale = props.visualSettings.perlinScale.active;
  };

  p.draw = function () {

    // p.background('green');
    var vWidth = p.map(da, 0, 1, 0, canvWidth);
    var vHeight = p.map(da, 0, 1, 0, canvHeight);

    // Fixed postion mode
    if(positionMode === 'fixed'){
      p.image(video, canvWidth/2-vWidth/2, canvHeight/2-vHeight/2, vWidth, vHeight);
    }

    // Mouse position mode
    else if(positionMode === 'mouse'){
      p.image(video, p.mouseX-vWidth/2, p.mouseY-vHeight/2, vWidth, vHeight);
    }

    // Noise position mode
    else if(positionMode === 'perlin'){
      var noiseX = p.noise(xoff)*(canvWidth+vWidth);
      var noiseY = p.noise(yoff)*(canvHeight+vHeight);
      xoff+=perlinScale;
      yoff+=perlinScale;
      p.image(video, noiseX-vWidth, noiseY-vHeight, vWidth, vHeight);
    }
  };
};

export default {
  draw: sketch,
  type: 'video',
  renderer: 'p5',
  settings: {
    positionMode: {
      active: 'perlin',
      options: ['fixed', 'perlin', 'mouse']
    },
		perlinScale: {
      active: 0.01,
      min: 0.01,
      max: 0.1
    },
  },
  thumbImg: 'https://c1.staticflickr.com/9/8888/18438501761_c26ec73209_q.jpg'
}

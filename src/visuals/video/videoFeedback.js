import p5 from 'p5';

// Add to component
/*
var canvas = p.createCanvas(canvWidth, canvHeight);
canvas.id('p5-canvas');
video = p.createCapture( p.VIDEO );
video.id('videoCapture');
video.size(320, 240);
video.hide();

$('#visualiser').hide();

function resetCanv(){
  var newVis = $('.visual-mode.active').data('visual');
  if( newVis !== 'DrosteVideo'){
    removeP5Canvas(newVis);
    $('.visual-mode').off('click', resetCanv);
  }
}
$('.visual-mode').on('click', resetCanv);

var myp5 = new p5(p5Init, 'container');
*/


const init = ({canvasCtx, visualSettings, canvWidth, canvHeight}) => {

  return new Promise(function(resolve, reject) {
    let xoff = 0.01;
    let yoff = 10.01;
    ownSettings = {
      xoff, yoff, video
    }

    resolve(ownSettings);
  });
}


const draw = ({
    canvasCtx, visualSettings, ownSettings,
    canvWidth, canvHeight,
    bufferLength, dataArray
  }) => {

  var da = dataArray[0]/255;
  if(da!==0){
    var vWidth = p.map(da, 0, 1, 0, canvWidth);
    var vHeight = p.map(da, 0, 1, 0, canvHeight);
  }

  // Fixed postion mode
  switch (visSettings.positionMode.active) {
    case 'fixed':
      p.image(video, canvWidth/2-vWidth/2, canvHeight/2-vHeight/2, vWidth, vHeight);
      break;

    case 'mouse':
      p.image(video, p.mouseX-vWidth/2, p.mouseY-vHeight/2, vWidth, vHeight);
      break;

    case 'perlin':
      const noiseX = p.noise(xoff)*(canvWidth+vWidth);
      const noiseY = p.noise(yoff)*(canvHeight+vHeight);
      xoff+=visGuiSettings.perlinScale;
      yoff+=visGuiSettings.perlinScale;
      p.image(video, noiseX-vWidth, noiseY-vHeight, vWidth, vHeight);
      break;

    default:
      p.image(video, canvWidth/2-vWidth/2, canvHeight/2-vHeight/2, vWidth, vHeight);
      break;
  }
};

export default {
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

const init = ({p, visualSettings, canvWidth, canvHeight, video, bgColour}) => {

  return new Promise(function(resolve, reject) {

      const canvas = p.createCanvas(canvWidth, canvHeight);
      canvas.id('p5-canvas');
      // p.frameRate(15);
      p.background(bgColour);

      let xoff = 0.01;
      let yoff = 10.01;
      let ownSettings = {
        xoff, yoff, video
      }

      resolve(ownSettings);
  });
}

const draw = ({
    p, visualSettings, ownSettings,
    canvWidth, canvHeight,
    bufferLength, dataArray
  }) => {

  let { xoff, yoff, video } = ownSettings;
  video.loadPixels();

  const da = dataArray[0]/255;
  const vWidth = p.map(da, 0, 1, 0, canvWidth);
  const vHeight = p.map(da, 0, 1, 0, canvHeight);

  // Fixed postion mode
  switch (visualSettings.positionMode.active) {
    case 'fixed':
      p.image(video, canvWidth/2-vWidth/2, canvHeight/2-vHeight/2, vWidth, vHeight);
      break;

    case 'mouse':
      p.image(video, p.mouseX-vWidth/2, p.mouseY-vHeight/2, vWidth, vHeight);
      break;

    case 'perlin':
      const noiseX = p.noise(xoff)*(canvWidth+vWidth);
      const noiseY = p.noise(yoff)*(canvHeight+vHeight);
      xoff+=visualSettings.perlinScale.active;
      yoff+=visualSettings.perlinScale.active;
      p.image(video, noiseX-vWidth, noiseY-vHeight, vWidth, vHeight);
      break;

    default:
      p.image(video, canvWidth/2-vWidth/2, canvHeight/2-vHeight/2, vWidth, vHeight);
      break;
  }

  return ownSettings = {
    xoff, yoff, video
  }
};

export default {
  init,
  draw,
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
  description: 'Moving infinity mirror cam',
  thumbImg: 'video/oscil_thumb_videofeedback.jpg'
}

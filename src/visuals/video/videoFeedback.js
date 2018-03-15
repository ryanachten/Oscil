const init = ({p, visualSettings, canvWidth, canvHeight, video}) => {

  return new Promise(function(resolve, reject) {

      p.createCanvas(canvWidth, canvHeight);
      // p.frameRate(15);

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
  thumbImg: 'https://c1.staticflickr.com/9/8888/18438501761_c26ec73209_q.jpg'
}

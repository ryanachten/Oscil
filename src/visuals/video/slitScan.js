const init = ({
  p, visualSettings, canvWidth, canvHeight, bgColour, video
}) => {

  return new Promise(function(resolve, reject) {

    const xPos = 0;
    const soundIndex = 0;

    const canvas = p.createCanvas(canvWidth, canvHeight);
    canvas.id('p5-canvas');

    p.background(bgColour);

    const ownSettings = {
      video, canvas,
      xPos, soundIndex
    };
    resolve(ownSettings);
  });
};

const draw = ({
    p, visualSettings, ownSettings,
    canvWidth, canvHeight,
    bufferLength, dataArray
  }) => {

  const { video, canvas } = ownSettings;
  let { xPos, soundIndex } = ownSettings;

  const soundWidth = p.map(dataArray[0], 0, 255, 1, visualSettings.maxWidth.active);

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

  return { video, canvas,
    xPos, soundIndex
  };
};

export default {
  init,
  draw,
  type: 'video',
  renderer: 'p5',
  settings: {
    maxWidth: {
      active: 50,
      min: 0,
      max: 640
    }
  },
  description: 'Based on the slit-scan photographic technique',
  thumbImg: 'video/oscil_thumb_slitscan.jpg'
};

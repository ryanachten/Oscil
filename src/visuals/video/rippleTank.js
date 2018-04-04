const init = ({
  p, visualSettings, canvWidth, canvHeight, video
}) => {

  return new Promise(function(resolve, reject) {

      p.createCanvas(canvWidth, canvHeight);
      p.noStroke();
      p.rectMode(p.CENTER);
      // p.frameRate(25);

      const canvas = p.createCanvas(canvWidth, canvHeight);
      canvas.id('p5-canvas');

      const vScale = {
        width: canvWidth/video.width,
        height: canvHeight/video.height,
      }

      const ownSettings = {
        video, vScale
      }

      resolve(ownSettings);
  });
}

const draw = ({
    p, visualSettings, ownSettings,
    canvWidth, canvHeight, bgColour,
    bufferLength, dataArray
  }) => {
    p.background(bgColour);

    const {video, vScale} = ownSettings;

    video.loadPixels();
    p.loadPixels();

    const minCell = Math.floor(visualSettings.minCellSize.active);
    const maxCell = Math.floor(visualSettings.maxCellSize.active);

    for (let y = 0; y < video.height; y+=2) {
      for (let x = 0; x < video.width; x+=2) {
        var index = (x + y * video.width) *4;
        const r = video.pixels[index +0];
        const g = video.pixels[index +1];
        const b = video.pixels[index +2];

        let cellSizeX = vScale.width;
        let cellSizeY = vScale.height;

        // Scales width against audio length to provide index per current width point
        let soundIndex = undefined;
        if (dataArray.length > 0) {
          soundIndex = Math.floor(
            x * (dataArray.length / video.width)
          );
        }
        if(visualSettings.xReact.active){
          cellSizeX = p.map(
            dataArray[soundIndex],
            0, 255,
            vScale.width* minCell,
            vScale.width* maxCell
          );
        }

        if(visualSettings.yReact.active){
          cellSizeY = p.map(
            dataArray[soundIndex],
            0, 255,
            vScale.height* minCell,
            vScale.height* maxCell);
        }

        p.fill(r, g, b);
        p.rect(x*vScale.width, y*vScale.height, cellSizeX, cellSizeY);
      }
    }

    return ownSettings;
};

export default {
  init,
  draw,
  type: 'video',
  renderer: 'p5',
  description: 'Video distorted by waves of refraction',
  settings: {
    xReact : {
      active: true,
    },
    yReact : {
      active: true,
    },
    minCellSize : {
      active: 10,
      min: 0,
      max: 100
    },
    maxCellSize : {
      active: 100,
      min: 0,
      max: 100
    }
  },
  thumbImg: 'video/oscil_thumb_rippletank.jpg'
}

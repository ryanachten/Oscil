const init = ({p, visualSettings, canvWidth, canvHeight, video}) => {

  return new Promise(function(resolve, reject) {

      let total = 0;
      let snapshots = [];
      let counter = 0;
      let prevTileCount = Math.round(visualSettings.tileCount.active);


      const canvas = p.createCanvas(canvWidth, canvHeight);
      canvas.id('p5-canvas');
      p.frameRate(15);

      const ownSettings = {
        total, snapshots, counter,
        prevTileCount, video
      };

      resolve(ownSettings);
  });
}


const draw = ({
    p, visualSettings, ownSettings,
    canvWidth, canvHeight,
    bufferLength, dataArray
  }) => {

  let {total, snapshots, counter, prevTileCount} = ownSettings;
  const {video} = ownSettings;

  // If the current tileCount is not the same as GUI's
  // reset the visualisation
  const curTileCount = Math.round(visualSettings.tileCount.active);
  if(curTileCount !== prevTileCount){
    snapshots = [];
    counter = 0;
    i = 0;
    prevTileCount = curTileCount;
  }
  // console.log(snapshots.length);
  const w = canvWidth / curTileCount;
  const h = canvHeight / curTileCount;
  let x = 0;
  let y = 0;
  let i;

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
    const index = (i + counter) % snapshots.length;
    p.image(snapshots[index], x, y, w, h);
    x = x + w;
    if (x >= canvWidth) {
      x = 0;
      y = y + h;
    }
  }

  return ownSettings = {
    total, snapshots, counter,
    prevTileCount, video
  }
}

export default {
  init,
  draw,
  type: 'video',
  renderer: 'p5',
  settings: {
      tileCount: {
        active: 4,
        min: 2,
        max: 20
      }
  },
  description: 'Grid-based stop motion stream',
  thumbImg: 'video/oscil_thumb_muybridge.jpg'
}

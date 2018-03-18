const init = ({
  p, visualSettings, canvWidth, canvHeight, video
}) => {

  return new Promise(function(resolve, reject) {

    var canvas = p.createCanvas(canvWidth, canvHeight);
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
};


const draw = ({
    p, visualSettings, ownSettings,
    canvWidth, canvHeight,
    bufferLength, dataArray
  }) => {

  const {video, vScale} = ownSettings;

  p.background('white');

  video.loadPixels();
  p.loadPixels();

  var threshold = visualSettings.threshold.active;

  const minCell = Math.floor(visualSettings.minCellSize.active);
  const maxCell = Math.floor(visualSettings.maxCellSize.active);

  for (var y = 0; y < video.height; y++) {
    for (var x = 0; x < video.width; x++) {
      var index = (x + y * video.width) *4;
      var r = video.pixels[index +0];
      var g = video.pixels[index +1];
      var b = video.pixels[index +2];

      var bright = (r + g + b) /3;
      var da = p.map(dataArray[p.floor(x/2)], 0, 255, 0, 1);

      // const cellSize = p.map(bright, 0, 255,
      //   visualSettings.minCellSize.active,
      //   da*visualSettings.maxCellSize.active);

      p.noStroke();
      if( bright > threshold ){
        p.fill(r, g, b);
      }
      else{
        p.fill('white');
      }
      p.rectMode(p.CENTER);

      const cellSizeX = p.map(
        bright,
        0, 255,
        vScale.width* minCell,
        vScale.width* maxCell +da);

      const cellSizeY = p.map(
        bright,
        0, 255,
        vScale.height* minCell,
        vScale.height* maxCell +da);

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
  settings:{
    threshold: {
      active: 25,
      min: 0,
      max: 255
    },
    minCellSize: {
      active: 1,
      min: 0,
      max: 200
    },
    maxCellSize: {
      active: 90,
      min: 0,
      max: 200
    }
  },
  thumbImg: 'https://c2.staticflickr.com/4/3882/14781900731_2b5475e2da_q.jpg'
}

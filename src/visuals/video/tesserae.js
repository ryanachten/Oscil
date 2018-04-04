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
    canvWidth, canvHeight, bgColour,
    bufferLength, dataArray
  }) => {

  const {video, vScale} = ownSettings;

  p.background(bgColour);

  video.loadPixels();
  p.loadPixels();

  var threshold = visualSettings.threshold.active;

  const da = p.map(dataArray[0], 0, 255, 0, 1);

  const minCell = Math.floor(visualSettings.minCellSize.active * da);
  const maxCell = Math.floor(visualSettings.maxCellSize.active * da);

  for (var y = 0; y < video.height; y+=4) {
    for (var x = 0; x < video.width; x+=4) {
      var index = (x + y * video.width) *4;
      var r = video.pixels[index +0];
      var g = video.pixels[index +1];
      var b = video.pixels[index +2];

      var bright = (r + g + b) /3;

      p.noStroke();
      if( bright > threshold ){
        p.fill(r, g, b);
      }
      else{
        p.fill(bgColour);
      }
      p.rectMode(p.CENTER);


      const cellSizeX = p.map(
        bright,
        0, 255,
        minCell,
        maxCell);

      const cellSizeY = p.map(
        bright,
        0, 255,
        minCell,
        maxCell);

      p.rect(x*vScale.width, y*vScale.height, vScale.width*cellSizeX, vScale.height*cellSizeY);
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
      active: 60,
      min: 0,
      max: 200
    }
  },
  description: 'Mosaic based on pixel brightness',
  thumbImg: 'video/oscil_thumb_tesserae.jpg'
}

import $ from 'jquery';

export function sketch (p) {
  let da;
  const canvWidth = $(window).width();
  const canvHeight = $(window).height();
  let tileCount;
  let prevTileCount;
  let snapshots = [];
  let total;
  let video;
  let counter;

  p.setup = function () {
    const existingCanv = $('#p5-canvas');
    if (existingCanv.length > 0) {
      console.log('existingCanv');
      existingCanv.remove();
    }
    
    var canvas = p.createCanvas(canvWidth, canvHeight);
    canvas.id('p5-canvas');
    //
    // video = p.createCapture( p.VIDEO );
    // video.id('videoCapture');
    // video.size(320, 240);
    // video.hide();
    //
    // p.background('white');
    p.background('red');

  };

  p.myCustomRedrawAccordingToNewPropsHandler = function (props) {

    da = props.dataArray[0]/255;
    tileCount = props.visualSettings.tileCount.active;
  };

  p.draw = function () {

    // If the current tileCount is not the same as GUI's
    // reset the visualisation
    // if(tileCount !== prevTileCount){
    //   snapshots = [];
    //   counter = 0;
    //   i = 0;
    //   prevTileCount = tileCount;
    // }
    // // console.log(snapshots.length);
    // var w = canvWidth / tileCount;
    // var h = canvHeight / tileCount;
    // var x = 0;
    // var y = 0;
    // var i;
    //
    // // How many cells fit in the canvas
    // total = p.floor(canvWidth / w) * p.floor(canvHeight / h);
    //
    // snapshots[counter] = video.get();
    // counter++;
    // if (counter === total) {
    //   counter = 0;
    // }
    //
    // for (i = 0; i < snapshots.length; i++) {
    //   // Use counter instead of p5's frameCount
    //   // to allow for reset functionality
    //   var index = (i + counter) % snapshots.length;
    //   p.image(snapshots[index], x, y, w, h);
    //   x = x + w;
    //   if (x >= canvWidth) {
    //     x = 0;
    //     y = y + h;
    //   }
    // }
    p.background('orange');
  };
};

export default {
  draw: sketch,
  type: 'video',
  renderer: 'p5',
  settings: {
      tileCount: {
        active: 4,
        min: 2,
        max: 20
      }
  },
  thumbImg: 'https://c2.staticflickr.com/4/3217/5711527578_9a8bcf7d93_q.jpg'
}

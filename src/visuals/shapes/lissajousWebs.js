import {mapRange} from '../../utilities/visualUtilities';

const init = ({canvasCtx, visualSettings, canvWidth, canvHeight}) => {

  return new Promise(function(resolve, reject) {

    canvasCtx.strokeStyle = 'black';
    const pointCount = visualSettings.pointCount.active;

    const ownSettings = {
      pointCount
    }
    resolve(ownSettings);
  });
}


const draw = ({
    canvasCtx, visualSettings, ownSettings,
    canvWidth, canvHeight, bgColour,
    bufferLength, dataArray
  }) => {

  const pointCount = ownSettings.pointCount;

  const lissajousPoints = [];
  const lineWeight = 1;
  const connectionRadius = 100;

  canvasCtx.clearRect(0,0, canvWidth, canvHeight);
  canvasCtx.fillStyle = bgColour;
  canvasCtx.fillRect(0,0, canvWidth, canvHeight);

  const da = dataArray[0];
  const logda = (Math.log(da) / Math.log(2));

  let freqX, freqY, modFreqX, modFreqY, phi;

  if(isFinite(logda) && logda !== 0){
    freqX = logda * visualSettings.freqX.active;
    freqY = logda * visualSettings.freqY.active;
    modFreqX = logda * visualSettings.modFreqX.active;
    modFreqY = logda * visualSettings.modFreqY.active;
    phi = visualSettings.phi.active - logda;
  }

  for (let i = 0; i <= pointCount; i++) {

    const angle = mapRange(i, 0,pointCount, 0,Math.PI);
    let x = Math.sin(angle * freqX + ((Math.PI/180)*phi) * Math.cos(angle * modFreqX));
    let y = Math.sin(angle * freqY) * Math.cos(angle * modFreqY);

    x = x * (canvWidth/2 -30);
    y = y * (canvHeight/2 -30);

    lissajousPoints.push({
      x: x,
      y: y
    });
  }

  canvasCtx.lineWidth = lineWeight;

  for(let i = 0; i < pointCount; i++){
    for(let j = 0; j < pointCount; j++){

      const p1 = lissajousPoints[i];
      const p2 = lissajousPoints[j];

      const d = Math.sqrt(Math.pow((p2.x-p1.x),2) + Math.pow((p2.y-p1.y),2));
      const a = Math.pow(1/(d/connectionRadius+1), 6);

      if(d <= connectionRadius){
        canvasCtx.beginPath();
        canvasCtx.moveTo(p1.x + canvWidth/2, p1.y + canvHeight/2);
        canvasCtx.lineTo(p2.x  + canvWidth/2, p2.y + canvHeight/2);
        canvasCtx.strokeStyle = 'rgba(0,0,0,' + a +')';
        canvasCtx.stroke();
      }
    }
  }
  return ownSettings;
}


export default {
  init,
  draw,
  type: 'shape',
  renderer: 'html',
  frameRate: 10,
  description: 'Webs plotted from multiple lissajous points',
  thumbImg: 'shapes/oscil_thumb_lissajouswebs.jpg',
  settings: {
    freqX: {
      active: 7,
      min: 1,
      max: 20
    },
    freqY: {
      active: 7,
      min: 1,
      max: 20
    },
    modFreqX: {
      active: 3,
      min: 1,
      max: 20
    },
    modFreqY: {
      active: 2,
      min: 1,
      max: 20
    },
    phi: {
      active: 15,
      min: 1,
      max: 720
    },
    pointCount: {
      active: 500,
      min: 10,
      max: 1000,
      requiresInitOnChange: true
    }
  }
}

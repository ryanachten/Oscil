import {mapRange} from '../../utilities/visualUtilities';

const init = ({canvasCtx, visualSettings, canvWidth, canvHeight}) => {

  return new Promise(function(resolve, reject) {

    canvasCtx.clearRect(0,0, canvWidth, canvHeight);
		canvasCtx.fillStyle = 'white';
		canvasCtx.fillRect(0,0, canvWidth, canvHeight);
    canvasCtx.strokeStyle = 'black';

    const margin = 20;

		const factorX = canvWidth/2 - margin;
		const factorY = canvHeight/2 - margin;

		const pointCount = visualSettings.pointCount.active;
		const freqX = visualSettings.freqX.active;
		const freqY = visualSettings.freqY.active;
    const modulated = visualSettings.modulated.active;
    const modFreqX = 2; //not assigned to gui??
		const modFreqY = 4; //not assigned to gui??
		const phi = visualSettings.phi.active;
    let angle, x, y;

    const ownSettings = {
      factorX, factorY,  pointCount,
      freqX, freqY, modulated, modFreqX, modFreqY,
      phi}

    resolve(ownSettings);
  });
};

const draw = ({
    canvasCtx, visualSettings, ownSettings,
    canvWidth, canvHeight,
    bufferLength, dataArray
  }) => {

		canvasCtx.clearRect(0,0, canvWidth, canvHeight);
		canvasCtx.fillStyle = 'white';
		canvasCtx.fillRect(0,0, canvWidth, canvHeight);

    let {factorX, factorY,  pointCount,
      freqX, freqY, modulated, modFreqX, modFreqY,
      phi} = ownSettings;

		const da = dataArray[0];
		const logda = (Math.log(da) / Math.log(1.2)).toFixed(2);
		if(isFinite(logda) && logda !== 0){
			freqX = logda * visualSettings.freqX.active;
			freqY = logda * visualSettings.freqY.active;
			modFreqX = logda * visualSettings.modFreqX.active;
			modFreqY = logda * visualSettings.modFreqY.active;
			phi = visualSettings.phi.active - logda;
		}

		canvasCtx.beginPath();

		for(let i = 0; i < pointCount; i++){
			const angle = mapRange(i, 0, pointCount, 0, Math.PI*2);

      let x, y;
			if(modulated){
				x = Math.sin(angle*freqX + (Math.PI/180)*phi * Math.cos(angle *modFreqX));
				y = Math.sin(angle*freqY) * Math.cos(angle * modFreqY);
			}else{  //lissajous
				x = Math.sin(angle*freqX + (Math.PI/180)*phi);
				y = Math.sin(angle*freqY);
			}

			x =  x * factorX + canvWidth/2;
			y = y * factorY + canvHeight/2;

			canvasCtx.lineTo(x,y);
		}
		canvasCtx.stroke();

    ownSettings = {
      ...ownSettings,
      freqX, freqY, phi,
      modFreqX, modFreqY }

      return ownSettings;
	};

  export default {
    init,
    draw,
    type: 'shape',
    settings: {
      freqX: {
        active: 70,
        min: 1,
        max: 70
      },
      freqY: {
        active: 40,
        min: 1,
        max: 70
      },
      modFreqX: {
        active: 40,
        min: 1,
        max: 70
      },
      modFreqY: {
        active: 40,
        min: 1,
        max: 70
      },
      phi: {
        active: 95,
        min: 1,
        max: 360
      },
      pointCount: {
        active: 1000,
        min: 10,
        max: 1000,
        requiresInitOnChange: true
      },
      modulated: {
        active: false,
        requiresInitOnChange: true
      },
    },
    thumbImg: 'https://c1.staticflickr.com/1/565/20667874262_8e2d59381d_q.jpg'
  };

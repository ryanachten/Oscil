const init = ({
  canvasCtx, visualSettings,
  canvWidth, canvHeight, bgColour
}) => {

  return new Promise(function(resolve, reject) {

    canvasCtx.clearRect(0,0,canvWidth,canvHeight);
    canvasCtx.fillStyle = bgColour;
    canvasCtx.fillRect(0,0,canvWidth,canvHeight);

    let x = [];
    let y = [];
    let r = []; //radius

    const maxRad = visualSettings.maxRadius.active;
    const showRandomSeeds = visualSettings.showRandNode.active;

    x[0] = Math.random()*canvWidth;
    y[0] = Math.random()*canvHeight;
    r[0] = (Math.random()*maxRad)+1;

    let currentCount = 1;

    resolve({
      x, y, r,
      currentCount,
      showRandomSeeds,
      maxRad
    });
  });
};

const draw = ({
    canvasCtx, visualSettings, ownSettings,
    canvWidth, canvHeight,
    bufferLength, dataArray
  }) => {

		let {currentCount, x, y, r} = ownSettings;
		let {maxRad, showRandomSeeds} = ownSettings;

		//random params
    const da = dataArray[0]/255;
		const newR = (da*maxRad)+1;
		const newX = (Math.random()*canvWidth-newR)+(0+newR);
		const newY = (Math.random()*canvHeight-newR)+(0+newR);
    const curColour = 'hsl('+ da*360 +',50%,70%)';


		let closestDist = 100000000;
		let closestIndex = 0;

		//find closest circle
		for(let i = 0; i < currentCount; i++){
			const newDist = Math.sqrt(Math.pow(newX-x[i],2)+Math.pow(newY-y[i],2));
			if(newDist < closestDist){
				closestDist = newDist;
				closestIndex = i;
			}
		}

		if(showRandomSeeds){
			canvasCtx.beginPath();
			canvasCtx.moveTo(newX, newY);
			canvasCtx.arc(newX, newY, newR, 0, Math.PI*2);
			canvasCtx.fillStyle = curColour;
			canvasCtx.fill();
			canvasCtx.moveTo(newX, newY);
			canvasCtx.lineTo(x[closestIndex], y[closestIndex]);
			canvasCtx.lineWidth = 1;
			canvasCtx.strokeStyle = curColour;
			canvasCtx.stroke();
			canvasCtx.closePath();
		}


		//align to closest circle
		const angle = Math.atan2(newY-y[closestIndex], newX-x[closestIndex]);

		x[currentCount] = x[closestIndex] + Math.cos(angle) * (r[closestIndex]+newR);
		y[currentCount] = y[closestIndex] + Math.sin(angle) * (r[closestIndex]+newR);
		r[currentCount] = newR;
		canvasCtx.beginPath();
		canvasCtx.moveTo(x[currentCount], y[currentCount]);
		canvasCtx.arc(x[currentCount], y[currentCount], r[currentCount]*2, 0, Math.PI*2);
		canvasCtx.fillStyle =  curColour;
		canvasCtx.fill();
		canvasCtx.closePath();

		currentCount++;

    ownSettings = {
      ...ownSettings,
      x, y, r,
      currentCount
    };

    return ownSettings;
	};


export default {
  init,
  draw,
  type: 'shape',
  renderer: 'html',
  settings: {
    showRandNode : {
      active: true,
      requiresInitOnChange: true
    },
    maxRadius : {
      active: 5,
      min: 0,
      max: 20,
      requiresInitOnChange: true
    }
  },
  description: 'Mathematical models of dendritic structures',
  thumbImg: 'shapes/oscil_thumb_browniantree.jpg'
};

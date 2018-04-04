const init = ({
  canvasCtx, visualSettings,
  canvWidth, canvHeight, bgColour
}) => {

  return new Promise(function(resolve, reject) {

    canvasCtx.clearRect(0,0, canvWidth, canvHeight);
		canvasCtx.fillStyle = bgColour;
		canvasCtx.fillRect(0,0, canvWidth, canvHeight);
		canvasCtx.fillStyle = 'black';

    let textSample, typeFace, maxFontSize;
  	let xPos, yPos, endOfPage;
  	let i, fontSize;

    textSample = visualSettings.textInput.active;

    if(visualSettings.case.active === 'upper'){
      textSample = textSample.toUpperCase();
    }else if(visualSettings.case.active === 'lower'){
      textSample = textSample.toLowerCase();
    }

    typeFace = 'Arial';
    maxFontSize = canvHeight/4;
    i = fontSize = 0;

		xPos = 0;
		yPos = maxFontSize/2;
		endOfPage = false;

    const ownSettings = {
      textSample, typeFace, maxFontSize,
      xPos, yPos, endOfPage,
      i, fontSize
    };

    resolve(ownSettings);
  });
}



const draw = ({
    canvasCtx, visualSettings, ownSettings,
    canvWidth, canvHeight, bgColour,
    bufferLength, dataArray
  }) => {

	const resetPage = () => {
		canvasCtx.clearRect(0,0, canvWidth, canvHeight);
		canvasCtx.fillStyle = bgColour;
		canvasCtx.fillRect(0,0, canvWidth, canvHeight);
		canvasCtx.fillStyle = 'black';

		xPos = 0;
		yPos = maxFontSize/2;
		endOfPage = false;
	};

  let { textSample, typeFace, maxFontSize,
  xPos, yPos, endOfPage,
  i, fontSize } = ownSettings;

	let logda, expda;
	const da = dataArray[0];

	if (da !== 0){
		logda = (Math.log(da) / Math.log(7))*-1;
		expda = Math.floor(Math.exp(logda)*1000);
	}

	xPos += fontSize;
	fontSize = Math.floor((Math.random()*maxFontSize+10));
	if((xPos+maxFontSize/2) > canvWidth){
		xPos = 0;
		yPos += visualSettings.leading.active;
		if (yPos > canvHeight) {
			// console.log('Final letter: ' + textSample[i-1] + ' index: ' + i);
			endOfPage = true;
		};
	}
	canvasCtx.font = fontSize + "px "+ typeFace + "";
	canvasCtx.fillText(textSample[i], xPos, yPos);

	if(!endOfPage){
		i++;
		if(i >= textSample.length) i = 0;
		// drawVisual = setTimeout(addLetter, expda);
	}
	else{
		resetPage();
		i++;
		if(i >= textSample.length) i = 0;
		// drawVisual = setTimeout(addLetter, expda);
	}

  ownSettings = {
    textSample, typeFace, maxFontSize,
    xPos, yPos, endOfPage,
    i, fontSize
  }

  return ownSettings;
};

export default {
  init,
  draw,
  type: 'shape',
  renderer: 'html',
  description: 'Paragraph typewriter effect looped continuously',
  thumbImg: 'shapes/oscil_thumb_concretepoetry.jpg',
  frameRate: 30,
  settings: {
    textInput : {
      active: 'there is always soma, delicious soma, half a gramme for a half-holiday, a gramme for a week-end, two grammes for a trip to the gorgeous East, three for a dark eternity on the moon',
      requiresInitOnChange: true
    },
    case: {
      active: 'upper',
      options: ['lower', 'upper', 'off'],
      requiresInitOnChange: true
    },
    leading: {
      active: 100,
      min: 10,
      max: window.innerHeight/2
    }
  }
}

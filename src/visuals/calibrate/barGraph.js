const barGraphDraw = ({
		canvasCtx, canvWidth, canvHeight, bgColour,
		bufferLength, dataArray
	}) => {

	  canvasCtx.fillStyle = bgColour;
	  canvasCtx.fillRect(0, 0, canvWidth, canvHeight);

	  var barWidth = (canvWidth / bufferLength) * 2;
	  var x = 0;

	  for(var i = 0; i < bufferLength; i++) {
      const da = dataArray[i]/255;
		  const barHeight = dataArray[i]*3; //heres where you increase the barheight size bitch

  		var y = canvHeight/2-barHeight/2;

  		canvasCtx.fillStyle = 'hsl('+ da*360 +',50%,70%)';
  		canvasCtx.fillRect(x,y,barWidth,barHeight);

  		x += barWidth;
	  }
}

export default {
  draw: barGraphDraw,
	description: 'Bargraph for testing and calibrating audio',
  type: 'calibrate',
	renderer: 'html',
  // thumbImg: 'https://c1.staticflickr.com/3/2912/14763226235_c97c9a4aba_q.jpg'
	thumbImg: 'shapes/oscil_thumb_bargraph.jpg'
}

const barGraphDraw = ({canvasCtx, canvWidth, canvHeight, bufferLength, dataArray}) => {
  canvasCtx.fillStyle = 'white';
  canvasCtx.fillRect(0, 0, canvWidth, canvHeight);

  const barWidth = (canvWidth / bufferLength) * 2;
  // let barHeight;
  let x = 0;

  for(let i = 0; i < bufferLength; i++) {
    const da = dataArray[i]/255;
    const barHeight = da*canvHeight;

    const y = canvHeight/2-barHeight/2;

    canvasCtx.fillStyle = 'hsl('+ da*360 +',50%,70%)';
    canvasCtx.fillRect(x,y,barWidth,barHeight);

    x += barWidth;
  }
}

export default {
  draw: barGraphDraw,
  type: 'shape',
  thumbImg: 'https://c1.staticflickr.com/3/2912/14763226235_c97c9a4aba_q.jpg'
}

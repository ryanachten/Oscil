export default ({canvasCtx, canvWidth, canvHeight, bufferLength, dataArray}) => {
  canvasCtx.fillStyle = 'white';
  canvasCtx.fillRect(0, 0, canvWidth, canvHeight);

  const barWidth = (canvWidth / bufferLength) * 2;
  let barHeight;
  let x = 0;

  for(let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i]*3;

    const y = canvHeight/2-barHeight/2;

    canvasCtx.fillStyle = 'hsl('+ barHeight +',50%,70%)';
    canvasCtx.fillRect(x,y,barWidth,barHeight);

    x += barWidth;
  }
}

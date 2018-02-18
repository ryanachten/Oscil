export default (canvasCtx, canvWidth, canvHeight, bufferLength, dataArray) => {
  canvasCtx.fillStyle = 'white';
  canvasCtx.fillRect(0,0, canvWidth, canvHeight);
  canvasCtx.lineWidth = 2;

  canvasCtx.beginPath();
  const sliceWidth = canvWidth / bufferLength;
  let x = 0;

  for(let i = 0; i < bufferLength; i++){
    const v = dataArray[i] / 128.0;
    canvasCtx.strokeStyle = 'hsl('+ dataArray[i]*5 +',80%,70%)';
    const y = v * canvHeight/2;

    if(i===0){
      canvasCtx.moveTo(x,y);
    }else{
      canvasCtx.lineTo(x,y);
    }
    x += sliceWidth;
  }

  canvasCtx.lineTo(canvWidth, canvWidth/2);
  canvasCtx.stroke();
}

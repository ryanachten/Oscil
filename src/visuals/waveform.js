import {mapRange} from '../utilities/visualUtilities';

export default ({canvasCtx, canvWidth, canvHeight, bufferLength, dataArray}) => {
  canvasCtx.fillStyle = 'white';
  canvasCtx.fillRect(0,0, canvWidth, canvHeight);
  canvasCtx.lineWidth = 2;

  canvasCtx.beginPath();
  const sliceWidth = canvWidth / bufferLength;
  let x = 0;

  for(let i = 0; i < bufferLength; i++){
    const da = dataArray[i] / 255;
    canvasCtx.strokeStyle = 'hsl('+ da*360 +',80%,70%)';
    const y = mapRange(da, 0, 1, 0, canvHeight);

    if(i===0){
      canvasCtx.moveTo(x,y);
    }else{
      canvasCtx.lineTo(x,y);
    }
    x += sliceWidth;
  }

  canvasCtx.lineTo(canvWidth, canvHeight/2);
  canvasCtx.stroke();
}

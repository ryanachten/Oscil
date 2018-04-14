import {mapRange} from '../../utilities/visualUtilities';

const waveformDraw = ({
  canvasCtx, canvWidth, canvHeight, bgColour,
  bufferLength, dataArray
}) => {
  canvasCtx.fillStyle = bgColour;
  canvasCtx.fillRect(0,0, canvWidth, canvHeight);
  canvasCtx.lineWidth = 2;

  canvasCtx.beginPath();
  const sliceWidth = canvWidth / bufferLength;
  let x = 0;

  const hue = (dataArray[0] / 255) * 360;
  canvasCtx.strokeStyle = 'hsl('+ hue +',80%,50%)';

  for(let i = 0; i < bufferLength; i++){
    const da = dataArray[i] / 255;
    const y = canvHeight/2 - (da * (canvHeight/2));

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

export default {
  draw: waveformDraw,
  type: 'calibrate',
  renderer: 'html',
  description: 'Waveform for testing and calibrating audio',
  thumbImg: 'shapes/oscil_thumb_waveform.jpg'
}

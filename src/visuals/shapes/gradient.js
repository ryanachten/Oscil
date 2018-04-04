const gradientDraw = ({canvasCtx, visualSettings, canvWidth, canvHeight, bufferLength, dataArray}) => {
  const colourStops = 5;

  let grad;

  if (visualSettings.gradMode.active === "linear"){
    //Linear
    grad = canvasCtx.createLinearGradient(0,0, canvWidth, canvHeight);
  }
  else{
    //Radial
    grad = canvasCtx.createRadialGradient(
      canvWidth/2,canvHeight/2, 0, //inner circle - can move this later
      canvWidth/2, canvHeight/2,(canvWidth > canvHeight ? canvHeight : canvWidth)/2);	//outer circle
  }

  for(var i=0; i <bufferLength; i++){
    if(dataArray[i] !== 0){
      const h = Math.floor(360/dataArray.length * dataArray[i]);
      grad.addColorStop(0.0,'hsl(' + Math.abs(h-180) + ',80%, 70%)');
      grad.addColorStop(1.0,'hsl(' + h + ',80%, 70%)');
    }
  }

  canvasCtx.fillStyle = grad;
  canvasCtx.fillRect(0,0,canvWidth, canvHeight);
};

export default {
  draw: gradientDraw,
  renderer: 'html',
  type: 'shape',
  settings: {
    gradMode : {
      options: ['linear', 'radial'],
      active: 'radial'
    }
  },
  description: 'Simple linear and radial gradients',
  thumbImg: 'shapes/oscil_thumb_gradient.jpg'
}

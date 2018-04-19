const init = ({canvasCtx, visualSettings, canvWidth, canvHeight}) => {

  return new Promise(function(resolve, reject) {

		const offsetSampleRate = 500;

		const {offsetY, offsetX} = offsetRand(canvWidth, canvHeight);

    const img = new Image();
    img.src = visualSettings.imgUrl.active + ('?' + new Date().getTime());
    img.setAttribute('crossOrigin', '');

    const ownSettings = {
      img,
      offsetX, offsetY,
      offsetSampleRate,
      frameCount: 0
    };
    img.onerror = () => {}
    img.onload = function(){
      console.log(img.height);
      resolve(ownSettings);
    };
  });
};

const offsetRand = (canvWidth, canvHeight) => {
  const offsetY = Math.floor((Math.random() * canvHeight) +1);
  const offsetX = Math.floor((Math.random() * canvWidth) +1);
  return {offsetY, offsetX};
}

const draw = ({
    canvasCtx, visualSettings, ownSettings,
    canvWidth, canvHeight,
    bufferLength, dataArray
  }) => {

  const {img, offsetSampleRate} = ownSettings;
  let {offsetY, offsetX, frameCount} = ownSettings;

  // Swap out old setInterval approach for manual frameCount
  // for easier cleanup
  if (frameCount % offsetSampleRate === 0) {
    const offset = offsetRand(canvWidth, canvHeight);
    offsetY = offset.offsetY;
    offsetX = offset.offsetX ;
  }


  canvasCtx.drawImage(img, 0,0 , canvWidth, canvHeight);

  const imgdata = canvasCtx.getImageData(0,0, canvWidth, canvHeight);
  const data = imgdata.data;
  const modSize = visualSettings.modifySize.active;

  for(let i = 0; i < bufferLength; i+=50) {

    const da = dataArray[i];

    let logda;
    if (da !== 0){
      logda = Math.floor(Math.log(da) / Math.log(1.05));
    }

    function repeatY(){
      let sampleY;
        if(isNaN(logda) || logda == 0 || !isFinite(offsetY)){
          sampleY = canvHeight/2;
        }else{
          if ((Math.ceil(offsetY + logda)) > canvHeight){
            sampleY = Math.ceil(offsetY - logda + 10);
          }else{
            sampleY = Math.floor(offsetY + logda - 10);
          }
        }

      let sampleHeight  = 1;
      if(modSize && !isNaN(da) && da > 0){
        const sampleSize = (visualSettings.sampleSize.active/100) * canvHeight;
        sampleHeight = Math.ceil((da/255) * sampleSize);
        if (sampleY + sampleHeight > canvHeight) {
          sampleY = canvHeight - sampleHeight;
        }
      }

      const frstRow = canvasCtx.getImageData(0,sampleY, canvWidth, sampleHeight);
      canvasCtx.clearRect(0,0, canvWidth, canvHeight);

      for (let i = 0; i < (canvHeight/sampleHeight); i++) {
        canvasCtx.putImageData(frstRow, 0,(i*sampleHeight));
      }
    }

    function repeatX(){
      let sampleX;
        if(isNaN(logda) || logda == 0 || !isFinite(offsetX)){
          sampleX = canvWidth/2;
        }else{
          if ((Math.ceil(offsetX + logda)) > canvWidth){
            sampleX = Math.ceil(offsetX - logda + 10);
          }else{
            sampleX = Math.floor(offsetX + logda - 10);
          }
        }

      let sampleWidth = 1;
      if(modSize && !isNaN(da) && da > 0){
        const sampleSize = (visualSettings.sampleSize.active/100) * canvWidth;
        sampleWidth = Math.ceil((da/255) * sampleSize);
        if (sampleX + sampleWidth > canvHeight) {
          sampleX = canvWidth - sampleWidth;
        }
      }

      const frstCol = canvasCtx.getImageData(sampleX,0, sampleWidth, canvHeight);
      canvasCtx.clearRect(0,0, canvWidth, canvHeight);

      for (let i = 0; i < (canvWidth/sampleWidth); i++) {
        canvasCtx.putImageData(frstCol, (i*sampleWidth), 0);
      }
    }

    const sampleMode = visualSettings.sampleMode.active;
    if(sampleMode === 'vertical' || sampleMode === 'both'){
      repeatY();
    }
    if(sampleMode === 'horizontal' || sampleMode === 'both'){
      repeatX();
    }
  }

  frameCount++;

  return {
    img,
    offsetX, offsetY,
    offsetSampleRate,
    frameCount
  };
}


export default {
  init,
  draw,
  type: 'image',
  renderer: 'html',
  frameRate: 15,
  settings:{
    imgUrl: {
      active: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Haeckel_Actiniae.jpg/800px-Haeckel_Actiniae.jpg',
      requiresInitOnChange: true
    },
    modifySize: {
      active: false
    },
    sampleSize: {
      active: 50,
      min: 1,
      max: 90
    },
    sampleMode: {
      active: 'vertical',
      options: ['vertical', 'horizontal', 'both']
    },
  },
  description: 'Pixels repeated and stretched',
  thumbImg: 'images/oscil_thumb_repeatpix.jpg'
}

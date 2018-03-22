const init = ({canvasCtx, visualSettings, canvWidth, canvHeight}) => {

  return new Promise(function(resolve, reject) {

		const offsetSampleRate = 500;

		const {offsetY, offsetX} = offsetRand(canvWidth, canvHeight);

    const img = new Image();
    img.src = 'https://upload.wikimedia.org/wikipedia/commons/4/44/Jelly_cc11.jpg' + '?' + new Date().getTime();
    img.setAttribute('crossOrigin', '');

    const ownSettings = {
      img,
      offsetX, offsetY,
      offsetSampleRate,
      frameCount: 0
    };

    img.onload = function(){
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
  const modWidth = visualSettings.modifyWidth.active;

  for(let i = 0; i < bufferLength; i+=50) {

    const da = dataArray[i];
    const da2 = dataArray[i+10];
    const da3 = dataArray[i+20];
    let logda, logda2, logda3;

    if (da !== 0){
      logda = Math.floor(Math.log(da) / Math.log(1.05));
    }
    if (da2 !== 0){
      logda2 = Math.floor(Math.log(da2) / Math.log(1.1));
    }
    if (da3 !== 0){
      logda3 = Math.floor(Math.log(da3) / Math.log(1.5));
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

      let sampleHeight;
        if(isNaN(logda2) || logda2 == 0 || !modWidth){
          sampleHeight = 1;
        }else{
          sampleHeight = Math.abs(logda2);
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

      let sampleWidth;
        if(isNaN(logda2) || logda2 == 0 || !modWidth){
          sampleWidth = 1;
        }else{
          sampleWidth = Math.abs(logda2);
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
  settings:{
    modifyWidth: {
      active: false
    },
    sampleMode: {
      active: 'vertical',
      options: ['vertical', 'horizontal', 'both']
    },
  },
  thumbImg: 'https://c2.staticflickr.com/4/3863/14577192530_190923db3c_q.jpg'
}

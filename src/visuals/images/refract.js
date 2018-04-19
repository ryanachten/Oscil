const init = ({
  canvasCtx, visualSettings,
  canvWidth, canvHeight, bgColour
}) => {

  return new Promise(function(resolve, reject) {

    canvasCtx.clearRect(0,0,canvWidth,canvHeight);
    canvasCtx.fillStyle = bgColour;
    canvasCtx.fillRect(0,0, canvWidth, canvHeight);

    const img = new Image();
    img.src = visualSettings.imgUrl.active + ('?' + new Date().getTime());
    img.setAttribute('crossOrigin', '');

    img.onerror = () => {
      console.log('image url w/ valid extension but content not image');

      img.src = imgUrlInput.placeholder;

      alert('Sorry! Issue parsing image');
    };

    img.onload = () => {

      const ownSettings = {
        img
      }
      // startAnimating(visGuiSettings.fps);
      resolve(ownSettings);
    }
  });
};


const draw = ({
    canvasCtx, visualSettings, ownSettings,
    canvWidth, canvHeight,
    bufferLength, dataArray
  }) => {

  const img = ownSettings.img;

  const da = dataArray[0]/255;
  let tileCount = Math.floor(da*visualSettings.maxImgSize.active);

  if (tileCount < 2 || typeof tileCount == 'undefined')
    tileCount = 2;
  if (tileCount % 2 !== 0){
    tileCount+=1;
  }

  canvasCtx.clearRect(0,0,canvWidth, canvHeight);
  canvasCtx.fillRect(0,0,canvWidth, canvHeight);
  tileImg(tileCount);

  function tileImg(tileCount){

    for (var i = 0; i < tileCount; i++) {
      for (var j = 0; j < tileCount; j++){

        var imgWidth = canvWidth/tileCount;
        var imgHeight = canvHeight/tileCount;

        if (i % 2 === 0){
          if (j % 2 === 0){
            canvasCtx.drawImage(img, imgWidth*i, imgHeight*j, imgWidth, imgHeight);
          }else{
            canvasCtx.save();
            canvasCtx.scale(1,-1);
            canvasCtx.translate(0, (canvHeight+imgHeight)*-1);
            canvasCtx.drawImage(img, imgWidth*i, imgHeight*j, imgWidth, imgHeight);
            canvasCtx.restore();
          }
        }else{
          canvasCtx.save();
          canvasCtx.scale(-1,1);
          canvasCtx.translate((canvWidth+imgWidth)*-1, 0);
          if (j % 2 === 0){
            canvasCtx.drawImage(img, imgWidth*i, imgHeight*j, imgWidth, imgHeight);
          }else{
            canvasCtx.save();
            canvasCtx.scale(1,-1);
            canvasCtx.translate(0, (canvHeight+imgHeight)*-1);
            canvasCtx.drawImage(img, imgWidth*i, imgHeight*j, imgWidth, imgHeight);
            canvasCtx.restore();
          }
          canvasCtx.restore();
        }
      }
    }
  }

  ownSettings = {img}
  return ownSettings;
}

export default {
  init,
  draw,
  type: 'image',
  renderer: 'html',
  frameRate: 15,
  settings: {
    imgUrl: {
      active: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Haeckel_Actiniae.jpg/800px-Haeckel_Actiniae.jpg',
      requiresInitOnChange: true
    },
    maxImgSize: {
      active: 20,
      min: 6,
      max: 50
    }
  },
  description: 'Reflect and rotate into patterns',
  thumbImg: 'images/oscil_thumb_refract.jpg'
};

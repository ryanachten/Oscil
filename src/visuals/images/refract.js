const init = ({canvasCtx, visualSettings, canvWidth, canvHeight}) => {

  return new Promise(function(resolve, reject) {

    canvasCtx.clearRect(0,0,canvWidth,canvHeight);
    canvasCtx.fillStyle = 'white';
    canvasCtx.fillRect(0,0, canvWidth, canvHeight);

    const img = new Image();
    img.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Various_Arecaceae.jpg/630px-Various_Arecaceae.jpg' + '?' + new Date().getTime();
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
  const sampleRate = Math.round(visualSettings.sampleRate.active);

  for(var i = 0; i < bufferLength; i+=sampleRate) {
    const da = dataArray[i];
    let tileCount;
    if (da !== 0){
      tileCount = Math.floor(Math.log(da)/Math.log(1.5));
    }

    if (tileCount < 2 || typeof tileCount == 'undefined')
      tileCount = 2;
    if (tileCount % 2 !== 0){
      tileCount+=1;
    }

    canvasCtx.clearRect(0,0,canvWidth, canvHeight);
    canvasCtx.fillRect(0,0,canvWidth, canvHeight);
    tileImg(tileCount);
  }

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
  settings: {
    fps: {
      active: 15,
      min: 5,
      max: 30
    },
    sampleRate: {
      active: 30,
      min: 10,
      max: 50
    }
  },
  thumbImg: 'https://c2.staticflickr.com/6/5553/14763710395_b870d547ce_m.jpg'
};


//
// 	//for controlling FPS
// 	var stop = false;
// 	var frameCount = 0;
// 	var fps, fpsInterval, startTime, now, then, elapsed;
//
// 	function startAnimating(fps){
// 		fpsInterval = 1000/fps;
// 		then = Date.now();
// 		startTime = then;
// 		animate();
// 	}
//
// 	function animate(){
// 		if(stop){
// 			return;
// 		}
// 		drawVisual = requestAnimationFrame(animate);
//
// 		now = Date.now();
// 		elapsed = now - then;
//
// 		if(elapsed > fpsInterval){
// 			then = now - (elapsed % fpsInterval);
//
// 			draw();
// 		}
// 		if($('.visual-mode.active').data('visual') !== 'Refract'){
// 			console.log('clearMe');
// 			window.cancelAnimationFrame(drawVisual);
// 		}
// 	}
// }

const init = ({canvasCtx, visualSettings, canvWidth, canvHeight}) => {

  return new Promise(function(resolve, reject) {
    var img = new Image();
		img.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Various_Cactaceae.jpg/800px-Various_Cactaceae.jpg' + '?' + new Date().getTime();
		img.setAttribute('crossOrigin', '');
		img.onload = function(){

      const ownSettings = {
        img
      };
			resolve(ownSettings);
		};
  })
};

const draw = ({
    canvasCtx, visualSettings, ownSettings,
    canvWidth, canvHeight,
    bufferLength, dataArray
  }) => {

  const n = Math.round(visualSettings.sampleCount.active);
  const sampleCount = Math.pow(2, n);

  const img = ownSettings.img;

  canvasCtx.drawImage(img, 0,0 , canvWidth, canvHeight);

  const imgdata = canvasCtx.getImageData(0,0, canvWidth, canvHeight);
  const data = imgdata.data;


  for(var i = 0; i < bufferLength; i+=70) {

    var da = dataArray[i];
    var da2 = dataArray[i+10];
    var da3 = dataArray[i+20];

    function channelNoise(){

      for (var i = 0; i < data.length; i+=sampleCount) {

        var r = data[i]; var g = data[i+1]; var b = data[i+2];

        r = Math.random() * (Math.max(g, b) - Math.min(g, b)) + Math.min(g, b) * Math.sin(da);			// ;
        g = Math.random() * (Math.max(r, b) - Math.min(r, b)) + Math.min(r, b) * Math.cos(da);			//  );
        b = Math.random() * (Math.max(r, g) - Math.min(r, g)) + Math.min(r, g) * Math.sin(da);		//  );

        for (var j = 0; j < sampleCount/4; j++) {
          data[i+(j*4)] = r; data[i+(j*4+1)] = g; data[i+(j*4+2)] = b;
        }
      }
    }
    channelNoise();
  }

  canvasCtx.putImageData(imgdata, 0,0);

  return ownSettings;
};


export default {
  init,
  draw,
  type: 'image',
  renderer: 'html',
  settings: {
    sampleCount: {
      active : 8,
      min: 3,
      max: 12,
      requiresInitOnChange: true
    }
  },
  description: 'Images represented by dots of colour',
  thumbImg: 'images/oscil_thumb_macroblocks.jpg'
};

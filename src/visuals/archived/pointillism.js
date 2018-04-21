import $ from 'jquery';

const init = ({
  canvasCtx, visualSettings,
  canvWidth, canvHeight, bgColour
}) => {

  return new Promise(function(resolve, reject) {

    let canvas2, canv2Width, canv2Height;

    if ($('#hiddenHtmlCanvas').length > 0) {
      canvas2 = $('#hiddenHtmlCanvas')[0];
    }else{
      canvas2 = document.createElement('canvas');
      canvas2.id = 'hiddenHtmlCanvas';
      canvas2.width = $(window).width();
      canvas2.height = $(window).height();
      canv2Width = canvas2.width;
      canv2Height = canvas2.height;
    }

    const canvas2Ctx = canvas2.getContext('2d');
    document.getElementById('HtmlCanvas').appendChild(canvas2);
    canvas2.style.display = 'none';

    if (visualSettings.imgUrl.active.match(/\.(jpeg|jpg|gif|png)$/) != null) {
      const img = new Image();
      img.src = visualSettings.imgUrl.active + ('?' + new Date().getTime());
      img.width = canv2Width;
      img.height = canv2Height;
      img.setAttribute('crossOrigin', '');

      let imgData, data;
      img.onload = function(){
        canvas2Ctx.drawImage(img, 0,0, canvWidth,canvHeight);

        canvasCtx.clearRect(0,0, canvWidth, canvHeight);
        canvasCtx.fillStyle = bgColour;
        canvasCtx.fillRect(0,0, canvWidth, canvHeight);

        const shapeDataAr = [];

        const sampleCount = Math.round(visualSettings.sampleSize.active);
        const maxSize = visualSettings.maxSize.active;
        const minSize = 0;

        for (let i = 0; i < canvWidth; i+=sampleCount) {
          for (let j = 0; j < canvHeight; j+=sampleCount) {
            imgData = canvas2Ctx.getImageData(i,j, 1,1);
            const data = imgData.data;
            const avg = (data[0] + data[1] + data[2])/3;
            const size = (avg/255);

            const shapeData = {	r: data[0],	g: data[1], b: data[2],
                      avg: avg,
                      size: size,
                      x: i, y: j
            }
            shapeDataAr.push(shapeData);
          }
        }

        const ownSettings = {
          shapeDataAr
        }
        resolve(ownSettings);
      }
    }

  });
};



const draw = ({
    canvasCtx, visualSettings, ownSettings,
    canvWidth, canvHeight, bgColour,
    bufferLength, dataArray
  }) => {

  const {shapeDataAr} = ownSettings;

  const randMax = visualSettings.maxRandomSize.active;
  let shapeMode;
  if(visualSettings.drawMode.active === 'ellipse'){
    shapeMode = 'ellipse';
  }
  else{
    shapeMode = 'line';
  }
  let randPerPixel = false;
  if(visualSettings.randomMode.active) randPerPixel = true;

	canvasCtx.clearRect(0,0, canvWidth, canvHeight);
	canvasCtx.fillStyle = bgColour;
	canvasCtx.fillRect(0,0, canvWidth, canvHeight);

	const da = dataArray[0];

	let sizeRand = 0;
	if(!randPerPixel){
		sizeRand = Math.floor(Math.random()*(da/randMax)+(da/randMax)/2);
	}

	for(let i = 0; i < shapeDataAr.length; i++){

		if(shapeMode === 'ellipse'){
			ellipseMode(i);
		}else{
			lineMode(i);
		}
	}

	function ellipseMode(i){
		if(randPerPixel){
			sizeRand = Math.floor(Math.random()*(da/randMax)+(da/randMax)/2);
		}
		const tempSize = (shapeDataAr[i].size * visualSettings.maxSize.active) + sizeRand;

		canvasCtx.beginPath();
		canvasCtx.arc(shapeDataAr[i].x+(tempSize),shapeDataAr[i].y+(tempSize),tempSize, 0, Math.PI*2);
		canvasCtx.fillStyle ='rgb('+ shapeDataAr[i].r + ',' + shapeDataAr[i].g + ',' + shapeDataAr[i].b +')';
		canvasCtx.fill();
		canvasCtx.closePath();
	}

	function lineMode(i){
		if(randPerPixel){
			sizeRand = Math.floor(Math.random()*(da/randMax)+(da/randMax)/2);
		}
		const tempSize = (shapeDataAr[i].size * visualSettings.maxSize.active) + sizeRand;
		canvasCtx.lineWidth = tempSize;
		canvasCtx.beginPath();
		canvasCtx.moveTo(shapeDataAr[i].x,shapeDataAr[i].y);
		canvasCtx.lineTo(shapeDataAr[i].x+(tempSize*1.5),shapeDataAr[i].y+(tempSize*1.5));
		canvasCtx.strokeStyle ='rgb('+ shapeDataAr[i].r + ',' + shapeDataAr[i].g + ',' + shapeDataAr[i].b +')';
		canvasCtx.stroke();
		canvasCtx.closePath();
	}

  return {
    shapeDataAr
  };
};

export default {
  init,
  draw,
  type: 'image',
  renderer: 'html',
  description: 'Dots of color in patterns to represent an image',
  frameRate: 10,
  thumbImg: 'images/oscil_thumb_pointilism.jpg',
  settings: {
    imgUrl: {
      active: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Haeckel_Siphonophorae.jpg/734px-Haeckel_Siphonophorae.jpg',
      requiresInitOnChange: true
    },
		drawMode: {
      active: 'ellipse',
      options: ['ellipse', 'line']
    },
		randomMode: {
      active: true,
    },
		sampleSize: {
      active: 16,
      min: 2,
      max: 30,
      requiresInitOnChange: true
    },
		maxSize: {
      active: 5,
      min: 2,
      max: 100
    },
		maxRandomSize: {
      active: 20,
      min: 2,
      max: 50
    }
	}
}

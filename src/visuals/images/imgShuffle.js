const init = ({
  canvasCtx, visualSettings,
  canvWidth, canvHeight, bgColour
}) => {

  return new Promise(function(resolve, reject) {
    var imgMode;
  	var counter, initialised, tileCoords; //move mode vars

		canvasCtx.fillStyle = bgColour;
		canvasCtx.fillRect(0,0, canvWidth, canvHeight);

		const tileCount = Math.round(visualSettings.tileCount.active);

		tileCoords = [];
		initialised = false;
		counter = 0;

    // make sure image url contains correct extension
    if (visualSettings.imgUrl.active.match(/\.(jpeg|jpg|gif|png)$/) != null) {
  		const img = new Image();
  		img.src = visualSettings.imgUrl.active;
  		img.setAttribute('crossOrigin', '');

      const ownSettings = {
        img, imgMode,
        counter, initialised, tileCoords,
        tileCount
      }

  		img.onload = function(){
  			resolve(ownSettings);
  		}
    }else{
      console.log('Image does not have correct extension');
    }
  });
};

const draw = ({
    canvasCtx, visualSettings, ownSettings,
    canvWidth, canvHeight,
    bufferLength, dataArray
  }) => {

  const {
    img, imgMode
  } = ownSettings;

  let {
    counter, initialised, tileCoords,
    tileCount
  } = ownSettings;

  const subDivisionLevel = (visualSettings.friction.active/10)*100;
  // console.log(sumDivisionLevel);

	canvasCtx.clearRect(0,0,canvWidth, canvHeight);
	canvasCtx.fillRect(0,0,canvWidth, canvHeight);

	const da = dataArray[0];

  if (!isNaN(da)) {
    if(imgMode === 'random'){
      randomTileImg();
    }else{
      moveTileImg();
    }
  }

	function moveTileImg(){

		var imgWidth = canvWidth/tileCount;
		var imgHeight = canvHeight/tileCount;

		var maxTileCount = Math.floor(da/subDivisionLevel+2);
		var minTileCount = Math.floor((da/subDivisionLevel)/2+2);

		const accel = Math.floor((Math.random()*maxTileCount)+minTileCount);
		// console.log('accel: ' + accel);

		for (var i = 0; i < tileCount; i++) {
			for (var j = 0; j < tileCount; j++){

				if(!initialised){
					var randClipX = Math.floor(Math.random()*(img.width-imgWidth));
					var randClipY = Math.floor(Math.random()*(img.height-imgHeight));

					var directionY = Math.floor(Math.random()*2);
					if(directionY===0) directionY = -1;
					var directionX = Math.floor(Math.random()*2);
					if(directionX===0) directionX = -1;

					var coords = { 	x: randClipX, y: randClipY,
									directX: directionX, directY: directionY};
					tileCoords.push(coords);

				}else{
					randClipX = tileCoords[counter].x;
					randClipY = tileCoords[counter].y;

					var newX = randClipX+=(accel*tileCoords[counter].directX);
					var newY = randClipY+=(accel*tileCoords[counter].directY);
					if(newX > img.width-imgWidth || newX < 0){
						tileCoords[counter].directX *= -1;
						newX = randClipX+=(accel*tileCoords[counter].directX);
					}
					if(newY > img.height-imgHeight || newY < 0){
						tileCoords[counter].directY *= -1;
						newY = randClipY+=(accel*tileCoords[counter].directY);
					}

					tileCoords[counter].x = newX;
					tileCoords[counter].y = newY;

					if(counter+1 >= tileCoords.length){
						counter = 0;
					}else{
						counter++;
					}
				}
				canvasCtx.drawImage(img, 	randClipX, randClipY, //clip pos
											imgWidth, imgHeight, //clip size
											imgWidth*i, imgHeight*j, //place pos
											imgWidth, imgHeight); //place size
			}
		}
		initialised = true;
  }
  return {
      img, imgMode,
      counter, initialised, tileCoords,
      tileCount
    }
}

export default {
  init,
  draw,
  type: 'image',
  renderer: 'html',
  settings: {
    imgUrl: {
      active: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Various_Cactaceae.jpg/800px-Various_Cactaceae.jpg',
      requiresInitOnChange: true
    },
    tileCount: {
      active: 25,
      min: 2,
      max: 50,
      requiresInitOnChange: true
    },
    friction: {
      active: 5,
      min: 1,
      max: 50,
    }
  },
  description: 'Images divided and rearranged',
  thumbImg: 'images/oscil_thumb_imgshuffle.jpg'
}

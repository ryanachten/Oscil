function refract(dataArray, bufferLength){

	//Runtime UI stuff
	var visGui = new dat.GUI({ autoPlace: false });
	visGui.domElement.id = 'visdat-gui';
	$('#visual-options').append(visGui.domElement);
	var visGuiSettings = {
		fps : 15,
		sampleRate : 30,
	};
	visGui.add(visGuiSettings, 'fps').min(5).max(30);
	visGui.add(visGuiSettings, 'sampleRate').min(10).max(50);

	var img, tileCount;
	var fpsRate;
	var sampleRate = visGuiSettings.sampleRate;

	function init(){
		canvasCtx.clearRect(0,0,canvWidth,canvHeight);
		canvasCtx.fillStyle = bgColor;
		canvasCtx.fillRect(0,0, canvWidth, canvHeight);

		img = new Image();
		img.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Various_Arecaceae.jpg/630px-Various_Arecaceae.jpg' + '?' + new Date().getTime();
		img.setAttribute('crossOrigin', '');

		img.onerror = function(){
			console.log('image url w/ valid extension but content not image');

			img.src = imgUrlInput.placeholder;

			alert('Sorry! Issue parsing image');
		}

		img.onload = function(){
			startAnimating(visGuiSettings.fps);
		}
	}
	init();


	function draw(){

		analyser.getByteFrequencyData(dataArray);

		for(var i = 0; i < bufferLength; i+=sampleRate) {
			var da = dataArray[i];
			if (da !== 0){
				tileCount = Math.floor(Math.log(da)/Math.log(1.5));
			}

			if (tileCount < 2 || typeof tileCount == 'undefined') tileCount = 2;
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
	}
	//for controlling FPS
	var stop = false;
	var frameCount = 0;
	var fps, fpsInterval, startTime, now, then, elapsed;

	function startAnimating(fps){
		fpsInterval = 1000/fps;
		then = Date.now();
		startTime = then;
		animate();
	}

	function animate(){
		if(stop){
			return;
		}
		drawVisual = requestAnimationFrame(animate);

		now = Date.now();
		elapsed = now - then;

		if(elapsed > fpsInterval){
			then = now - (elapsed % fpsInterval);

			draw();
		}
		if($('.visual-mode.active').data('visual') !== 'Refract'){
			console.log('clearMe');
			window.cancelAnimationFrame(drawVisual);
		}
	}
}

function macroblocks(dataArray, bufferLength){

		//Runtime UI stuff
		var sampleCount = 256;

		var visGui = new dat.GUI({ autoPlace: false });
		visGui.domElement.id = 'visdat-gui';
		$('#visual-options').append(visGui.domElement);
		var visGuiSettings = {
			sampleCount : 8,
		};
		visGui.add(visGuiSettings, 'sampleCount').min(3).max(12).step(1)
			.onChange(function(n){
				sampleCount = Math.pow(2, n);
				console.log('sampleCount: ' + sampleCount);
		});

		var img = new Image();
		img.src = 'https://upload.wikimedia.org/wikipedia/commons/4/44/Jelly_cc11.jpg' + '?' + new Date().getTime();
		img.setAttribute('crossOrigin', '');
		img.onload = function(){
			draw();
		};

		function draw(){

			var fillScreen = true;
			if (fillScreen){
				canvasCtx.drawImage(img, 0,0 , canvWidth, canvHeight);
			}else{
				//TODO: build aspect ration functionality
				//can use img.width etc
			}
			var imgdata = canvasCtx.getImageData(0,0, canvWidth, canvHeight);
			var data = imgdata.data;


			for(var i = 0; i < bufferLength; i+=70) {

				analyser.getByteFrequencyData(dataArray);
				var da = dataArray[i];
				var da2 = dataArray[i+10];
				var da3 = dataArray[i+20];
				var logda, logda2, logda3;

				if (da !== 0){
					logda = Math.floor(Math.log(da) / Math.log(1.5));
				}
				if (da2 !== 0){
					logda2 = Math.floor(Math.log(da2) / Math.log(1.5));
				}
				if (da3 !== 0){
					logda3 = Math.floor(Math.log(da3) / Math.log(1.5));
				}

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
			drawVisual = requestAnimationFrame(draw);
		}
}

function repeatPix(dataArray, bufferLength){

		//Runtime UI stuff
		var visGui = new dat.GUI({ autoPlace: false });
		visGui.domElement.id = 'visdat-gui';
		$('#visual-options').append(visGui.domElement);
		var visGuiSettings = {
			modifyWidth : false,
			sampleMode : 'vertical',
		}
		visGui.add(visGuiSettings, 'modifyWidth');
		visGui.add(visGuiSettings, 'sampleMode', ['vertical', 'horizontal', 'both']);

		var img = new Image();
		img.src = 'https://upload.wikimedia.org/wikipedia/commons/4/44/Jelly_cc11.jpg' + '?' + new Date().getTime();
		img.setAttribute('crossOrigin', '');
		img.onload = function(){
			draw();
		};

		var offsetSampleRate = 1000;

		var offsetY;
		var offsetX;
		var offsetInterval = window.setInterval(offsetRand, offsetSampleRate);

		function offsetRand(){
			offsetY = Math.floor((Math.random() * canvHeight) +1);
			offsetX = Math.floor((Math.random() * canvWidth) +1);
		}

		function draw(){

			canvasCtx.drawImage(img, 0,0 , canvWidth, canvHeight);

			var imgdata = canvasCtx.getImageData(0,0, canvWidth, canvHeight);
			var data = imgdata.data;
			var modWidth = visGuiSettings.modifyWidth;

			for(var i = 0; i < bufferLength; i+=50) {

				analyser.getByteFrequencyData(dataArray);
				var da = dataArray[i];
				var da2 = dataArray[i+10];
				var da3 = dataArray[i+20];
				var logda, logda2, logda3;

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
					var sampleY;
						if(isNaN(logda) || logda == 0 || !isFinite(offsetY)){
							sampleY = canvHeight/2;
						}else{
							if ((Math.ceil(offsetY + logda)) > canvHeight){
								sampleY = Math.ceil(offsetY - logda + 10);
							}else{
								sampleY = Math.floor(offsetY + logda - 10);
							}
						}

					var sampleHeight;
						if(isNaN(logda2) || logda2 == 0 || !modWidth){
							sampleHeight = 1;
						}else{
							sampleHeight = Math.abs(logda2);
						}

					var frstRow = canvasCtx.getImageData(0,sampleY, canvWidth, sampleHeight);
					canvasCtx.clearRect(0,0, canvWidth, canvHeight);

					for (var i = 0; i < (canvHeight/sampleHeight); i++) {
						canvasCtx.putImageData(frstRow, 0,(i*sampleHeight));
					}
				}

				function repeatX(){
					var sampleX;
						if(isNaN(logda) || logda == 0 || !isFinite(offsetX)){
							sampleX = canvWidth/2;
						}else{
							if ((Math.ceil(offsetX + logda)) > canvWidth){
								sampleX = Math.ceil(offsetX - logda + 10);
							}else{
								sampleX = Math.floor(offsetX + logda - 10);
							}
						}

					var sampleWidth;
						if(isNaN(logda2) || logda2 == 0 || !modWidth){
							sampleWidth = 1;
						}else{
							sampleWidth = Math.abs(logda2);
						}

					var frstCol = canvasCtx.getImageData(sampleX,0, sampleWidth, canvHeight);
					canvasCtx.clearRect(0,0, canvWidth, canvHeight);

					for (var i = 0; i < (canvWidth/sampleWidth); i++) {
						canvasCtx.putImageData(frstCol, (i*sampleWidth), 0);
					}
				}
				if(visGuiSettings.sampleMode === 'vertical'
					|| visGuiSettings.sampleMode === 'both'){
					repeatY();
				}
				if(visGuiSettings.sampleMode === 'horizontal'
					|| visGuiSettings.sampleMode === 'both'){
					repeatX();
				}
			}
			drawVisual = requestAnimationFrame(draw);
		}
}

// TODO: fix or delete
function pixMix(dataArray, bufferLength){

		//Runtime UI stuff
		var visGui = new dat.GUI({ autoPlace: false });
		visGui.domElement.id = 'visdat-gui';
		$('#visual-options').append(visGui.domElement);
		var visGuiSettings = {
			randomMode : false
		}
		visGui.add(visGuiSettings, 'randomMode');

		// canvasCtx.clearRect(0,0 , canvWidth, canvHeight);

		var canvas2 = document.createElement('canvas');
			canvas2.width = $(window).width(); canvas2.height = $(window).height();
			var canv2Width = canvas2.width; var canv2Height = canvas2.height;
			var canvas2Ctx = canvas2.getContext('2d');
			document.getElementById('container').appendChild(canvas2);
			canvas2.style.display = 'none';

		var canvas3 = document.createElement('canvas');
			canvas3.width = $(window).width(); canvas3.height = $(window).height();
			var canv3Width = canvas3.width; var canv3Height = canvas3.height;
			var canvas3Ctx = canvas3.getContext('2d');
			document.getElementById('container').appendChild(canvas3);
			canvas3.style.display = 'none';


		var imgA = new Image();
		imgA.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Jelly_cc11.jpg/800px-Jelly_cc11.jpg' + '?' + new Date().getTime();
		imgA.setAttribute('crossOrigin', '');


		var imgB = new Image();
		imgB.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Olindias_formosa1.jpg/800px-Olindias_formosa1.jpg' + '?' + new Date().getTime();
		imgB.setAttribute('crossOrigin', '');

		var imgAdata, imgBdata, mixData;
		var dataA, dataB;
		var counter = 0;

		imgA.onload = imgB.onload = function(){

			canvas2Ctx.drawImage(imgA, 0,0, canv2Width,canv2Height);
			imgAdata = canvas2Ctx.getImageData(0,0, canv2Width,canv2Height);

			canvas3Ctx.drawImage(imgB, 0,0, canv3Width,canv3Height);
			imgBdata = canvas3Ctx.getImageData(0,0, canv3Width,canv3Height);

			startAnimating(5);
		};

		function draw(){

			canvasCtx.clearRect(0,0, canvWidth, canvHeight);

			for(var k = 0; k < bufferLength; k+=50) {

				analyser.getByteFrequencyData(dataArray);
				var da = dataArray[k];
				var logda = 10;
				if (da !== 0){
					logda = Math.floor(Math.log(da) / Math.log(1.1));
				}

				var sampleSize = logda;
				var tileWidth = canvWidth/sampleSize;
				var tileHeight = canvHeight/sampleSize;

				for (var i = 0; i < sampleSize; i++) { //i=width
					for (var j = 0; j < sampleSize; j++) {

						var rand = Math.floor((Math.random()*2)+1);
						var sampleRandMode = visGuiSettings.randomMode; //TODO: add into UI at runtime
						var sampleRand = Math.floor((Math.random()*sampleSize)+0);

						if (rand%2 == 0) {
							canvasCtx.putImageData(imgAdata, 0, 0, (sampleRandMode ? sampleRand : i)*tileWidth,
													j*tileHeight, tileWidth, tileHeight);
						}else{
							canvasCtx.putImageData(imgBdata, 0, 0, i*tileWidth,
													(sampleRandMode ? sampleRand : j)*tileHeight, tileWidth, tileHeight);
						}
					}
				}
			}

		}

		//for controlling FPS
		var stop = false;
		var frameCount = 0;
		var fps, fpsInterval, startTime, now, then, elapsed;

		function startAnimating(fps){
			fpsInterval = 1000/fps;
			then = Date.now();
			startTime = then;
			animate();
		}


		function animate(){

			if(stop){
				return;
			}
			if(document.getElementById('visual-select').value == 'PixMix'){
				drawVisual = requestAnimationFrame(animate);

				now = Date.now();
				elapsed = now - then;

				if(elapsed > fpsInterval){
					then = now - (elapsed % fpsInterval);

					draw();
				}
			}
			else{
				window.cancelAnimationFrame(drawVisual);
				document.getElementById('container').removeChild(canvas2);
				document.getElementById('container').removeChild(canvas3);
			}
		}
}

// TODO: fix or delete
function pixShuffle(dataArray, bufferLength){

	//Runtime UI stuff
	var visSettings	= document.getElementById('vis-settings');
		visSettings.style.display = 'block';

	var imageAlink = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Jelly_cc11.jpg/800px-Jelly_cc11.jpg';
	var imageAlinkInput = document.createElement('input');
		imageAlinkInput.id = 'imageAlinkInput';
		imageAlinkInput.type = 'text';
		imageAlinkInput.className = 'vis-setting';
		imageAlinkInput.placeholder = imageAlink;
		imageAlinkInput.addEventListener("change", function(){
			imageAlink = imageAlinkInput.value;
			console.log('imageAlink: ' + imageAlink);
			init();
		});

	// visSettings.appendChild(alphaLabel);
	visSettings.appendChild(imageAlinkInput);

	canvasCtx.clearRect(0,0 , canvWidth, canvHeight);

	var canvas2 = document.createElement('canvas');
		canvas2.width = $(window).width(); canvas2.height = $(window).height();
		var canv2Width = canvas2.width; var canv2Height = canvas2.height;
		var canvas2Ctx = canvas2.getContext('2d');
		document.getElementById('container').appendChild(canvas2);
		canvas2.style.display = 'none';

	var canvas3 = document.createElement('canvas');
		canvas3.width = $(window).width(); canvas3.height = $(window).height();
		var canv3Width = canvas3.width; var canv3Height = canvas3.height;
		var canvas3Ctx = canvas3.getContext('2d');
		document.getElementById('container').appendChild(canvas3);
		canvas3.style.display = 'none';


	var imgA = new Image();
	imgA.src = imageAlink + '?' + new Date().getTime();
	imgA.setAttribute('crossOrigin', '');


	var imgB = new Image();
	imgB.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Olindias_formosa1.jpg/800px-Olindias_formosa1.jpg' + '?' + new Date().getTime();
	imgB.setAttribute('crossOrigin', '');

	var imgAdata, imgBdata, mixData;
	var dataA, dataB;
	var counter = 0;

	imgA.onload = imgB.onload = function(){
		init();
	};

	function init(){
		canvas2Ctx.drawImage(imgA, 0,0, canv2Width,canv2Height);
		imgAdata = canvas2Ctx.getImageData(0,0, canv2Width,canv2Height);

		canvas3Ctx.drawImage(imgB, 0,0, canv3Width,canv3Height);
		imgBdata = canvas3Ctx.getImageData(0,0, canv3Width,canv3Height);

		startAnimating(5);
	}

	function draw(){

		for(var k = 0; k < bufferLength; k+=50) {

			analyser.getByteFrequencyData(dataArray);
			var da = dataArray[k];
			var logda = 10;
			if (da !== 0){
				logda = Math.floor(Math.log(da) / Math.log(1.15));
			}

			var sampleSize = logda;
			var tileWidth = canvWidth/sampleSize;
			var tileHeight = canvHeight/sampleSize;

			for (var i = 0; i < sampleSize; i++) { //i=width
				for (var j = 0; j < sampleSize; j++) {

					var rand = Math.floor((Math.random()*4)+-2);

					var sampleRand = Math.floor((Math.random()*sampleSize)+0);

					if (rand%2 == 0) {
						canvasCtx.putImageData(imgAdata, rand*tileWidth, rand*tileHeight, i*tileWidth,
												j*tileHeight, tileWidth, tileHeight);
					}else{
						canvasCtx.putImageData(imgBdata, rand*tileWidth, rand*tileHeight, i*tileWidth,
												j*tileHeight, tileWidth, tileHeight);
					}
				}
			}
		}

	}

	//for controlling FPS
	var stop = false;
	var frameCount = 0;
	var fps, fpsInterval, startTime, now, then, elapsed;

	function startAnimating(fps){
		fpsInterval = 1000/fps;
		then = Date.now();
		startTime = then;
		animate();
	}


	function animate(){

		if(stop){
			return;
		}
		if(document.getElementById('visual-select').value == 'PixShuffle'){
			drawVisual = requestAnimationFrame(animate);

			now = Date.now();
			elapsed = now - then;

			if(elapsed > fpsInterval){
				then = now - (elapsed % fpsInterval);

				draw();
			}
		}
		else{
			window.cancelAnimationFrame(drawVisual);
			document.getElementById('container').removeChild(canvas2);
			document.getElementById('container').removeChild(canvas3);
		}
	}
}

function imgShuffle(dataArray, bufferLength){

	//Runtime UI stuff
	var visGui = new dat.GUI({ autoPlace: false });
	visGui.domElement.id = 'visdat-gui';
	$('#visual-options').append(visGui.domElement);
	var visGuiSettings = {
		drawMode : 'move',
		subdivisions : 5,
	};
	visGui.add(visGuiSettings, 'drawMode', ['random', 'move']).onChange(init);
	visGui.add(visGuiSettings, 'subdivisions').min(1).max(10).onChange(init);

	var imgMode, tileCount;
	var counter, initialised, tileCoords; //move mode vars
	var sumDivisionLevel;

	function init(){
		canvasCtx.clearRect(0,0,canvWidth,canvHeight);
		canvasCtx.fillStyle = bgColor;
		canvasCtx.fillRect(0,0, canvWidth, canvHeight);

		tileCount = 10; //add to GUI
		if(visGuiSettings.drawMode === 'random'){
			imgMode = 'random';
		}else if(visGuiSettings.drawMode === 'move'){
			imgMode = 'move';
		}

		sumDivisionLevel = (visGuiSettings.subdivisions/10)*100;
		tileCoords = [];
		initialised = false;
		counter = 0;

		img = new Image();
		img.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Various_Cactaceae.jpg/800px-Various_Cactaceae.jpg';
		img.setAttribute('crossOrigin', '');

		img.onload = function(){
			if(imgMode === 'random'){
				startAnimating(5);
			}else{
				startAnimating(30);
			}
		}
	}
	init();

	var da;
	function draw(){

		canvasCtx.clearRect(0,0,canvWidth, canvHeight);
		canvasCtx.fillRect(0,0,canvWidth, canvHeight);

		analyser.getByteFrequencyData(dataArray);
		da = dataArray[0];

		if(imgMode === 'random'){
			randomTileImg();
		}else{
			moveTileImg();
		}
	}

	function randomTileImg(){

		var maxTileCount = Math.floor(da/sumDivisionLevel+4);
		var minTileCount = Math.floor((da/sumDivisionLevel)/2+4);
		tileCount = Math.floor((Math.random()*maxTileCount)+minTileCount);

		for (var i = 0; i < tileCount; i++) {
			for (var j = 0; j < tileCount; j++){

				var imgWidth = canvWidth/tileCount;
				var imgHeight = canvHeight/tileCount;

				var randClipX = Math.floor(Math.random()*(img.width-imgWidth));
				var randClipY = Math.floor(Math.random()*(img.height-imgHeight));

				canvasCtx.drawImage(img, 	randClipX, randClipY, //clip pos
											imgWidth, imgHeight, //clip size
											imgWidth*i, imgHeight*j, //place pos
											imgWidth, imgHeight); //place size

			}
		}
	}

	function moveTileImg(){

		var imgWidth = canvWidth/tileCount;
		var imgHeight = canvHeight/tileCount;

		var maxTileCount = Math.floor(da/sumDivisionLevel+2);
		var minTileCount = Math.floor((da/sumDivisionLevel)/2+2);
		accel = Math.floor((Math.random()*maxTileCount)+minTileCount);
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

	//for controlling FPS
	var stop = false;
	var frameCount = 0;
	var fps, fpsInterval, startTime, now, then, elapsed;

	function startAnimating(fps){
		fpsInterval = 1000/fps;
		then = Date.now();
		startTime = then;
		animate();
	}

	function animate(){
		if(stop){
			return;
		}
		drawVisual = requestAnimationFrame(animate);

		now = Date.now();
		elapsed = now - then;

		if(elapsed > fpsInterval){
			then = now - (elapsed % fpsInterval);

			draw();
		}
		if($('.visual-mode.active').data('visual') !== 'ImgShuffle'){
			console.log('clearMe');
			window.cancelAnimationFrame(drawVisual);
			canvasCtx.clearRect(0,0, canvWidth, canvHeight);
			canvasCtx.fillStyle = bgColor;
			canvasCtx.fillRect(0,0, canvWidth, canvHeight);
		}
	}
}

function pixelPainting(dataArray, bufferLength){

	//Runtime UI stuff
	var visGui = new dat.GUI({ autoPlace: false });
	visGui.domElement.id = 'visdat-gui';
	$('#visual-options').append(visGui.domElement)
	var visGuiSettings = {
		drawMode : 'ellipse',
		randomMode : true,
		sampleSize : 16,
		maxSize : 5,
		maxRandomSize : 20
	};
	visGui.add(visGuiSettings, 'drawMode', ['ellipse', 'line']).onChange(init);
	visGui.add(visGuiSettings, 'randomMode').onChange(init);
	visGui.add(visGuiSettings, 'sampleSize').min(12).max(60).onChange(init);
	visGui.add(visGuiSettings, 'maxSize').min(2).max(30).onChange(init);
	visGui.add(visGuiSettings, 'maxRandomSize').min(2).max(50).onChange(init);

	var canvas2 = document.createElement('canvas');
		canvas2.id = 'canvas2';
		canvas2.width = $(window).width(); canvas2.height = $(window).height();
		var canv2Width = canvas2.width; var canv2Height = canvas2.height;
		var canvas2Ctx = canvas2.getContext('2d');
		document.getElementById('container').appendChild(canvas2);
		canvas2.style.display = 'none';

	function removeCanv(){
		if($('.visual-mode.active').data('visual') !== 'PixelPainting'){
			console.log('Remove Canv2');
			canvasCtx.clearRect(0,0, canvWidth, canvHeight);
			canvasCtx.fillStyle = bgColor;
			canvasCtx.fillRect(0,0, canvWidth, canvHeight);
			window.cancelAnimationFrame(drawVisual);
			// Removes secondary canvas
			$('#canvas2').remove();
			// Removes event listener
			$('.visual-mode').off('click', removeCanv);
		}
	}
	$('.visual-mode').on('click', removeCanv);

	var imgUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Antonio_de_Pereda_-_El_sue%C3%B1o_del_caballero_-_Google_Art_Project.jpg/640px-Antonio_de_Pereda_-_El_sue%C3%B1o_del_caballero_-_Google_Art_Project.jpg';
	imgUrl += ('?' + new Date().getTime());
	var img = new Image();
	img.src = imgUrl;
	img.width = canv2Width;
	img.height = canv2Height;
	img.setAttribute('crossOrigin', '');

	var imgData, data;
	img.onload = function(){
		canvas2Ctx.drawImage(img, 0,0, canvWidth,canvHeight);
		init();
	}

	var shapeDataAr;
	var maxSize, minSize;
	var shapeMode;
	var randPerPixel, randMax;

	function init(){
		canvasCtx.clearRect(0,0, canvWidth, canvHeight);
		canvasCtx.fillStyle = bgColor;
		canvasCtx.fillRect(0,0, canvWidth, canvHeight);

		shapeDataAr = [];
		var sampleCount = visGuiSettings.sampleSize;
		maxSize = visGuiSettings.maxSize;
		minSize = 0;
		randMax = visGuiSettings.maxRandomSize;
		if(visGuiSettings.drawMode === 'ellipse'){
			shapeMode = 'ellipse';
		}
		else{
			shapeMode = 'line';
		}
		randPerPixel = false;
		if(visGuiSettings.randomMode) randPerPixel = true;

		for (var i = 0; i < canvWidth; i+=sampleCount) {
			for (var j = 0; j < canvHeight; j+=sampleCount) {
				imgData = canvas2Ctx.getImageData(i,j, 1,1);
				var data = imgData.data;
				var avg = (data[0] + data[1] + data[2])/3;
				var size = (avg/255)*maxSize+minSize;

				var shapeData = {	r: data[0],	g: data[1], b: data[2],
									avg: avg,
									size: size,
									x: i, y: j
				}
				shapeDataAr.push(shapeData);
			}
		}
		startAnimating(10);
	}

	var da;
	function draw(){

		canvasCtx.clearRect(0,0, canvWidth, canvHeight);
		canvasCtx.fillStyle = bgColor;
		canvasCtx.fillRect(0,0, canvWidth, canvHeight);

		analyser.getByteFrequencyData(dataArray);
		da = dataArray[0];

		var sizeRand;
		if(!randPerPixel){
			sizeRand = Math.floor(Math.random()*(da/randMax)+(da/randMax)/2);
		}

		for(var i = 0; i < shapeDataAr.length; i++){

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
			var tempSize = shapeDataAr[i].size + sizeRand;

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
			var tempSize = shapeDataAr[i].size + sizeRand;
			canvasCtx.lineWidth = tempSize;
			canvasCtx.beginPath();
			canvasCtx.moveTo(shapeDataAr[i].x,shapeDataAr[i].y);
			canvasCtx.lineTo(shapeDataAr[i].x+(tempSize*1.5),shapeDataAr[i].y+(tempSize*1.5));
			canvasCtx.strokeStyle ='rgb('+ shapeDataAr[i].r + ',' + shapeDataAr[i].g + ',' + shapeDataAr[i].b +')';
			canvasCtx.stroke();
			canvasCtx.closePath();
		}
	}

	var stop = false;
	var frameCount = 0;
	var fps, fpsInterval, startTime, now, then, elapsed;

	function startAnimating(fps){
		fpsInterval = 1000/fps;
		then = Date.now();
		startTime = then;
		animate();
	}

	function animate(){
		if(stop){
			return;
		}
		drawVisual = requestAnimationFrame(animate);

		now = Date.now();
		elapsed = now - then;

		if(elapsed > fpsInterval){
			then = now - (elapsed % fpsInterval);

			draw();
		}
	}
}

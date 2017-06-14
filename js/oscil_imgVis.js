function refract(dataArray, bufferLength){

	//Runtime UI stuff
	var visSettings	= document.getElementById('vis-settings');
		visSettings.style.display = 'block';

	var imgForm = document.createElement('div');
		imgForm.className = 'vis-setting';
	var imgUrlInput = document.createElement('input');
		imgUrlInput.id = 'imgUrlInput';
		imgUrlInput.type = 'text';
		imgUrlInput.className = 'vis-setting';
		imgUrlInput.placeholder = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Various_Arecaceae.jpg/630px-Various_Arecaceae.jpg';
		imgUrlInput.addEventListener("change", function(){
			init();			
		});
	var imgUrlLabel = document.createElement('label');
		imgUrlLabel.htmlFor = 'imgUrlInput';
		imgUrlLabel.innerHTML = 'Img URL';
		imgUrlLabel.className = 'vis-setting';

	var fpsInput = document.createElement('input');
		fpsInput.type = 'range';
		fpsInput.id = 'fpsInput';
		fpsInput.className = 'vis-setting';
		fpsInput.min = 5;
		fpsInput.max = 30;
		fpsInput.value = 15;
		fpsInput.addEventListener("change", function(){
			init();			
		});
	var fpsLabel = document.createElement('label');
		fpsLabel.htmlFor = 'fpsInput';
		fpsLabel.innerHTML = 'FPS Rate';
		fpsLabel.className = 'vis-setting';

	var sampleRateInput = document.createElement('input');
		sampleRateInput.type = 'range';
		sampleRateInput.id = 'sampleRateInput';
		sampleRateInput.className = 'vis-setting';
		sampleRateInput.min = 10;
		sampleRateInput.max = 50;
		sampleRateInput.value = 30;
		sampleRateInput.addEventListener("change", function(){
			sampleRate = parseInt(sampleRateInput.value);		
		});
	var sampleRateLabel = document.createElement('label');
		sampleRateLabel.htmlFor = 'sampleRateInput';
		sampleRateLabel.innerHTML = 'Sample Rate';
		sampleRateLabel.className = 'vis-setting';

	imgForm.appendChild(imgUrlLabel);
	imgForm.appendChild(imgUrlInput);
	visSettings.appendChild(imgForm);
	visSettings.appendChild(fpsLabel);
	visSettings.appendChild(fpsInput);
	visSettings.appendChild(sampleRateLabel);
	visSettings.appendChild(sampleRateInput);

	var img, tileCount;
	var fpsRate;
	var sampleRate = parseInt(sampleRateInput.value);

	function init(){
		canvasCtx.clearRect(0,0,canvWidth,canvHeight);
		canvasCtx.fillStyle = bgColor;
		canvasCtx.fillRect(0,0, canvWidth, canvHeight);

		img = new Image();
		if(imgUrlInput.value.length > 0){
			if(imgUrlInput.value.match(/\.(jpeg|jpg|gif|png)$/)){
				console.log('valid url (no img extension)');
				img.src = imgUrlInput.value;
				if($('#imgUrlInput').hasClass('is-invalid-input')){
					$('#imgUrlInput').removeClass('is-invalid-input');
				}
			}
			else{
				console.log('invalid url');
				if(!$('#imgUrlInput').hasClass('is-invalid-input')){
					$('#imgUrlInput').addClass('is-invalid-input');
				}
				img.src = imgUrlInput.placeholder;
			}
		}
		else{
			img.src = imgUrlInput.placeholder;
		}

		img.onerror = function(){
			console.log('image url w/ valid extension but content not image');

			img.src = imgUrlInput.placeholder;

			if(!$('#imgUrlInput').hasClass('is-invalid-input')){
				$('#imgUrlInput').addClass('is-invalid-input');
			}
		}

		img.onload = function(){
			startAnimating(fpsInput.value);
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
		if(document.getElementById('visual-select').value !== 'Refract'){
			console.log('clearMe');
			window.cancelAnimationFrame(drawVisual);
		}
	}
}

function macroblocks(dataArray, bufferLength){		


		//Runtime UI stuff
		var visSettings	= document.getElementById('vis-settings');
			visSettings.style.display = 'block';

		var sampleCount = 256;
		var sampleCountInput = document.createElement('input');
			sampleCountInput.id = 'sampleCountInput';
			sampleCountInput.type = 'range';
			sampleCountInput.className = 'vis-setting';
			sampleCountInput.min = 3;
			sampleCountInput.max = 12;
			sampleCountInput.value = 9;
			sampleCountInput.addEventListener("change", function(){
				var n = parseInt(sampleCountInput.value);
				sampleCount = Math.pow(2, n);
				// console.log('sampleCount: ' + sampleCount);
			});

		var sampleCountLabel = document.createElement('label');
			sampleCountLabel.htmlFor = 'sampleCountInput';
			sampleCountLabel.innerHTML = 'Sample Count';
			sampleCountLabel.className = 'vis-setting';

		visSettings.appendChild(sampleCountLabel);
		visSettings.appendChild(sampleCountInput);


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
		var visSettings	= document.getElementById('vis-settings');
			visSettings.style.display = 'block';

		var modSampleWidthMode = document.createElement('input');
			modSampleWidthMode.id = 'modSampleWidthMode';
			modSampleWidthMode.type = 'checkbox';
			modSampleWidthMode.className = 'vis-setting switch-input';
		var modSamplePaddel = document.createElement('label');
			modSamplePaddel.className = 'vis-setting switch-paddle';
			modSamplePaddel.htmlFor = 'modSampleWidthMode';
		var modSampleLabel = document.createElement('label');
			modSampleLabel.htmlFor = 'modSampleWidthMode';
			modSampleLabel.innerHTML = 'Sample Width Mode';
			modSampleLabel.className = 'vis-setting';

		var repeatDiv = document.createElement('form');
			repeatDiv.className = 'vis-setting';

		var repeatXDiv = document.createElement('div');	
			repeatXDiv.className = 'vis-setting switch';
		var repeatXmode = document.createElement('input');
			repeatXmode.id = 'repeatXmode';
			repeatXmode.type = 'radio';
			repeatXmode.name = 'repeatMode';
			repeatXmode.className = 'vis-setting switch-input';
		var repeatXmodePaddel = document.createElement('label');
			repeatXmodePaddel.className = 'vis-setting switch-paddle';
			repeatXmodePaddel.htmlFor = 'repeatXmode';
		var repeatXmodeLabel = document.createElement('label');
			repeatXmodeLabel.htmlFor = 'repeatXmode';
			repeatXmodeLabel.innerHTML = 'Repeat X';
			repeatXmodeLabel.className = 'vis-setting';

		var repeatYDiv = document.createElement('div');	
			repeatYDiv.className = 'vis-setting switch';
		var repeatYmode = document.createElement('input');
			repeatYmode.id = 'repeatYmode';
			repeatYmode.type = 'radio';
			repeatYmode.name = 'repeatMode';
			repeatYmode.checked = true;
			repeatYmode.className = 'vis-setting switch-input';
		var repeatYmodePaddel = document.createElement('label');
			repeatYmodePaddel.className = 'vis-setting switch-paddle';
			repeatYmodePaddel.htmlFor = 'repeatYmode';
		var repeatYmodeLabel = document.createElement('label');
			repeatYmodeLabel.htmlFor = 'repeatYmode';
			repeatYmodeLabel.innerHTML = 'Repeat Y';
			repeatYmodeLabel.className = 'vis-setting';

		var repeatBothDiv = document.createElement('div');	
			repeatBothDiv.className = 'vis-setting switch';
		var repeatBothmode = document.createElement('input');
			repeatBothmode.id = 'repeatBothmode';
			repeatBothmode.type = 'radio';
			repeatBothmode.name = 'repeatMode';
			repeatBothmode.className = 'vis-setting switch-input';
		var repeatBothmodePaddel = document.createElement('label');
			repeatBothmodePaddel.className = 'vis-setting switch-paddle';
			repeatBothmodePaddel.htmlFor = 'repeatBothmode';
		var repeatBothmodeLabel = document.createElement('label');
			repeatBothmodeLabel.htmlFor = 'repeatBothmode';
			repeatBothmodeLabel.innerHTML = 'Both';
			repeatBothmodeLabel.className = 'vis-setting';


		visSettings.appendChild(modSampleLabel);
		visSettings.appendChild(modSampleWidthMode);
		visSettings.appendChild(modSamplePaddel);

				repeatXDiv.appendChild(repeatXmodeLabel);
				repeatXDiv.appendChild(repeatXmode);
				repeatXDiv.appendChild(repeatXmodePaddel);
			repeatDiv.appendChild(repeatXDiv)
				repeatYDiv.appendChild(repeatYmodeLabel);
				repeatYDiv.appendChild(repeatYmode);
				repeatYDiv.appendChild(repeatYmodePaddel);
			repeatDiv.appendChild(repeatYDiv)
			repeatBothDiv.appendChild(repeatBothmodeLabel);
				repeatBothDiv.appendChild(repeatBothmode);
				repeatBothDiv.appendChild(repeatBothmodePaddel);
			repeatDiv.appendChild(repeatBothDiv)
		visSettings.appendChild(repeatDiv);


		var img = new Image();
		img.src = 'https://upload.wikimedia.org/wikipedia/commons/4/44/Jelly_cc11.jpg' + '?' + new Date().getTime();
		img.setAttribute('crossOrigin', '');
		img.onload = function(){
			draw();
		};

		//TODO: add ModHeight checkbox in GUI
		//TODO: add offsetSampleRate slider in GUI
		
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
			var modWidth = modSampleWidthMode.checked;

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
				if(repeatYmode.checked || repeatBothmode.checked){
					repeatY();	
				}
				if(repeatXmode.checked || repeatBothmode.checked){
					repeatX();	
				}
			}
			drawVisual = requestAnimationFrame(draw);
		}
}

function pixMix(dataArray, bufferLength){

		//Runtime UI stuff
		var visSettings	= document.getElementById('vis-settings');
		visSettings.style.display = 'block';
		var randMode = document.createElement('input');
		randMode.id = 'randMode';
		randMode.type = 'checkbox';
		randMode.className = 'vis-setting';
		randMode.addEventListener("change", function(){
			console.log('randMode: ' + randMode.checked);
		});
		var randLabel = document.createElement('label');
		randLabel.htmlFor = 'randMode';
		randLabel.innerHTML = 'Random Mode';
		randLabel.className = 'vis-setting';

		visSettings.appendChild(randLabel);
		visSettings.appendChild(randMode);


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
						var sampleRandMode = randMode.checked; //TODO: add into UI at runtime
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

		var tileCount = 10;
		var tileCoords = [];
		var imgMode;

		function init(){
			canvasCtx.clearRect(0,0,canvWidth,canvHeight);
			canvasCtx.fillStyle = bgColor;
			canvasCtx.fillRect(0,0, canvWidth, canvHeight);

			imgMode = 'random';
						
			img = new Image();
			img.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Various_Cactaceae.jpg/800px-Various_Cactaceae.jpg';

			img.onload = function(){
				if(imgMode === 'random'){
					startAnimating(5);
				}else{
					startAnimating(30);
				}
			}
		}
		init();

		var logda; 

		function draw(){

			canvasCtx.clearRect(0,0,canvWidth, canvHeight);
			canvasCtx.fillRect(0,0,canvWidth, canvHeight);

			analyser.getByteFrequencyData(dataArray);
			var da = dataArray[0];
			if (da !== 0){
				logda = da;
				// logda = Math.log(da) / Math.log(4)
				console.log('da: ' + logda);
			}

			if(imgMode === 'random'){
				randomTileImg();
			}else{
				moveTileImg();
			}
		}

		function randomTileImg(){

			tileCount = Math.floor(logda/30.5+4);
			console.log('tileCount: ' + tileCount);

			for (var i = 0; i < tileCount; i++) {
				for (var j = 0; j < tileCount; j++){

					var imgWidth = canvWidth/tileCount;
					var imgHeight = canvHeight/tileCount;

					var randClipX = Math.floor(Math.random()*(img.width-imgWidth));
					var randClipY = Math.floor(Math.random()*(img.height-imgHeight));
					// console.log('Clip: ' + randClipX + ' ' + randClipY);

					canvasCtx.drawImage(img, 	randClipX, randClipY, //clip pos
												imgWidth, imgHeight, //clip size
												imgWidth*i, imgHeight*j, //place pos
												imgWidth, imgHeight); //place size

				}
			}
		}

		var counter = 0;
		var initialised = false;
		function moveTileImg(){

			var imgWidth = canvWidth/tileCount;
			var imgHeight = canvHeight/tileCount;

			var accel = Math.floor(Math.random()*5+1);
			// accel = 3;		
			
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
			// console.log('initialised');
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
		}
}
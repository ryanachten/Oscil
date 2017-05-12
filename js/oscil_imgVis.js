function refract(dataArray, bufferLength){

	canvasCtx.clearRect(0,0,canvWidth,canvHeight);
	canvasCtx.fillStyle = 'bgColor';
	canvasCtx.fillRect(0,0, canvWidth, canvHeight);

	var img = new Image();
	img.src = 'http://pngimg.com/uploads/palm_tree/palm_tree_PNG2494.png';

	img.onload = function(){
		draw();
	}

	function draw(){
		
		canvasCtx.fillStyle = 'bgColor';
			canvasCtx.fillRect(0,0, canvWidth, canvHeight);

		analyser.getByteFrequencyData(dataArray);
		//TODO: Also doesn't work with any other Fft than 256

		for(var i = 0; i < bufferLength; i+=50) {
			var da = dataArray[i];
			if (da !== 0){
				var tileCount = Math.floor(Math.log(da)/Math.log(1.5));
				if (tileCount < 2) tileCount = 2;

				canvasCtx.clearRect(0,0,canvWidth, canvHeight);
				tileImg(tileCount);
			}
		}
		function tileImg(tileCount){
			
			canvasCtx.globalCompositeOperation = "source-over";
			
			for (var i = 0; i < tileCount; i++) {
				for (var j = 0; j < tileCount; j++){

					var imgWidth = canvWidth/tileCount;
					var imgHeight = canvHeight/tileCount;

					if (i % 2 == 0){
						if (j % 2 == 0){
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
							if (j % 2 == 0){
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
		drawVisual = requestAnimationFrame(draw);
	}
}

function macroblocks(dataArray, bufferLength){		

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

					var sampleCount = 256;

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

		var img = new Image();
		img.src = 'https://upload.wikimedia.org/wikipedia/commons/4/44/Jelly_cc11.jpg' + '?' + new Date().getTime();
		img.setAttribute('crossOrigin', '');
		img.onload = function(){
			draw();
		};

		//TODO: add ModHeight checkbox in GUI
		//TODO: add offsetSampleRate slider in GUI
		var modWidth = false;
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
				// repeatY();

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
				repeatX();
			}
			drawVisual = requestAnimationFrame(draw);
		}
	}

function pixMix(dataArray, bufferLength){

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
						var sampleRandMode = false; //TODO: add into UI at runtime
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
function tests(dataArray, bufferLength){

	console.log('Testing');

	canvasCtx.clearRect(0,0,canvWidth, canvHeight);
	canvasCtx.fillStyle = bgColor;
	canvasCtx.fillRect(0,0,canvWidth, canvHeight);


	function typeDither(){

		var textSample = 'Ryan Achten';
		textSample = textSample.toUpperCase();

		var maxFontSize = canvHeight/4;
		var leading = 100;
		var xPos, yPos, endOfPage, startPos;
		var fontSize;

		// create the off-screen canvas
		var canvasPattern = document.createElement("canvas");
		canvasPattern.id = "canvasPattern";
		var patternWidth = patternHeight = 20;
		canvasPattern.width = patternWidth;
		canvasPattern.height = patternHeight;
		var contextPattern = canvasPattern.getContext("2d");

		var textMode = 'word'; //or 'letter'
		var decorationMode = 'dash'; //or 'pattern'
		
		var letterIndex = 0;

		function init(){

			if(textMode === 'word'){
				fontSize = 100;
				startAnimating(5);
			}
			else{
				startAnimating(2);
			}
		}
		init();


		function draw(){

			if(textMode === 'word'){
				addWord();
			}
			else{
				//cycle setup
				canvasCtx.clearRect(0,0, canvWidth, canvHeight);
				canvasCtx.fillStyle = bgColor;
				canvasCtx.fillRect(0,0, canvWidth, canvHeight);
				canvasCtx.fillStyle = 'black';

				addLetter(letterIndex);
				letterIndex++;
				if(letterIndex >= textSample.length) letterIndex = 0;
			}

		}


		function addWord(){

			//cycle setup
			canvasCtx.clearRect(0,0, canvWidth, canvHeight);
			canvasCtx.fillStyle = bgColor;
			canvasCtx.fillRect(0,0, canvWidth, canvHeight);
			canvasCtx.fillStyle = 'black';

			//center text
			var textLength = textSample.length*(fontSize)+fontSize*2;
			startPos = (canvWidth - textLength)/2- fontSize;

			xPos = startPos;
			yPos = canvHeight/2;


			for(var i = 0; i < textSample.length; i++){

				xPos += fontSize;

				canvasCtx.font = fontSize + "px Arial";

				if(decorationMode === 'dash'){
					dashStrokePatterns();
				}else{
					drawPatternStroke();
				}

				canvasCtx.strokeText(textSample[i], xPos + (Math.random()*(fontSize*2)), yPos + (Math.random()*(fontSize*2)));

				contextPattern.clearRect(0,0,patternWidth,patternHeight);
			}
		}


		function addLetter(i){

			fontSize = (Math.random()*(canvWidth/4))+100;
			xPos = canvWidth/2 - fontSize/2;
			yPos = canvHeight/2 + fontSize/4;

			canvasCtx.font = fontSize + "px Arial";

			if(decorationMode === 'dash'){
				dashStrokePatterns();
			}else{
				drawPatternStroke();
			}

			canvasCtx.strokeText(textSample[i], xPos + (Math.random()*(fontSize/4)),
									yPos + (Math.random()*(fontSize/4)));

			contextPattern.clearRect(0,0,patternWidth,patternHeight);
		}


		function dashStrokePatterns(){
			var dashLength = Math.floor((Math.random()*10)+1);
			var dashGapLength = Math.floor((Math.random()*10)+1);
			canvasCtx.setLineDash([dashLength,dashGapLength]);
			canvasCtx.lineWidth = Math.floor((Math.random()*10)+1);
			var joinRand = Math.floor((Math.random()*3)+1);
			switch(joinRand){
				case 1 :
					canvasCtx.joinStyle = 'bevel';
					break;
				case 2 :
					canvasCtx.joinStyle = 'round';
					break;
				case 3 :
					canvasCtx.joinStyle = 'mitre';
					canvasCtx.mitreLength = Math.floor((Math.random()*10)+1);
					break;
				default : 
					canvasCtx.joinStyle = 'mitre';
					canvasCtx.mitreLength = Math.floor((Math.random()*10)+1);
			}
		}
				
		function drawPatternStroke(){

			// Dot Pattern
			canvasCtx.lineWidth = 10;
			contextPattern.beginPath();
			var radius = Math.floor(Math.random()*10+0);
			contextPattern.arc(patternWidth/2, patternHeight/2, radius, 0, Math.PI*2);
			var colorRand = Math.floor(Math.random()*2);
			if(colorRand === 1){
				canvasCtx.fillStyle = 'black';
				contextPattern.fill();
			}else{
				canvasCtx.strokeStyle = 'black';
				contextPattern.stroke();
			}
			
			//Cross Pattern
			canvasCtx.lineWidth = 10;
			canvasCtx.fillStyle = 'black';
			contextPattern.lineWidth = Math.random()*5;
			var margin = 4;
			contextPattern.beginPath();
			contextPattern.moveTo(0+margin,patternHeight/2);
			contextPattern.lineTo(patternWidth-margin, patternHeight/2);
			contextPattern.moveTo(patternWidth/2,0+margin);
			contextPattern.lineTo(patternWidth/2,patternHeight-margin);
			contextPattern.strokeStyle = 'black';
			contextPattern.stroke();

			var pattern = canvasCtx.createPattern(canvasPattern,"repeat");
			canvasCtx.strokeStyle = pattern;

			canvasCtx.fillStyle = pattern;
			canvasCtx.fillRect(40, 40, 100, 100);
			canvasCtx.fill();
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
	// typeDither();

	function pixelPainting(){

		var canvas2 = document.createElement('canvas');
			canvas2.width = $(window).width(); canvas2.height = $(window).height();
			var canv2Width = canvas2.width; var canv2Height = canvas2.height;
			var canvas2Ctx = canvas2.getContext('2d');
			document.getElementById('container').appendChild(canvas2);
			canvas2.style.display = 'none';

		var imgUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Vasnetsov_Frog_Princess.jpg/800px-Vasnetsov_Frog_Princess.jpg';
		imgUrl += ('?' + new Date().getTime());
		var img = new Image();
		img.src = imgUrl;
		img.width = canv2Width;
		img.height = canv2Height;
		img.setAttribute('crossOrigin', '');

		var imgData, data;
		var shapeDataAr = [];
		img.onload = function(){
			canvas2Ctx.drawImage(img, 0,0, canvWidth,canvHeight);
			// imgData = canvasCtx.getImageData(0,0, canvWidth,canvHeight);
			// data = imgData.data;
			// greyscale();
			init();
		}
 
		var maxSize, minSize;
		function init(){
			//greyscale to srokeweight
			var sampleCount = 8;
			maxSize = 20;
			minSize = 0;
			var counter = 0;

			canvasCtx.strokeStyle = 'black';
			for (var i = 0; i < canvWidth; i+=sampleCount) {
				for (var j = 0; j < canvHeight; j+=sampleCount) {
					imgData = canvas2Ctx.getImageData(i,j, 1,1);
					var data = imgData.data;
					var avg = (data[0] + data[1] + data[2])/3;
					var size = (data[counter]/255)*maxSize+minSize;
					
					var shapeData = {	r: data[0],
										g: data[1],
										b: data[2],
										avg: avg,
										size: size,
										x: i,
										y: j
					}
					shapeDataAr.push(shapeData);
				}
			}
			
			startAnimating(5);
			// draw();
		}

		function draw(){
			for(var i = 0; i < shapeDataAr.length; i++){
				
				var sizeRand = Math.floor(Math.random()*shapeDataAr[i].size/2+0);
				if(Math.floor(Math.random()*2+1) == 2){
					// console.log('negative');
					sizeRand *= -1;
				}

				shapeDataAr[i].size += sizeRand;
				// console.log('size1: ' + shapeDataAr[i].size);
				// console.log('sizeRand: ' + sizeRand);
				if(shapeDataAr[i].size < minSize) shapeDataAr[i].size = maxSize;
				if(shapeDataAr[i].size > maxSize) shapeDataAr[i].size = minSize;
				// console.log('size2: ' + shapeDataAr[i].size);
				// console.log(' ');


				canvasCtx.beginPath();				
				canvasCtx.arc(shapeDataAr[i].x,shapeDataAr[i].y,shapeDataAr[i].size, 0, Math.PI*2);
				canvasCtx.fillStyle ='rgb('+ shapeDataAr[i].r + ',' + shapeDataAr[i].g + ',' + shapeDataAr[i].b +')';
				canvasCtx.fill();
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
	pixelPainting();

}
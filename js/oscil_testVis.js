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


	function imgShuffle(){

		var tileCount = 10;
		var tileCoords = [];

		function init(){
			canvasCtx.clearRect(0,0,canvWidth,canvHeight);
			canvasCtx.fillStyle = bgColor;
			canvasCtx.fillRect(0,0, canvWidth, canvHeight);

			img = new Image();
			img.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Various_Cactaceae.jpg/800px-Various_Cactaceae.jpg';


			img.onload = function(){
				startAnimating(15);
			}
		}
		init();


		function draw(){

			canvasCtx.clearRect(0,0,canvWidth, canvHeight);
			canvasCtx.fillRect(0,0,canvWidth, canvHeight);

			// randomTileImg();
			moveTileImg();
		}

		function randomTileImg(){

			tileCount = Math.floor((Math.random()*20)+2);
			
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
			accel =3;
			console.log('accel: ' + accel);			
			
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
							// console.log('directX: ' + tileCoords[counter].directX);
							tileCoords[counter].directX *= -1;
							// console.log('directX: ' + tileCoords[counter].directX);
						}
						if(newY > img.height-imgHeight || newY < 0){
							// console.log('directY: ' + tileCoords[counter].directY);
							tileCoords[counter].directY *= -1;
							// console.log('directY: ' + tileCoords[counter].directY);
						}
						tileCoords[counter].x = newX;
						tileCoords[counter].y = newY;
						
						if(counter+1 >= tileCoords.length){
							counter = 0;
						}else{
							counter++;
						}
						// console.log('counter: ' + counter);
					}
					// console.log('Clip: ' + randClipX + ' ' + randClipY);
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

	imgShuffle();	
}
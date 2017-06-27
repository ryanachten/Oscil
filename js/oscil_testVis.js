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

	function noiseGraphTest(){

		var Simple1DNoise = function() {

			//noise function via: http://www.michaelbromley.co.uk/blog/90/simple-1d-noise-in-javascript

			var MAX_VERTICES = 256;
			var MAX_VERTICES_MASK = MAX_VERTICES -1;
			var amplitude = 1;
			var scale = 0.1;

			var r = [];

			for ( var i = 0; i < MAX_VERTICES; ++i ) {
				r.push(Math.random());
			}

			var getVal = function( x ){
				var scaledX = x * scale;
				var xFloor = Math.floor(scaledX);
				var t = scaledX - xFloor;
				var tRemapSmoothstep = t * t * ( 3 - 2 * t );

				/// Modulo using &
				var xMin = xFloor & MAX_VERTICES_MASK;
				var xMax = ( xMin + 1 ) & MAX_VERTICES_MASK;

				var y = lerp( r[ xMin ], r[ xMax ], tRemapSmoothstep );

				return y * amplitude;
			};

			/**
			* Linear interpolation function.
			* @param a The lower integer value
			* @param b The upper integer value
			* @param t The value between the two
			* @returns {number}
			*/
			var lerp = function(a, b, t ) {
				return a * ( 1 - t ) + b * t;
			};

			// return the API
			return {
				getVal: getVal,
				setAmplitude: function(newAmplitude) {
					amplitude = newAmplitude;
				},
				setScale: function(newScale) {
					scale = newScale;
				}
			};
		};

		
		var graphSubD = 100;
		var segmentLength = canvWidth/graphSubD;
		var generator = new Simple1DNoise();
		canvasCtx.beginPath();
		for (var i = 0; i < graphSubD; i++) {
			
			var x = 1;
			var y = generator.getVal(i);
			console.log('y: ' + y);
			var posX = segmentLength*i;
			var posY = canvHeight*y;
			// canvasCtx.fillStyle = 'black';
			canvasCtx.lineTo(posX, posY);
			// canvasCtx.arc(, 5, 0, Math.PI*2);
			
		}
		canvasCtx.strokeStyle ='red';
		canvasCtx.stroke();

		canvasCtx.beginPath();
		for (var i = 0; i < graphSubD; i++) {
			var x = 1;
			var y = Math.random();
			console.log('y: ' + y);
			var posX = segmentLength*i;
			var posY = canvHeight*y;
			canvasCtx.lineTo(posX, posY);			
		}
		canvasCtx.strokeStyle ='black';
		canvasCtx.stroke();

	}
	// noiseGraphTest();

	function noiseTextureTest(){

		//Perline noise 2D function via http://asserttrue.blogspot.co.nz/2011/12/perlin-noise-in-javascript_31.html
		PerlinNoise = new function() {

			this.noise = function(x, y, z) {

			   var p = new Array(512)
			   var permutation = [ 151,160,137,91,90,15,
			   131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
			   190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
			   88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
			   77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
			   102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
			   135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
			   5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
			   223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
			   129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
			   251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
			   49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
			   138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
			   ];
			   for (var i=0; i < 256 ; i++) 
			 p[256+i] = p[i] = permutation[i]; 

				  var X = Math.floor(x) & 255,                  // FIND UNIT CUBE THAT
					  Y = Math.floor(y) & 255,                  // CONTAINS POINT.
					  Z = Math.floor(z) & 255;
				  x -= Math.floor(x);                                // FIND RELATIVE X,Y,Z
				  y -= Math.floor(y);                                // OF POINT IN CUBE.
				  z -= Math.floor(z);
				  var    u = fade(x),                                // COMPUTE FADE CURVES
						 v = fade(y),                                // FOR EACH OF X,Y,Z.
						 w = fade(z);
				  var A = p[X  ]+Y, AA = p[A]+Z, AB = p[A+1]+Z,      // HASH COORDINATES OF
					  B = p[X+1]+Y, BA = p[B]+Z, BB = p[B+1]+Z;      // THE 8 CUBE CORNERS,

				  return scale(lerp(w, lerp(v, lerp(u, grad(p[AA  ], x  , y  , z   ),  // AND ADD
												 grad(p[BA  ], x-1, y  , z   )), // BLENDED
										 lerp(u, grad(p[AB  ], x  , y-1, z   ),  // RESULTS
												 grad(p[BB  ], x-1, y-1, z   ))),// FROM  8
								 lerp(v, lerp(u, grad(p[AA+1], x  , y  , z-1 ),  // CORNERS
												 grad(p[BA+1], x-1, y  , z-1 )), // OF CUBE
										 lerp(u, grad(p[AB+1], x  , y-1, z-1 ),
												 grad(p[BB+1], x-1, y-1, z-1 )))));
			   }
			   function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
			   function lerp( t, a, b) { return a + t * (b - a); }
			   function grad(hash, x, y, z) {
				  var h = hash & 15;                      // CONVERT LO 4 BITS OF HASH CODE
				  var u = h<8 ? x : y,                 // INTO 12 GRADIENT DIRECTIONS.
						 v = h<4 ? y : h==12||h==14 ? x : z;
				  return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);
			   } 
			   function scale(n) { return (1 + n)/2; }
		}

		/*
		x /= w; y /= h; // normalize
		size = 10;  // pick a scaling value
		n = PerlinNoise.noise( size*x, size*y, .8 );
		r = g = b = Math.round( 255 * n );
		*/

		
		var graphSubD = 200;
		var segWidth = canvWidth/graphSubD;
		var segHeight = canvHeight/graphSubD;
		var counter = 0;

		for (var i = 0; i < graphSubD; i++) {
			for (var j = 0; j < graphSubD; j++) {
								
				var posX = segWidth*i;
				var posY = segHeight*j;
				var normX = (posX / canvWidth);
				var normY = posY / canvHeight;

				// console.log('normX: ' + normX + ' normY: ' + normY);
				size = 20;  // pick a scaling value
				n = PerlinNoise.noise( size*normX, size*normY, .8 );
				var curCol = Math.round(255 * n);

				canvasCtx.beginPath();
				canvasCtx.rect(posX, posY, segWidth, segHeight);
				// console.log('rgb('+ curCol +','+ curCol +','+ curCol +')');
				canvasCtx.fillStyle = 'rgb('+ curCol +','+ curCol +','+ curCol +')';
				canvasCtx.fill();	
				canvasCtx.closePath();

				counter++;	
			}
		}
	}
	// noiseTextureTest();

	function noiseAgent(){

		var visSettings	= document.getElementById('vis-settings');
		visSettings.style.display = 'block';

		var noiseScaleInput = document.createElement('input');
			noiseScaleInput.type = 'range';
			noiseScaleInput.id = 'noiseScaleInput';
			noiseScaleInput.className = 'vis-setting';
			noiseScaleInput.min = 100;
			noiseScaleInput.max = 1000;
			noiseScaleInput.value = 500;
			noiseScaleInput.addEventListener("change", function(){
				init();			
			});
		var noiseScaleLabel = document.createElement('label');
			noiseScaleLabel.htmlFor = 'noiseScaleInput';
			noiseScaleLabel.className = 'vis-setting';
			noiseScaleLabel.className = 'vis-setting';
			noiseScaleLabel.innerHTML = 'Noise Scale';

		var noiseStrengthInput = document.createElement('input');
			noiseStrengthInput.type = 'range';
			noiseStrengthInput.id = 'noiseStrengthInput';
			noiseStrengthInput.className = 'vis-setting';
			noiseStrengthInput.min = 1;
			noiseStrengthInput.max = 200;
			noiseStrengthInput.value = 10;
			noiseStrengthInput.addEventListener("change", function(){
				init();			
			});
		var noiseStrengthLabel = document.createElement('label');
			noiseStrengthLabel.htmlFor = 'noiseStrengthInput';
			noiseStrengthLabel.className = 'vis-setting';
			noiseStrengthLabel.className = 'vis-setting';
			noiseStrengthLabel.innerHTML = 'Noise Strength';

		var agentCountInput = document.createElement('input');
			agentCountInput.type = 'range';
			agentCountInput.id = 'agentCountInput';
			agentCountInput.className = 'vis-setting';
			agentCountInput.min = 1;
			agentCountInput.max = 1000;
			agentCountInput.value = 500;
			agentCountInput.addEventListener("change", function(){
				init();			
			});
		var agentCountLabel = document.createElement('label');
			agentCountLabel.htmlFor = 'agentCountInput';
			agentCountLabel.className = 'vis-setting';
			agentCountLabel.className = 'vis-setting';
			agentCountLabel.innerHTML = 'Agent Count';

		visSettings.appendChild(noiseScaleLabel);
		visSettings.appendChild(noiseScaleInput);
		visSettings.appendChild(noiseStrengthLabel);
		visSettings.appendChild(noiseStrengthInput);
		visSettings.appendChild(agentCountLabel);
		visSettings.appendChild(agentCountInput);


		var size = 1;
		var noiseScale;
		var noiseStrength;
		var strokeWidth = 0.3;
		canvasCtx.strokeStyle = 'black';
		var agents;
		var agentCount;
		

		PerlinNoise = new function() {

			this.noise = function(x, y, z) {

			   var p = new Array(512)
			   var permutation = [ 151,160,137,91,90,15,
			   131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
			   190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
			   88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
			   77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
			   102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
			   135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
			   5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
			   223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
			   129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
			   251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
			   49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
			   138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
			   ];
			   for (var i=0; i < 256 ; i++) 
			 p[256+i] = p[i] = permutation[i]; 

				  var X = Math.floor(x) & 255,                  // FIND UNIT CUBE THAT
					  Y = Math.floor(y) & 255,                  // CONTAINS POINT.
					  Z = Math.floor(z) & 255;
				  x -= Math.floor(x);                                // FIND RELATIVE X,Y,Z
				  y -= Math.floor(y);                                // OF POINT IN CUBE.
				  z -= Math.floor(z);
				  var    u = fade(x),                                // COMPUTE FADE CURVES
						 v = fade(y),                                // FOR EACH OF X,Y,Z.
						 w = fade(z);
				  var A = p[X  ]+Y, AA = p[A]+Z, AB = p[A+1]+Z,      // HASH COORDINATES OF
					  B = p[X+1]+Y, BA = p[B]+Z, BB = p[B+1]+Z;      // THE 8 CUBE CORNERS,

				  return scale(lerp(w, lerp(v, lerp(u, grad(p[AA  ], x  , y  , z   ),  // AND ADD
												 grad(p[BA  ], x-1, y  , z   )), // BLENDED
										 lerp(u, grad(p[AB  ], x  , y-1, z   ),  // RESULTS
												 grad(p[BB  ], x-1, y-1, z   ))),// FROM  8
								 lerp(v, lerp(u, grad(p[AA+1], x  , y  , z-1 ),  // CORNERS
												 grad(p[BA+1], x-1, y  , z-1 )), // OF CUBE
										 lerp(u, grad(p[AB+1], x  , y-1, z-1 ),
												 grad(p[BB+1], x-1, y-1, z-1 )))));
			   }
			   function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
			   function lerp( t, a, b) { return a + t * (b - a); }
			   function grad(hash, x, y, z) {
				  var h = hash & 15;                      // CONVERT LO 4 BITS OF HASH CODE
				  var u = h<8 ? x : y,                 // INTO 12 GRADIENT DIRECTIONS.
						 v = h<4 ? y : h==12||h==14 ? x : z;
				  return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);
			   } 
			   function scale(n) { return (1 + n)/2; }
		}

		var Agent = new (function(){

			this.pX = Math.random()*canvWidth;
			this.pY = Math.random()*canvHeight;
			this.pOldX = this.pX;
			this.pOldY = this.pY;
			this.stepSize = Math.random()*5+1;
			this.angle = null;
			this.isOutside = false;

			this.update1 = function(){
				var normX = this.pX / noiseScale; //canvWidth;
				var normY = this.pY / noiseScale; //canvHeight;
				
				var n = PerlinNoise.noise( size*normX, size*normY, .8); //not sure how to apply noise scale here
				this.angle = n*noiseStrength; //not sure?
				this.pX += Math.cos(this.angle) * this.stepSize;
				this.pY += Math.sin(this.angle) * this.stepSize;

				if(	this.pX < -10) this.isOutside = true; 
				if( this.pX > canvWidth+10) this.isOutside = true; 
				if( this.pY < -10) this.isOutside = true; 
				if( this.pY > canvHeight+10) this.isOutside = true; 
					 //not sure? also why -10?
				
				if(this.isOutside){
					// console.log('isOutside');
					this.pX = Math.random()*canvWidth;
					this.pY = Math.random()*canvHeight;
					this.pOldX = this.pX;
					this.pOldY = this.pY;
				}

				canvasCtx.lineWidth = strokeWidth*this.stepSize;
				canvasCtx.beginPath();
				canvasCtx.moveTo(this.pOldX, this.pOldY);
				canvasCtx.lineTo(this.pX, this.pY);
				this.pOldX = this.pX;
				this.pOldY = this.pY;
				canvasCtx.stroke();

				this.isOutside = false;			
			};

			this.update2 = function(){
				var normX = this.pX / noiseScale; //canvWidth;
				var normY = this.pY / noiseScale; //canvHeight;
				var n = PerlinNoise.noise( size*normX, size*normY, .8); //not sure how to apply noise scale here
				this.angle = n*24; //not sure why 24?
				this.angle = (this.angle - Math.round(this.angle)) * noiseStrength;
				
				this.pX += Math.cos(this.angle) * this.stepSize;
				this.pY += Math.sin(this.angle) * this.stepSize;

				if(	this.pX < -10) this.isOutside = true; 
				if( this.pX > canvWidth+10) this.isOutside = true; 
				if( this.pY < -10) this.isOutside = true; 
				if( this.pY > canvHeight+10) this.isOutside = true; 
				
				if(this.isOutside){
					// console.log('isOutside');
					this.pX = Math.random()*canvWidth;
					this.pY = Math.random()*canvHeight;
					this.pOldX = this.pX;
					this.pOldY = this.pY;
				}

				canvasCtx.lineWidth = strokeWidth*this.stepSize;
				canvasCtx.beginPath();
				canvasCtx.moveTo(this.pOldX, this.pOldY);
				canvasCtx.lineTo(this.pX, this.pY);
				this.pOldX = this.pX;
				this.pOldY = this.pY;
				canvasCtx.stroke();

				this.isOutside = false;			
			};
		})();

		function init(){
			agentCount = parseInt(agentCountInput.value);
			canvasCtx.clearRect(0,0, canvWidth, canvHeight);
			canvasCtx.fillStyle = bgColor;
			canvasCtx.fillRect(0,0, canvWidth, canvHeight);

			agents = [];
			// size = parseInt(perlinScaleInput.value); //perlin algo scale
			noiseScale = parseInt(noiseScaleInput.value);
			// console.log('size: ' + size);
			// console.log('size: ' + size);

			for(var i = 0; i < agentCount; i++)	agents.push(Agent);
			startAnimating(30);
			// draw();
		}
		init();

		function draw(){
			noiseStrength = parseInt(noiseStrengthInput.value);
			for(var i = 0; i < agentCount; i++){
				agents[i].update1();

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
		}
	}
	// noiseAgent();

	function nodeTest(){

		var Node = (function(x, y){

			this.minX = 5;
			this.minY = 5;
			this.maxX = canvWidth-5;
			this.maxY = canvHeight-5;
			this.damping = 0.1;
			this.x = x;
			this.y = y;
			this.velocity = {
				x: null,
				y: null
			};

			this.update = function(){

				this.x += this.velocity.x;
				this.y += this.velocity.y;

				if(this.x < this.minX){
					this.x = this.minX - (this.x - this.minX);
					this.velocity.x *= -1;
				}

				if(this.x > this.maxX){
					this.x = this.maxX - (this.x - this.maxX);
					this.velocity.x *= -1;
				}

				if(this.y < this.minY){
					this.y = this.minY - (this.y - this.minY);
					this.velocity.y *= -1;
				}

				if(this.y > this.maxY){
					this.y = this.maxY - (this.y - this.maxY);
					this.velocity.y *= -1;
				}

				this.velocity.x *= (1-this.damping);
				this.velocity.y *= (1-this.damping);
			};
		});

		var nodeCount = 20;
		var nodes;

		function init(){

			nodes = [];

			for(var i = 0; i < nodeCount; i++){
				var node = new Node(Math.random()*canvWidth, Math.random()*canvHeight);
					node.velocity.x = Math.random()*3;
						if(Math.floor(Math.random()*2) === 1) node.velocity.x *= -1;
					node.velocity.y = Math.random()*3;
						if(Math.floor(Math.random()*2) === 1) node.velocity.y *= -1;
					node.damping = 0.01;

				nodes.push(node);
			}
			startAnimating(30);
		}
		init();

		function draw(){

			canvasCtx.clearRect(0,0,canvWidth,canvHeight);
			canvasCtx.fillStyle = bgColor;
			canvasCtx.fillRect(0,0,canvWidth,canvHeight);

			for(var i = 0; i < nodes.length; i++){				

				nodes[i].update();

				canvasCtx.beginPath();
				canvasCtx.arc(nodes[i].x, nodes[i].y, 10, 0, Math.PI*2);
				canvasCtx.closePath();

				canvasCtx.fillStyle = 'black';
				canvasCtx.fill();
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
	// nodeTest();

	function attractorTest(){

		var Attractor = (function(x, y){

			this.x = x;
			this.y = y;
			this.radius = 200; //radius of impact
			this.strength = 1; //+ for attraction, - for repulsion
			this.ramp = 0.5; // form of function

			this.attract = function(node){
				var dx = this.x - node.x;
				var dy = this.y - node.y;
				var d = Math.sqrt(
						Math.pow(dx, 2) + Math.pow(dy, 2)
					);
				if(d > 0 && d < this.radius){
					//calc force
					var s = d/this.radius;
					var f = (1 / Math.pow(s, 0.5*this.ramp) -1);

					//apply force
					node.velocity.x += dx * f;
					node.velocity.y += dy * f;
				}
			};
		});

		var Node = (function(x, y){

			this.minX = 5;
			this.minY = 5;
			this.maxX = canvWidth-5;
			this.maxY = canvHeight-5;
			this.damping = 0.1;
			this.x = x;
			this.y = y;
			this.velocity = {
				x: null,
				y: null
			};

			this.update = function(){

				this.x += this.velocity.x;
				this.y += this.velocity.y;

				if(this.x < this.minX){
					this.x = this.minX - (this.x - this.minX);
					this.velocity.x *= -1;
				}

				if(this.x > this.maxX){
					this.x = this.maxX - (this.x - this.maxX);
					this.velocity.x *= -1;
				}

				if(this.y < this.minY){
					this.y = this.minY - (this.y - this.minY);
					this.velocity.y *= -1;
				}

				if(this.y > this.maxY){
					this.y = this.maxY - (this.y - this.maxY);
					this.velocity.y *= -1;
				}

				this.velocity.x *= (1-this.damping);
				this.velocity.y *= (1-this.damping);
			};

			this.setBoundary = function(minX, minY, maxX, maxY){
				this.minX = minX;
				this.minY = minY;
				this.maxX = maxX;
				this.maxY = maxY;
			};

			this.setDamping = function(newDamping){
				this.damping = newDamping;
			};
		});

		//Runtime UI stuff
		var visSettings	= document.getElementById('vis-settings');
			visSettings.style.display = 'block';

		var nodeDampingInput = document.createElement('input');
			nodeDampingInput.type = 'range';
			nodeDampingInput.id = 'nodeDampingInput';
			nodeDampingInput.className = 'vis-setting';
			nodeDampingInput.min = 0;
			nodeDampingInput.max = 100;
			nodeDampingInput.value = 80; //need to be /100 for 0.8
			var nodeDampingLabel = document.createElement('label');
				nodeDampingLabel.htmlFor = 'nodeDampingInput';
				nodeDampingLabel.innerHTML = 'Node Damping';
				nodeDampingLabel.className = 'vis-setting';

		var showAttractNodeDiv = document.createElement('div');
			showAttractNodeDiv.className = 'vis-setting';
			var showAttractNode = document.createElement('input');
				showAttractNode.id = 'showAttractNode';
				showAttractNode.type = 'checkbox';
				showAttractNode.className = 'vis-setting switch-input';
				showAttractNode.checked = false;
			var showAttractNodePaddel = document.createElement('label');
				showAttractNodePaddel.className = 'vis-setting switch-paddle';
				showAttractNodePaddel.htmlFor = 'showAttractNode';
			var showAttractNodeLabel = document.createElement('label');
				showAttractNodeLabel.htmlFor = 'showAttractNode';
				showAttractNodeLabel.innerHTML = 'Show Attractor';
				showAttractNodeLabel.className = 'vis-setting';
			
		var attractRadiusInput = document.createElement('input');
			attractRadiusInput.type = 'range';
			attractRadiusInput.id = 'attractRadiusInput';
			attractRadiusInput.className = 'vis-setting';
			attractRadiusInput.min = 0;
			attractRadiusInput.max = 500;
			attractRadiusInput.value = 200;
			var attractRadiusLabel = document.createElement('label');
				attractRadiusLabel.htmlFor = 'attractRadiusInput';
				attractRadiusLabel.innerHTML = 'Attraction Radius';
				attractRadiusLabel.className = 'vis-setting';

			showAttractNodeDiv.appendChild(showAttractNodeLabel);
			showAttractNodeDiv.appendChild(showAttractNode)
			showAttractNodeDiv.appendChild(showAttractNodePaddel);

		var attractStrengthInput = document.createElement('input');
			attractStrengthInput.type = 'range';
			attractStrengthInput.id = 'attractStrengthInput';
			attractStrengthInput.className = 'vis-setting';
			attractStrengthInput.min = -50;
			attractStrengthInput.max = 50;
			attractStrengthInput.value = -10;
			var attractStrengthLabel = document.createElement('label');
				attractStrengthLabel.htmlFor = 'attractStrengthInput';
				attractStrengthLabel.innerHTML = 'Attraction Strength';
				attractStrengthLabel.className = 'vis-setting';

		var attractRampInput = document.createElement('input');
			attractRampInput.type = 'range';
			attractRampInput.id = 'attractRampInput';
			attractRampInput.className = 'vis-setting';
			attractRampInput.min = 0;
			attractRampInput.max = 100;
			attractRampInput.value = 20; //need to be /100 for 0.2
			var attractRampLabel = document.createElement('label');
				attractRampLabel.htmlFor = 'attractRampInput';
				attractRampLabel.innerHTML = 'Attraction Ramp';
				attractRampLabel.className = 'vis-setting';

		var attractMaxVelocityInput = document.createElement('input');
			attractMaxVelocityInput.type = 'range';
			attractMaxVelocityInput.id = 'attractRadiusInput';
			attractMaxVelocityInput.className = 'vis-setting';
			attractMaxVelocityInput.min = 0;
			attractMaxVelocityInput.max = 20;
			attractMaxVelocityInput.value = 5;
			var attractMaxVelocityLabel = document.createElement('label');
				attractMaxVelocityLabel.htmlFor = 'attractRadiusInput';
				attractMaxVelocityLabel.innerHTML = 'Attract Node Velocity';
				attractMaxVelocityLabel.className = 'vis-setting';

		visSettings.appendChild(showAttractNodeDiv);
		visSettings.appendChild(attractRadiusLabel);
		visSettings.appendChild(attractRadiusInput);
		visSettings.appendChild(attractStrengthLabel);
		visSettings.appendChild(attractStrengthInput);
		visSettings.appendChild(attractRampLabel);
		visSettings.appendChild(attractRampInput);
		visSettings.appendChild(attractMaxVelocityLabel);
		visSettings.appendChild(attractMaxVelocityInput);
		visSettings.appendChild(nodeDampingLabel);
		visSettings.appendChild(nodeDampingInput);


		var xCount = 100;
		var yCount = 100;
		var nodeCount = xCount * yCount; //GUI
		var nodes;
		var node_Damping = nodeDampingInput.value/100; //GUI
		
		var attractor;
		var attractor_MaxRamp; //GUI - done
		var attractor_Radius; //GUI - done
		var attractor_Strength; //GUI - done
		
		var attractNode;
		var attractNode_MaxVelocity; //GUI - done

		function init(){

			nodes = [];
			var gridSizeX = canvWidth/xCount;
			var gridSizeY = canvHeight/yCount;

			for(var y = 0; y < yCount; y++){
				for(var x = 0; x < xCount; x++){
					var xPos = x*gridSizeX;
					var yPos = y*gridSizeY;
					var node = new Node(xPos, yPos);
						node.setBoundary(0,0, canvWidth, canvHeight);
						node.setDamping(node_Damping);
					nodes.push(node);
				}
			}

			attractor = new Attractor(canvWidth/2, canvHeight/2);
				attractor.radius = attractRadiusInput.value;
				attractor.strength = attractStrengthInput.value;
				attractor.ramp = attractRampInput.value/100;

			attractNode = new Node(canvWidth/2, canvHeight/2);
				attractNode.setBoundary(0,0, canvWidth, canvHeight);
				attractNode.setDamping(0);

				attractNode.velocity.x = attractMaxVelocityInput.value/2;
				attractNode.velocity.y = attractMaxVelocityInput.value/2;

			startAnimating(10);
		}	
		init();


		function draw(){

			canvasCtx.clearRect(0,0, canvWidth,canvHeight);
			canvasCtx.fillStyle = bgColor;
			canvasCtx.fillRect(0,0, canvWidth,canvHeight);

			attractor_Radius = attractRadiusInput.value;
			attractor_Strength = attractStrengthInput.value;
			attractNode_MaxVelocity = attractMaxVelocityInput.value;
			attractor_MaxRamp = attractRampInput.value/100;

			attractor.strength = attractor_Strength;
			attractor.radius = attractor_Radius;

			//velocity cap (not being used)
			if(attractNode.velocity.x > attractNode_MaxVelocity) attractNode.velocity.x = attractNode_MaxVelocity;
			if(attractNode.velocity.x < attractNode_MaxVelocity *-1) attractNode.velocity.x = attractNode_MaxVelocity*-1;
			if(attractNode.velocity.y > attractNode_MaxVelocity) attractNode.velocity.y = attractNode_MaxVelocity;
			if(attractNode.velocity.y < attractNode_MaxVelocity *-1) attractNode.velocity.y = attractNode_MaxVelocity*-1;

			attractNode.velocity.x -= Math.random()*attractNode_MaxVelocity;
			attractNode.velocity.y -= Math.random()*attractNode_MaxVelocity;
			attractNode.velocity.x += Math.random()*attractNode_MaxVelocity;
			attractNode.velocity.y += Math.random()*attractNode_MaxVelocity;

			attractNode.update();
			if(showAttractNode.checked){
				canvasCtx.beginPath();
				canvasCtx.arc(attractNode.x, attractNode.y, 5, 0, Math.PI*2);
				canvasCtx.closePath();
				canvasCtx.fillStyle = 'red';
				canvasCtx.fill();
				canvasCtx.beginPath();
				canvasCtx.arc(attractNode.x, attractNode.y, attractor.radius, 0, Math.PI*2);
				canvasCtx.closePath();
				canvasCtx.strokeStyle = 'red';
				canvasCtx.stroke();
			}

			attractor.x = attractNode.x;
			attractor.y = attractNode.y;


			attractor.ramp = Math.random()*attractor_MaxRamp;
			if(Math.floor(Math.random()*2) === 1) attractor.ramp*=-1;

			canvasCtx.fillStyle = 'black';

			for(var i = 0; i < nodes.length; i++){
				
				node_Damping = nodeDampingInput.value/100;
				nodes[i].setDamping(node_Damping);
				attractor.attract(nodes[i]);
				nodes[i].update();
				
				canvasCtx.beginPath();
				canvasCtx.arc(nodes[i].x, nodes[i].y, 2, 0, Math.PI*2);
				canvasCtx.closePath();
				canvasCtx.fill();
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
	// attractorTest();

	function attractorTool(){

		var Attractor = (function(x, y){

			this.x = x;
			this.y = y;
			this.radius = 200; //radius of impact
			this.strength = 1; //+ for attraction, - for repulsion
			this.ramp = 0.5; // form of function
			this.mode = 'basic';

			this.attract = function(node){
				var dx = this.x - node.x;
				var dy = this.y - node.y;
				var d = Math.sqrt(
						Math.pow(dx, 2) + Math.pow(dy, 2)
					);
				var f = 0;

				switch(this.mode){
					case 'basic':
						if(d > 0 && d < this.radius){
							//calc force
							var s = d/this.radius;
							f = (1 / Math.pow(s, 0.5*this.ramp) -1);
							f = this.strength * f / this.radius;
						}
						break;
					case 'smooth': // Fallthrough
					case 'twirl':
						if(d > 0 && d < this.radius){
							var s = Math.pow(d/this.radius, 1/this.ramp);
							f = s * 9 * this.strength * (1 / (s + 1) + ((s-3) /4)) /d;
						}
						break;
					default:
						f = null;
				}
				
				//apply force
				if(this.mode !== 'twirl'){
					node.velocity.x += dx * f;
					node.velocity.y += dy * f;
				}
				else{
					node.velocity.x += dx * f;
					node.velocity.y -= dy * f;
				}
			};
		});

		var Node = (function(x, y){

			this.minX = 5;
			this.minY = 5;
			this.maxX = canvWidth-5;
			this.maxY = canvHeight-5;
			this.damping = 0.1;
			this.x = x;
			this.y = y;
			this.velocity = {
				x: null,
				y: null
			};

			this.update = function(){

				this.x += this.velocity.x;
				this.y += this.velocity.y;

				if(this.x < this.minX){
					this.x = this.minX - (this.x - this.minX);
					this.velocity.x *= -1;
				}

				if(this.x > this.maxX){
					this.x = this.maxX - (this.x - this.maxX);
					this.velocity.x *= -1;
				}

				if(this.y < this.minY){
					this.y = this.minY - (this.y - this.minY);
					this.velocity.y *= -1;
				}

				if(this.y > this.maxY){
					this.y = this.maxY - (this.y - this.maxY);
					this.velocity.y *= -1;
				}

				this.velocity.x *= (1-this.damping);
				this.velocity.y *= (1-this.damping);
			};

			this.setBoundary = function(minX, minY, maxX, maxY){
				this.minX = minX;
				this.minY = minY;
				this.maxX = maxX;
				this.maxY = maxY;
			};

			this.setDamping = function(newDamping){
				this.damping = newDamping;
			};
		});

		
		//Runtime UI stuff		
		var visSettings	= document.getElementById('vis-settings');
			visSettings.style.display = 'block';

		var nodeDampingInput = document.createElement('input');
			nodeDampingInput.type = 'range';
			nodeDampingInput.id = 'nodeDampingInput';
			nodeDampingInput.className = 'vis-setting';
			nodeDampingInput.min = 0;
			nodeDampingInput.max = 100;
			nodeDampingInput.value = 10; //need to be /100 for 0.8
			var nodeDampingLabel = document.createElement('label');
				nodeDampingLabel.htmlFor = 'nodeDampingInput';
				nodeDampingLabel.innerHTML = 'Node Damping';
				nodeDampingLabel.className = 'vis-setting';

		var basicDiv = document.createElement('div');
			basicDiv.className = 'vis-setting switch';
			var basicModeInput = document.createElement('input');
				basicModeInput.id = 'basicModeInput';
				basicModeInput.type = 'radio';
				basicModeInput.name = 'attractMode';
				basicModeInput.className = 'vis-setting switch-input';
			var basicModeLabel = document.createElement('label');
				basicModeLabel.htmlFor = 'basicModeInput';
				basicModeLabel.innerHTML = 'Basic Mode';
				basicModeLabel.className = 'vis-setting';
			var basicModePaddel = document.createElement('label');
				basicModePaddel.className = 'vis-setting switch-paddle';
				basicModePaddel.htmlFor = 'basicModeInput';
		
		var smoothDiv = document.createElement('div');
			smoothDiv.className = 'vis-setting switch';
			var smoothModeInput = document.createElement('input');
				smoothModeInput.id = 'smoothModeInput';
				smoothModeInput.type = 'radio';
				smoothModeInput.name = 'attractMode';
				smoothModeInput.className = 'vis-setting switch-input';
				smoothModeInput.checked = true;
			var smoothModeLabel = document.createElement('label');
				smoothModeLabel.htmlFor = 'smoothModeInput';
				smoothModeLabel.innerHTML = 'Smooth Mode';
			var smoothModePaddel = document.createElement('label');
				smoothModePaddel.className = 'vis-setting switch-paddle';
				smoothModePaddel.htmlFor = 'smoothModeInput';

		var twistDiv = document.createElement('div');
			twistDiv.className = 'vis-setting switch';
			var twistModeInput = document.createElement('input');
				twistModeInput.id = 'twistModeInput';
				twistModeInput.type = 'radio';
				twistModeInput.name = 'attractMode';
				twistModeInput.className = 'vis-setting switch-input';
				// twistModeInput.checked = true;
			var twistModeLabel = document.createElement('label');
				twistModeLabel.htmlFor = 'twistModeInput';
				twistModeLabel.innerHTML = 'Twist Mode';
			var twistModePaddel = document.createElement('label');
				twistModePaddel.className = 'vis-setting switch-paddle';
				twistModePaddel.htmlFor = 'twistModeInput';	

		var lineDiv = document.createElement('div');
			lineDiv.className = 'vis-setting switch';
			var lineModeInput = document.createElement('input');
				lineModeInput.id = 'lineModeInput';
				lineModeInput.type = 'radio';
				lineModeInput.name = 'drawMode';
				lineModeInput.className = 'vis-setting switch-input';
				lineModeInput.checked = true;
			var lineModeLabel = document.createElement('label');
				lineModeLabel.htmlFor = 'lineModeInput';
				lineModeLabel.innerHTML = 'Draw Lines';
				lineModeLabel.className = 'vis-setting';
			var lineModePaddel = document.createElement('label');
				lineModePaddel.className = 'vis-setting switch-paddle';
				lineModePaddel.htmlFor = 'lineModeInput';
		
		var circleDiv = document.createElement('div');
			circleDiv.className = 'vis-setting switch';
			var circleModeInput = document.createElement('input');
				circleModeInput.id = 'circleModeInput';
				circleModeInput.type = 'radio';
				circleModeInput.name = 'drawMode';
				circleModeInput.className = 'vis-setting switch-input';
			var circleModeLabel = document.createElement('label');
				circleModeLabel.htmlFor = 'circleModeInput';
				circleModeLabel.innerHTML = 'Draw Circles';
				circleModeLabel.className = 'vis-setting';
			var circleModePaddel = document.createElement('label');
				circleModePaddel.className = 'vis-setting switch-paddle';
				circleModePaddel.htmlFor = 'circleModeInput';
					
		var attractRadiusInput = document.createElement('input');
			attractRadiusInput.type = 'range';
			attractRadiusInput.id = 'attractRadiusInput';
			attractRadiusInput.className = 'vis-setting';
			attractRadiusInput.min = 0;
			attractRadiusInput.max = 20;
			attractRadiusInput.value = attractRadiusInput.max/2;
			var attractRadiusLabel = document.createElement('label');
				attractRadiusLabel.htmlFor = 'attractRadiusInput';
				attractRadiusLabel.innerHTML = 'Attraction Radius';
				attractRadiusLabel.className = 'vis-setting';
	
		var attractStrengthInput = document.createElement('input');
			attractStrengthInput.type = 'range';
			attractStrengthInput.id = 'attractStrengthInput';
			attractStrengthInput.className = 'vis-setting';
			attractStrengthInput.min = 0;
			attractStrengthInput.max = 200;
			attractStrengthInput.value = 100;
			var attractStrengthLabel = document.createElement('label');
				attractStrengthLabel.htmlFor = 'attractStrengthInput';
				attractStrengthLabel.innerHTML = 'Attraction Strength';
				attractStrengthLabel.className = 'vis-setting';

		var attractRampInput = document.createElement('input');
			attractRampInput.type = 'range';
			attractRampInput.id = 'attractRampInput';
			attractRampInput.className = 'vis-setting';
			attractRampInput.min = 0.1;
			attractRampInput.max = 5;
			attractRampInput.value = 1; //need to be /100 for 0.2
			var attractRampLabel = document.createElement('label');
				attractRampLabel.htmlFor = 'attractRampInput';
				attractRampLabel.innerHTML = 'Attraction Ramp';
				attractRampLabel.className = 'vis-setting';

/*
		var attractMaxVelocityInput = document.createElement('input');
			attractMaxVelocityInput.type = 'range';
			attractMaxVelocityInput.id = 'attractRadiusInput';
			attractMaxVelocityInput.className = 'vis-setting';
			attractMaxVelocityInput.min = 0;
			attractMaxVelocityInput.max = 20;
			attractMaxVelocityInput.value = 15;
			var attractMaxVelocityLabel = document.createElement('label');
				attractMaxVelocityLabel.htmlFor = 'attractRadiusInput';
				attractMaxVelocityLabel.innerHTML = 'Attract Node Velocity';
				attractMaxVelocityLabel.className = 'vis-setting';

		visSettings.appendChild(showAttractNodeDiv);
		visSettings.appendChild(attractMaxVelocityLabel);
		visSettings.appendChild(attractMaxVelocityInput);
		*/
			basicDiv.appendChild(basicModeLabel);
			basicDiv.appendChild(basicModeInput);
			basicDiv.appendChild(basicModePaddel);
			smoothDiv.appendChild(smoothModeLabel);
			smoothDiv.appendChild(smoothModeInput);
			smoothDiv.appendChild(smoothModePaddel);
			twistDiv.appendChild(twistModeLabel);
			twistDiv.appendChild(twistModeInput);
			twistDiv.appendChild(twistModePaddel);
		visSettings.appendChild(basicDiv);
		visSettings.appendChild(smoothDiv);
		visSettings.appendChild(twistDiv);
		// 	circleDiv.appendChild(circleModeLabel);
		// 	circleDiv.appendChild(circleModeInput);
		// 	circleDiv.appendChild(circleModePaddel);
		// 	lineDiv.appendChild(lineModeLabel);
		// 	lineDiv.appendChild(lineModeInput);
		// 	lineDiv.appendChild(lineModePaddel);
		// visSettings.appendChild(circleDiv);
		// visSettings.appendChild(lineDiv);
		visSettings.appendChild(nodeDampingLabel);
		visSettings.appendChild(nodeDampingInput);
		visSettings.appendChild(attractRadiusLabel);
		visSettings.appendChild(attractRadiusInput);
		visSettings.appendChild(attractStrengthLabel);
		visSettings.appendChild(attractStrengthInput);
		visSettings.appendChild(attractRampLabel);
		visSettings.appendChild(attractRampInput);
		


		var maxCount = 150;
		var xCount = 100;
		var yCount = 100;
		var layerCount;
		var oldLayerCount;
		var oldXCount, oldXCount;
		var gridStepX = canvWidth/xCount;
		var gridStepY = canvHeight/yCount;
		var oldGridStepX, oldGridStepY;

		var attractorSmooth = false;
		var attractorTwirl = true;
		var attractorRadius = 100;
		var attractorStrength = 3;
		var attractorRamp = 1;
		var nodeDamping = 0.1;
		
		var drawLines;
		var drawCircles;

		var attractor;
		var nodes;

		function init(){

			attractor = new Attractor(canvWidth/2, canvHeight/2);
			attractor.mode = 'twist';

			nodes = [];
			initGrid();
			startAnimating(30);

		}
		init();

		function initGrid(){

			var xPos, yPos;
			
				for(var x = 0; x < xCount; x++){
					for(var y = 0; y < yCount; y++){
					xPos = gridStepX *x;
					yPos = gridStepY *y;

					var node = new Node(xPos, yPos);
						node.velocity.x = 0; //??
						node.velocity.y = 0; //??
						node.damping = nodeDamping;

					nodes.push(node);
				}
			}
		}

		function draw(){

			canvasCtx.clearRect(0,0, canvWidth, canvHeight);
			canvasCtx.fillStyle = bgColor;
			canvasCtx.fillRect(0,0, canvWidth, canvHeight);


			if(smoothModeInput.checked){
				attractor.mode = 'smooth';
			}else if(twistModeInput.checked){
				attractor.mode = 'twirl';
			}else{
				attractor.mode = 'basic';
			}
			
			analyser.getByteFrequencyData(dataArray);
			var da = dataArray[0];

			attractor.strength = Math.random()* (da * (attractStrengthInput.value/100));
				if(Math.floor(Math.random()*2) === 1) attractor.strength *= -1;
			attractor.radius = Math.random()* (da*attractRadiusInput.value);

			attractor.ramp = Math.random()*attractRampInput.value;

			// nodeDamping = Math.random()*0.8;
			// 	if(Math.floor(Math.random()*2) === 1) nodeDamping *= -1;

			nodeDamping = nodeDampingInput.value/100; //non-random


			for (var i = 0; i < nodes.length; i++) {
				nodes[i].setDamping(nodeDamping);
				attractor.attract(nodes[i]);
				nodes[i].update();
			}

			if(lineModeInput.checked){
				var i = 0;

				for(var y = 0; y < yCount; y++){
					canvasCtx.beginPath()
					for(var x = 0; x < xCount; x++){
						canvasCtx.moveTo(nodes[i].x, nodes[i].y);

						var theta = Math.atan2(canvHeight/2 - nodes[i].y, canvWidth/2 -nodes[i].x); //point towards centre
						// var theta = Math.atan2(nodes[i+1].y - nodes[i].y, nodes[i+1].x -nodes[i].x); //point towards neighbour
						canvasCtx.lineTo((Math.cos(theta)*5) + nodes[i].x, (Math.sin(theta)*5) +nodes[i].y);
						
						if(i+2 < nodes.length-1) i++;
					}
					canvasCtx.closePath();
					canvasCtx.strokeStyle = 'black';
					canvasCtx.stroke();
				}
				lineDrawn = true;
			}

			if(circleModeInput.checked){
				for (var x = 0; x < nodes.length; x++) {
					canvasCtx.beginPath();
					canvasCtx.arc(nodes[x].x, nodes[x].y, 2, 0, Math.PI*2);
					canvasCtx.fillStyle = 'black';
					canvasCtx.fill();
				}
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
	attractorTool();
}
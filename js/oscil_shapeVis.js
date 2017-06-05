function barGraph(dataArray, bufferLength){

	canvasCtx.clearRect(0, 0, canvWidth, canvHeight);

	function draw() {
	  drawVisual = requestAnimationFrame(draw);

	  analyser.getByteFrequencyData(dataArray);

	  canvasCtx.fillStyle = bgColor;
	  canvasCtx.fillRect(0, 0, canvWidth, canvHeight);

	  var barWidth = (canvWidth / bufferLength) * 2;
	  var barHeight;
	  var x = 0;

	  for(var i = 0; i < bufferLength; i++) {
		barHeight = dataArray[i]*3; //heres where you increase the barheight size bitch

		var y = canvHeight/2-barHeight/2;

		canvasCtx.fillStyle = 'hsl('+ barHeight +',50%,70%)';
		canvasCtx.fillRect(x,y,barWidth,barHeight);

		x += barWidth;
	  }
	};

	draw();
}

function waveForm(dataArray, bufferLength){

	//analyser.fftSize = 1024; //defines Fast Fourier Transform rate 

	canvasCtx.clearRect(0,0,canvWidth,canvHeight); //reset canvas for new vis

	function draw(){
		drawVisual = requestAnimationFrame(draw); //this keeps looping the drawing function once it has started
		analyser.getByteTimeDomainData(dataArray); //retrieve the data and copy it into our array
		canvasCtx.fillStyle = bgColor;
		canvasCtx.fillRect(0,0, canvWidth, canvHeight);

		//line width and color
		canvasCtx.lineWidth = 2;
			canvasCtx.beginPath();

		//width of ea. segment = canv.w / arraylength
		var sliceWidth = canvWidth * 1.0 / bufferLength;
			var x = 0; //position to move to to draw ea. line segment

		for(var i=0; i <bufferLength; i++){
			var v = dataArray[i] / 128.0; //128.0 height based on the data point value form the array
			canvasCtx.strokeStyle = 'hsl('+ dataArray[i]*5 +',80%,70%)';
			var y = v * canvHeight/2;

			if(i===0){
				canvasCtx.moveTo(x,y); // moving the line across to the place where the next wave segment should be drawn
			}else{
				canvasCtx.lineTo(x,y);
			}
			x += sliceWidth;
		}

		canvasCtx.lineTo(canvWidth, canvWidth/2);
			canvasCtx.stroke();
	}
		draw();
}

function gradient(dataArray, bufferLength){

	//Runtime UI stuff
	var visSettings	= document.getElementById('vis-settings');
		visSettings.style.display = 'block';

		var linearDiv = document.createElement('div');
			linearDiv.className = 'vis-setting switch';
		var linearMode = document.createElement('input');
			linearMode.id = 'linearMode';
			linearMode.type = 'radio';
			linearMode.name = 'gradMode';
			linearMode.className = 'vis-setting switch-input';
		var linearModeLabel = document.createElement('label');
			linearModeLabel.htmlFor = 'linearMode';
			linearModeLabel.innerHTML = 'Linear';
			linearModeLabel.className = 'vis-setting';
		var linearModePaddel = document.createElement('label');
			linearModePaddel.className = 'vis-setting switch-paddle';
			linearModePaddel.htmlFor = 'linearMode';
		
		var radialDiv = document.createElement('div');
			radialDiv.className = 'vis-setting switch';
		var radialMode = document.createElement('input');
			radialMode.id = 'radialMode';
			radialMode.type = 'radio';
			radialMode.name = 'gradMode';
			radialMode.className = 'vis-setting switch-input';
			radialMode.checked = 'true';
		var radialModePaddel = document.createElement('label');
			radialModePaddel.className = 'vis-setting switch-paddle';
			radialModePaddel.htmlFor = 'radialMode';
		var radialModeLabel = document.createElement('label');
			radialModeLabel.htmlFor = 'radialMode';
			radialModeLabel.innerHTML = 'Radial';
			radialModeLabel.className = 'vis-setting';

		linearDiv.appendChild(linearModeLabel);
		linearDiv.appendChild(linearMode);
		linearDiv.appendChild(linearModePaddel);
		radialDiv.appendChild(radialModeLabel);
		radialDiv.appendChild(radialMode);
		radialDiv.appendChild(radialModePaddel);
		visSettings.appendChild(linearDiv);
		visSettings.appendChild(radialDiv);


	canvasCtx.clearRect(0,0,canvWidth,canvHeight);
	
	function draw(){
		drawVisual = requestAnimationFrame(draw);
		analyser.getByteFrequencyData(dataArray);
		var colourStops = 5;

		var gradMode;
		var grad;

		if (linearMode.checked){
			//Linear
			grad = canvasCtx.createLinearGradient(0,0, canvWidth, canvHeight);
		}
		else{
			//Radial
			grad = canvasCtx.createRadialGradient(
				canvWidth/2,canvHeight/2, 0, //inner circle - can move this later
				canvWidth/2, canvHeight/2,(canvWidth > canvHeight ? canvHeight : canvWidth)/2);	//outer circle
		}
		
		// TODO: currently only works with FFT size of 256
		// TODO: dataArray.length actually returns 'undefined' shouldn't be in the for loop
		for(var i=0; i <bufferLength; i++){
			if(dataArray[i] !== 0){
				var h = Math.floor(360/dataArray.length * dataArray[i]);
				grad.addColorStop(0.0,'hsl(' + Math.abs(h-180) + ',80%, 70%)');
				grad.addColorStop(1.0,'hsl(' + h + ',80%, 70%)');
			}
		}

		canvasCtx.fillStyle = grad;
		canvasCtx.fillRect(0,0,canvWidth, canvHeight);
	}

	draw();
}

function polyShapes(dataArray, bufferLength){

	//Runtime UI stuff
	var visSettings	= document.getElementById('vis-settings');
		visSettings.style.display = 'block';
		
	var alphaInput = document.createElement('input');
		alphaInput.type = 'range';
		alphaInput.id = 'sampleCountInput';
		alphaInput.className = 'vis-setting';
		alphaInput.min = 0;
		alphaInput.max = 10;
		alphaInput.value = 1;
	var alphaLabel = document.createElement('label');
		alphaLabel.htmlFor = 'alphaInput';
		alphaLabel.innerHTML = 'Bg Alpha';
		alphaLabel.className = 'vis-setting';

	var radiusDiv = document.createElement('div');
			radiusDiv.className = 'vis-setting';
		var radiusModeCheck = document.createElement('input');
			radiusModeCheck.id = 'radiusMode';
			radiusModeCheck.type = 'checkbox';
			radiusModeCheck.className = 'vis-setting switch-input';
			radiusModeCheck.checked = true;
		var radiusModePaddel = document.createElement('label');
			radiusModePaddel.className = 'vis-setting switch-paddle';
			radiusModePaddel.htmlFor = 'radiusMode';
		var radiusModeLabel = document.createElement('label');
			radiusModeLabel.htmlFor = 'radiusMode';
			radiusModeLabel.innerHTML = 'Radius Mode';
			radiusModeLabel.className = 'vis-setting';
	var resolutionDiv = document.createElement('div');
			radiusDiv.className = 'vis-setting';
		var resolutionModeCheck = document.createElement('input');
			resolutionModeCheck.id = 'resolutionMode';
			resolutionModeCheck.type = 'checkbox';
			resolutionModeCheck.className = 'vis-setting switch-input';
			resolutionModeCheck.checked = false;
		var resolutionModePaddel = document.createElement('label');
			resolutionModePaddel.className = 'vis-setting switch-paddle';
			resolutionModePaddel.htmlFor = 'resolutionMode';
		var resolutionModeLabel = document.createElement('label');
			resolutionModeLabel.htmlFor = 'resolutionMode';
			resolutionModeLabel.innerHTML = 'Resolution Mode';
			resolutionModeLabel.className = 'vis-setting';
	var strokeDiv = document.createElement('div');
			strokeDiv.className = 'vis-setting';
		var strokeModeCheck = document.createElement('input');
			strokeModeCheck.id = 'strokeMode';
			strokeModeCheck.type = 'checkbox';
			strokeModeCheck.className = 'vis-setting switch-input';
			strokeModeCheck.checked = true;
		var strokeModePaddel = document.createElement('label');
			strokeModePaddel.className = 'vis-setting switch-paddle';
			strokeModePaddel.htmlFor = 'strokeMode';
		var strokeModeLabel = document.createElement('label');
			strokeModeLabel.htmlFor = 'strokeMode';
			strokeModeLabel.innerHTML = 'Stroke Mode';
			strokeModeLabel.className = 'vis-setting';

	visSettings.appendChild(alphaLabel);
	visSettings.appendChild(alphaInput);
	radiusDiv.appendChild(resolutionModeLabel);
	radiusDiv.appendChild(resolutionModeCheck);
	radiusDiv.appendChild(resolutionModePaddel);
	resolutionDiv.appendChild(radiusModeLabel);
	resolutionDiv.appendChild(radiusModeCheck)
	resolutionDiv.appendChild(radiusModePaddel);
	strokeDiv.appendChild(strokeModeLabel);
	strokeDiv.appendChild(strokeModeCheck);
	strokeDiv.appendChild(strokeModePaddel);
	visSettings.appendChild(strokeDiv);
	visSettings.appendChild(resolutionDiv);
	visSettings.appendChild(radiusDiv);


	var circleResolution, radius, angle, radAxis;
	var da, logda;

	startAnimating(25);


	function draw(){

		for(var i = 0; i < bufferLength; i+=50) {

			analyser.getByteFrequencyData(dataArray);
			da = dataArray[i];

			if (da !== 0){
				logda = Math.log(da) / Math.log(4);
				// console.log(logda);
			}
			drawPoly(logda);
		}

		function drawPoly(logda){
			if(resolutionModeCheck.checked){
				circleResolution = logda*3;
				if(circleResolution < 3) circleResolution = 3;
			}else{
				circleResolution = (Math.random() * 80) +2;
			}
			
			if(radiusModeCheck.checked){
				radAxis = (canvWidth > canvHeight) ? canvHeight/2 : canvWidth/2;
				radius = radAxis/logda; 
				if(radius > (radAxis-10)) radius = radAxis-10;
			}else{
				radius = (Math.random() * radAxis) +2;
			}

			angle = Math.PI*2/circleResolution;

			canvasCtx.fillStyle = 'rgba(237, 230, 224, '+ (alphaInput.value/10) +')';
			canvasCtx.fillRect(0,0, canvWidth,canvHeight);

			canvasCtx.beginPath();
			for (var i = 0; i <= circleResolution; i++) {
				var x = Math.cos(angle*i) * radius;
				var y = Math.sin(angle*i) * radius;
				canvasCtx.lineTo(canvWidth/2 + x, canvHeight/2+ y);
			}
			canvasCtx.closePath();

			if(strokeModeCheck.checked){
				canvasCtx.lineWidth = (logda * 5) + 3;
				// canvasCtx.lineWidth = (Math.random() * 15) +4;
				canvasCtx.strokeStyle = 'hsl('+ (360/logda +25)	+ ', 70%, 70%)';
				canvasCtx.stroke();
			}else{
				canvasCtx.fillStyle = 'hsl('+ (360/logda +25) + ', 70%, 70%)';
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

function particles(dataArray, bufferLength){

		//Runtime UI stuff
		var visSettings	= document.getElementById('vis-settings');
			visSettings.style.display = 'block';

		// var particleCount = 256;
		var particleCount = 30;
		var particleCountInput = document.createElement('input');
			particleCountInput.id = 'particleCountInput';
			particleCountInput.type = 'range';
			particleCountInput.className = 'vis-setting';
			particleCountInput.min = 5;
			particleCountInput.max = 50;
			particleCountInput.value = 30;
			particleCountInput.addEventListener("change", function(){
				particleCount = parseInt(particleCountInput.value);
				// console.log('particleCount: ' + particleCount);
				clear();	
				init();
			});

		var particleCountLabel = document.createElement('label');
			particleCountLabel.htmlFor = 'particleCountInput';
			particleCountLabel.innerHTML = 'Particle Count';
			particleCountLabel.className = 'vis-setting';

		visSettings.appendChild(particleCountLabel);
		visSettings.appendChild(particleCountInput);


		canvasCtx.globalCompositeOperation = 'source-over';

		var particles, partCounter;
		function init(){
			particles = [];
			partCounter = 0;
			for (var i = 0; i < particleCount; i++) {
				particles.push(new create_particle());
				partCounter++;
				console.log('partCounter: ' + partCounter);
			}
		}
		init();

		function create_particle(){

			var partMaxSize = 50;
			var partMinSize = 10;
			this.radius = Math.random()*(partMaxSize-partMinSize);
			this.hue = 360/particleCount * (Math.random()*(particleCount-1));
			// console.log(hue);
			this.colour = 'hsl(' + this.hue + ', 70%, 70%)';
			this.x = Math.random()*canvWidth;
			this.y = Math.random()*canvHeight;

			this.vx = Math.random()*10-2; //change
			this.vy = Math.random()*10-2; //change		
		}


		function clear(){
			canvasCtx.fillStyle = 'rgba(237, 230, 224, 0.3)';
			canvasCtx.fillRect(0,0, canvWidth, canvHeight);
		}

		function draw(){
			clear();	
			
			analyser.getByteFrequencyData(dataArray);

			for(var i = 0; i < bufferLength; i+=20) {
				var da = dataArray[i];

				for (var j = 0; j < particleCount; j++) {
				
					var p = particles[j];

					canvasCtx.beginPath();
					canvasCtx.arc(p.x, p.y, p.radius, 0, Math.PI*2, true);
					canvasCtx.closePath();

					var grad = canvasCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
					if (da !== 0){
						p.hue = p.hue + 1;
						p.colour = 'hsl(' + p.hue + ', 70%, 70%)';
						p.x += p.vx;
						p.y += p.vy;
					}
					else{

					}
					grad.addColorStop(0, 'white');
					grad.addColorStop(0.4, p.colour);
					grad.addColorStop(0.4, 'white');
					grad.addColorStop(1, p.colour);

					canvasCtx.fillStyle = grad;
					canvasCtx.fill();

					//Boundaries
					if(p.y + p.vy > canvas.height || p.y + p.vy < 0){
						p.vy = -p.vy;
					}
					if(p.x + p.vx > canvas.width || p.x + p.vx < 0){
						p.vx = -p.vx;
					}
				// }
				}
			}


			drawVisual = requestAnimationFrame(draw);
		}
		
		draw();
}

function dumbAgents(dataArray, bufferLength){

	//Runtime UI stuff
	var visSettings	= document.getElementById('vis-settings');
		visSettings.style.display = 'block';

	var alpha = 0.2;
	var alphaInput = document.createElement('input');
		alphaInput.id = 'alphaInput';
		alphaInput.type = 'range';
		alphaInput.className = 'vis-setting';
		alphaInput.min = 0;
		alphaInput.max = 100;
		alphaInput.value = 20;
		alphaInput.addEventListener("change", function(){
			alpha = parseInt(alphaInput.value)/100;
		});

	var alphaLabel = document.createElement('label');
		alphaLabel.htmlFor = 'alphaInput';
		alphaLabel.innerHTML = 'Bg Alpha';
		alphaLabel.className = 'vis-setting';

	visSettings.appendChild(alphaLabel);
	visSettings.appendChild(alphaInput);

	var north = 0;
	var northeast = 1;
	var east = 2;
	var southeast = 3;
	var south = 4;
	var southwest = 5;
	var west = 6;
	var northwest = 7;

	var posX, posY;

	var logda;

	function init(){
		canvasCtx.clearRect(0,0,canvWidth,canvHeight);
		canvasCtx.fillStyle = bgColor;
		canvasCtx.fillRect(0,0,canvWidth,canvHeight);
		canvasCtx.lineWidth = 1;

		logda = 3;
		posX = canvWidth/2;
		posY = canvHeight/2;

		startAnimating(5);
	}
	init();

	function draw(){

		canvasCtx.fillStyle = 'rgba(237, 230, 224, ' + alpha +')';
		canvasCtx.fillRect(0,0, canvWidth, canvHeight);

		for(var i = 0; i < bufferLength; i+=30) {

			analyser.getByteFrequencyData(dataArray);
			var da = dataArray[i];

			if (da !== 0){
				logda = Math.floor(Math.log(da) / Math.log(1.1));
				// console.log(logda);
			}
			var diameter = logda;
			var stepSize = diameter*2;

			var rand = Math.floor((Math.random()*8)+0);
			
			switch(rand){
				case north:
					canvasCtx.strokeStyle = 'hsl(140, 70%, 70%)';
					posY -= stepSize;
					break;
				case northeast:
					canvasCtx.strokeStyle = 'hsl(180, 70%, 70%)';
					posX += stepSize;
					posY -= stepSize;
					break;
				case east:
					posX += stepSize;
					break;
				case southeast:
					canvasCtx.strokeStyle = 'hsl(220, 70%, 70%)';
					posX += stepSize;
					posY += stepSize;
					break;
				case south:
					canvasCtx.strokeStyle = 'hsl(260, 70%, 70%)';
					posY += stepSize;
					break;
				case southwest:
					canvasCtx.strokeStyle = 'hsl(300, 70%, 70%)';
					posX -= stepSize;
					posY += stepSize;
					break;
				case west:
					canvasCtx.strokeStyle = 'hsl(340, 70%, 70%)';
					posX -= stepSize;
					break;
				case northwest:
					canvasCtx.strokeStyle = 'hsl(20, 70%, 70%)';
					posX -= stepSize;
					posY -= stepSize;
					break;
				default:
					break;
			}

			if(posX > canvWidth) posX = 0;
			if(posX < 0) posX = canvWidth;
			if(posY > canvHeight) posY = 0;
			if(posY < 0) posY = canvHeight;

			canvasCtx.beginPath();
			canvasCtx.arc(posX+stepSize/2, posY+stepSize/2, diameter, 0, 2*Math.PI);
			canvasCtx.stroke();
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

function shapeAgents(dataArray, bufferLength){

	//Runtime UI stuff
	var visSettings	= document.getElementById('vis-settings');
		visSettings.style.display = 'block';

	var formResolution = 20;
	var resolutionDiv = document.createElement('div');
	var resolutionInput = document.createElement('input');
		resolutionInput.id = 'resolutionInput';
		resolutionInput.type = 'range';
		resolutionInput.className = 'vis-setting';
		resolutionInput.min = 3;
		resolutionInput.max = 100;
		resolutionInput.value = formResolution;
		resolutionInput.addEventListener("change", function(){
			formResolution = parseInt(resolutionInput.value);
			init();
		});
	var resolutionLabel = document.createElement('label');
		resolutionLabel.htmlFor = 'resolutionInput';
		resolutionLabel.innerHTML = 'Resolution';
		resolutionLabel.className = 'vis-setting';

	var initRadius = (canvWidth > canvHeight ? canvHeight : canvWidth)/8;
	var initRadiusDiv = document.createElement('div');
	var initRadiusInput = document.createElement('input');
		initRadiusInput.id = 'initRadiusInput';
		initRadiusInput.type = 'range';
		initRadiusInput.className = 'vis-setting';
		initRadiusInput.min = 10;
		initRadiusInput.max = (canvWidth > canvHeight ? canvHeight : canvWidth)/4;
		initRadiusInput.step = 10;
		initRadiusInput.value = initRadius;
		initRadiusInput.addEventListener("change", function(){
			initRadius = parseInt(initRadiusInput.value);
			init();
		});
	var initRadiusLabel = document.createElement('label');
		initRadiusLabel.htmlFor = 'initRadiusInput';
		initRadiusLabel.innerHTML = 'Initial Radius';
		initRadiusLabel.className = 'vis-setting';

	var filledInput = document.createElement('input');
	var filledDiv = document.createElement('div');
		filledInput.id = 'filledInput';
		filledInput.type = 'checkbox';
		filledInput.className = 'vis-setting switch-input';
		filledInput.checked = false;
	var filledPaddel = document.createElement('label');
		filledPaddel.className = 'vis-setting switch-paddle';
		filledPaddel.htmlFor = 'filledInput';
	var filledInputLabel = document.createElement('label');
		filledInputLabel.htmlFor = 'filledInput';
		filledInputLabel.innerHTML = 'Fill Shape';
		filledInputLabel.className = 'vis-setting';

	var clearInput = document.createElement('input');
	var clearDiv = document.createElement('div');
		clearInput.id = 'clearInput';
		clearInput.type = 'checkbox';
		clearInput.className = 'vis-setting switch-input';
		clearInput.checked = false;
	var clearPaddel = document.createElement('label');
		clearPaddel.className = 'vis-setting switch-paddle';
		clearPaddel.htmlFor = 'clearInput';
	var clearInputLabel = document.createElement('label');
		clearInputLabel.htmlFor = 'clearInput';
		clearInputLabel.innerHTML = 'Interval Clear';
		clearInputLabel.className = 'vis-setting';
	
		resolutionDiv.appendChild(resolutionLabel);
		resolutionDiv.appendChild(resolutionInput);
	visSettings.appendChild(resolutionDiv);
		initRadiusDiv.appendChild(initRadiusLabel);
		initRadiusDiv.appendChild(initRadiusInput);
	visSettings.appendChild(initRadiusDiv);
		filledDiv.appendChild(filledInputLabel);
		filledDiv.appendChild(filledInput);
		filledDiv.appendChild(filledPaddel);
	visSettings.appendChild(filledDiv);
		clearDiv.appendChild(clearInputLabel);
		clearDiv.appendChild(clearInput);
		clearDiv.appendChild(clearPaddel);
	visSettings.appendChild(clearDiv);

	var stepSize = 2;
	var centerStepSize = 0.01;
	var centerX, centerY;
	var x = [formResolution];
	var y = [formResolution];
	var logda = 3;


	function init(){

		canvasCtx.fillStyle = 'rgba(237, 230, 224, 1)';
		canvasCtx.fillRect(0,0, canvWidth,canvHeight);

		centerX = canvWidth/2;
		centerY = canvHeight/2;
		var angle = (360/formResolution) * (Math.PI / 180);
		for(var i=0; i < formResolution; i++){
			x[i] = Math.cos(angle*i) * initRadius;
			y[i] = Math.sin(angle*i) * initRadius;
		}
	}
	init();


	function draw(){

		for(var j = 0; j < bufferLength; j+=30) {

			analyser.getByteFrequencyData(dataArray);
			var da = dataArray[i];

			if (da !== 0 && typeof da != 'undefined'){
				logda = Math.floor(Math.log(da) / Math.log(2));
			}

			if(clearInput.checked){
				canvasCtx.fillStyle = 'rgba(237, 230, 224, 1)';
				canvasCtx.fillRect(0,0, canvWidth,canvHeight);
			}

			//float towards randomised space on screen (in lieu of mouse)
			var randX = Math.random() * canvWidth;
			var randY = Math.random() * canvHeight;
			centerX += (randX-centerX) * centerStepSize;
			centerY += (randY-centerY) * centerStepSize;

			//calc new points
			for(var i=0; i < formResolution; i++){
				var stepRandX = (Math.random()*stepSize+(stepSize*-1));
				stepRandX *= Math.floor(Math.random()*2) == 1 ? 1 : -1;

				var stepRandY = (Math.random()*stepSize+(stepSize*-1));
				stepRandY *= Math.floor(Math.random()*2) == 1 ? 1 : -1;

				x[i] += stepRandX;
				y[i] += stepRandY;

				if(x[i]+centerX < 0 || x[i]+centerX > canvWidth){
					x[i] -= stepRandX;
				}
				if(y[i]+centerY < 0 || y[i]+centerY > canvHeight){
					y[i] -= stepRandY;
				}
			}

			canvasCtx.beginPath();
			for(var i=0; i < formResolution; i++){
				canvasCtx.lineTo(x[i]+centerX, y[i]+centerY);
			}
			canvasCtx.closePath();

			canvasCtx.lineJoin = "round";
			canvasCtx.lineWidth = logda+1;
			canvasCtx.miterLimit = logda;

			if(filledInput.checked){
				canvasCtx.fillStyle = 'hsl('+ logda*5+20 +',70%,70%)';
				canvasCtx.fill();	
			}else{
				canvasCtx.strokeStyle = 'hsl('+ logda*5+20 +',70%,70%)';
				canvasCtx.stroke();	
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
	startAnimating(10);
}

function brownianTree(dataArray, bufferLength){

		//Runtime UI stuff
		var visSettings	= document.getElementById('vis-settings');
		visSettings.style.display = 'block';

		var showRandInput = document.createElement('input');
		var showRandDiv = document.createElement('div');
			showRandInput.id = 'showRandInput';
			showRandInput.type = 'checkbox';
			showRandInput.className = 'vis-setting switch-input';
			showRandInput.checked = true;
			showRandInput.addEventListener("change", function(){
				init();
			});
		var showRandPaddel = document.createElement('label');
			showRandPaddel.className = 'vis-setting switch-paddle';
			showRandPaddel.htmlFor = 'showRandInput';
		var showRandInputLabel = document.createElement('label');
			showRandInputLabel.htmlFor = 'showRandInput';
			showRandInputLabel.innerHTML = 'Show Random Seeds';
			showRandInputLabel.className = 'vis-setting';

		var maxRadDiv = document.createElement('div');
		var maxRadInput = document.createElement('input');
			maxRadInput.id = 'maxRadInput';
			maxRadInput.type = 'range';
			maxRadInput.className = 'vis-setting';
			maxRadInput.min = 0;
			maxRadInput.max = 20;
			maxRadInput.value = 5;
			maxRadInput.addEventListener("change", function(){
				init();
			});
		var maxRadLabel = document.createElement('label');
			maxRadLabel.htmlFor = 'maxRadInput';
			maxRadLabel.innerHTML = 'Max Radius';
			maxRadLabel.className = 'vis-setting';
			
			showRandDiv.appendChild(showRandInputLabel);
			showRandDiv.appendChild(showRandInput);
			showRandDiv.appendChild(showRandPaddel);
		visSettings.appendChild(showRandDiv);
			maxRadDiv.appendChild(maxRadLabel);
			maxRadDiv.appendChild(maxRadInput);
		visSettings.appendChild(maxRadDiv);


		var currentCount;
		var x, y, r;
		var maxRad;
		var showRandomSeeds;

		function init(){

			canvasCtx.clearRect(0,0,canvWidth,canvHeight);
			canvasCtx.fillStyle = bgColor;
			canvasCtx.fillRect(0,0,canvWidth,canvHeight);

			currentCount = 1;
			x = [];
			y = [];
			r = []; //radius
			maxRad = parseInt(maxRadInput.value);;
			showRandomSeeds = showRandInput.checked;

			x[0] = Math.random()*canvWidth;
			y[0] = Math.random()*canvHeight;
			r[0] = (Math.random()*maxRad)+1;
		}
		init();

		function draw(){

			//random params
			var newR = (Math.random()*maxRad)+1;
			var newX = (Math.random()*canvWidth-newR)+(0+newR);
			var newY = (Math.random()*canvHeight-newR)+(0+newR);
			var closestDist = 100000000;
			var closestIndex = 0;

			//find closest circle
			for(var i = 0; i < currentCount; i++){
				var newDist = Math.sqrt(Math.pow(newX-x[i],2)+Math.pow(newY-y[i],2));
				if(newDist < closestDist){
					closestDist = newDist;
					closestIndex = i;
				}
			}

			if(showRandomSeeds){
				canvasCtx.beginPath();
				canvasCtx.moveTo(newX, newY);
				canvasCtx.arc(newX, newY, newR, 0, Math.PI*2);
				canvasCtx.fillStyle = 'black';
				canvasCtx.fill();
				canvasCtx.moveTo(newX, newY);
				canvasCtx.lineTo(x[closestIndex], y[closestIndex]);
				canvasCtx.lineWidth = 1;
				canvasCtx.strokeStyle = 'black';
				canvasCtx.stroke();
				canvasCtx.closePath();
			}
			

			//align to closest circle
			var angle = Math.atan2(newY-y[closestIndex], newX-x[closestIndex]);

			x[currentCount] = x[closestIndex] + Math.cos(angle) * (r[closestIndex]+newR);
			y[currentCount] = y[closestIndex] + Math.sin(angle) * (r[closestIndex]+newR);
			r[currentCount] = newR;
			canvasCtx.beginPath();
			canvasCtx.moveTo(x[currentCount], y[currentCount]);
			canvasCtx.arc(x[currentCount], y[currentCount], r[currentCount]*2, 0, Math.PI*2);
			canvasCtx.fillStyle = 'black';
			canvasCtx.fill();
			canvasCtx.closePath();

			currentCount++;
		}

		var stop = false;
		var frameCount = 0;
		var fps, fpsInterval, startTime, now, then, elapsed;
		var logda;

		function startAnimating(){			
			then = Date.now();
			startTime = then;
			animate();
		}

		function animate(fps){

			for(var i = 0; i < bufferLength; i+=30) {

				analyser.getByteFrequencyData(dataArray);
				var da = dataArray[i];

				if (da !== 0){
					logda = Math.floor(Math.log(da) / Math.log(1.2))+3;
					// console.log(logda);
				}
			}

			fps = logda;
			fpsInterval = 1000/fps;

			if(stop){
				return;
			}
			drawVisual = requestAnimationFrame(animate);

			now = Date.now();
			elapsed = now - then;

			if(elapsed > fpsInterval){
				then = now - (elapsed % fpsInterval);
				// console.log('fps: ' + fps);
				draw();
			}
		}


		startAnimating();
}

function concretePoetry(dataArray, bufferLength){

	//Runtime UI stuff
	var visSettings	= document.getElementById('vis-settings');
		visSettings.style.display = 'block';

	var textAreaInput = document.createElement('textarea');
		textAreaInput.id = 'textAreaInput';
		textAreaInput.className = 'vis-setting';
		textAreaInput.placeholder = 'there is always soma, delicious soma, half a gramme for a half-holiday, a gramme for a week-end, two grammes for a trip to the gorgeous East, three for a dark eternity on the moon';
		textAreaInput.addEventListener("change", function(){
			init();			
		});
	var textAreaLabel = document.createElement('label');
		textAreaLabel.htmlFor = 'textAreaInput';
		textAreaLabel.innerHTML = 'Text Sample';
		textAreaLabel.className = 'vis-setting';

	var caseDiv = document.createElement('form');
			caseDiv.className = 'vis-setting';

	var lowerCaseDiv = document.createElement('div');	
			lowerCaseDiv.className = 'vis-setting switch';
		var lowerCasemode = document.createElement('input');
			lowerCasemode.id = 'lowerCasemode';
			lowerCasemode.type = 'radio';
			lowerCasemode.name = 'caseMode';
			lowerCasemode.className = 'vis-setting switch-input';
			lowerCasemode.addEventListener("change", function(){
				init();			
			});
		var lowerCasemodePaddel = document.createElement('label');
			lowerCasemodePaddel.className = 'vis-setting switch-paddle';
			lowerCasemodePaddel.htmlFor = 'lowerCasemode';
		var lowerCasemodeLabel = document.createElement('label');
			lowerCasemodeLabel.htmlFor = 'lowerCasemode';
			lowerCasemodeLabel.innerHTML = 'Lowercase';
			lowerCasemodeLabel.className = 'vis-setting';

		var upperCaseDiv = document.createElement('div');	
			upperCaseDiv.className = 'vis-setting switch';
		var upperCasemode = document.createElement('input');
			upperCasemode.id = 'upperCasemode';
			upperCasemode.type = 'radio';
			upperCasemode.name = 'caseMode';
			upperCasemode.checked = true;
			upperCasemode.className = 'vis-setting switch-input';
			upperCasemode.addEventListener("change", function(){
				init();			
			});
		var upperCasemodePaddel = document.createElement('label');
			upperCasemodePaddel.className = 'vis-setting switch-paddle';
			upperCasemodePaddel.htmlFor = 'upperCasemode';
		var upperCasemodeLabel = document.createElement('label');
			upperCasemodeLabel.htmlFor = 'upperCasemode';
			upperCasemodeLabel.innerHTML = 'Uppercase';
			upperCasemodeLabel.className = 'vis-setting';

		var caseOffDiv = document.createElement('div');	
			caseOffDiv.className = 'vis-setting switch';
		var caseOffmode = document.createElement('input');
			caseOffmode.id = 'caseOffmode';
			caseOffmode.type = 'radio';
			caseOffmode.name = 'caseMode';
			caseOffmode.className = 'vis-setting switch-input';
			caseOffmode.addEventListener("change", function(){
				init();			
			});
		var caseOffmodePaddel = document.createElement('label');
			caseOffmodePaddel.className = 'vis-setting switch-paddle';
			caseOffmodePaddel.htmlFor = 'caseOffmode';
		var caseOffmodeLabel = document.createElement('label');
			caseOffmodeLabel.htmlFor = 'caseOffmode';
			caseOffmodeLabel.innerHTML = 'Off';
			caseOffmodeLabel.className = 'vis-setting';

	visSettings.appendChild(textAreaLabel);
	visSettings.appendChild(textAreaInput);

				lowerCaseDiv.appendChild(lowerCasemodeLabel);
				lowerCaseDiv.appendChild(lowerCasemode);
				lowerCaseDiv.appendChild(lowerCasemodePaddel);
			caseDiv.appendChild(lowerCaseDiv)
				upperCaseDiv.appendChild(upperCasemodeLabel);
				upperCaseDiv.appendChild(upperCasemode);
				upperCaseDiv.appendChild(upperCasemodePaddel);
			caseDiv.appendChild(upperCaseDiv)
				caseOffDiv.appendChild(caseOffmodeLabel);
				caseOffDiv.appendChild(caseOffmode);
				caseOffDiv.appendChild(caseOffmodePaddel);
			caseDiv.appendChild(caseOffDiv)
		visSettings.appendChild(caseDiv);

	var textSample, typeFace, maxFontSize, leading;
	var xPos, yPos, endOfPage;
	var i, fontSize;
	
	function init(){
		if(textAreaInput.value.length > 0){
			textSample = textAreaInput.value;
		}else{
			textSample = textAreaInput.placeholder;
		}
		if(upperCasemode.checked){
			textSample = textSample.toUpperCase();
		}else if(lowerCasemode.checked){
			textSample = textSample.toLowerCase();
		}
		
		typeFace = 'Arial';
		maxFontSize = canvHeight/4;
		leading = 100;
		i = fontSize = 0;

		resetPage();	
	}
	init();

	function resetPage(){
		canvasCtx.clearRect(0,0, canvWidth, canvHeight);
		canvasCtx.fillStyle = bgColor;
		canvasCtx.fillRect(0,0, canvWidth, canvHeight);
		canvasCtx.fillStyle = 'black';

		xPos = 0;
		yPos = maxFontSize/2;
		endOfPage = false;
	}


	function addLetter(){
		xPos += fontSize;
		fontSize = Math.floor((Math.random()*maxFontSize+10));
		if((xPos+maxFontSize/2) > canvWidth){
			xPos = 0;
			yPos += leading;
			if (yPos > canvHeight) {
				console.log('Final letter: ' + textSample[i-1] + ' index: ' + i);
				endOfPage = true;
			};
		}
		canvasCtx.font = fontSize + "px "+ typeFace + "";
		canvasCtx.fillText(textSample[i], xPos, yPos);

		if(!endOfPage){
			i++;
			if(i >= textSample.length) i = 0;	
			setTimeout(addLetter, 100);
		}
		else{
			resetPage();
			i++;
			if(i >= textSample.length) i = 0;
			setTimeout(addLetter, 100);
		}
	}
	addLetter();
}
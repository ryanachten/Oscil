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

	var gradModeDiv = document.createElement('form');
			gradModeDiv.className = 'vis-setting';
		var linearMode = document.createElement('input');
			linearMode.id = 'linearMode';
			linearMode.type = 'radio';
			linearMode.name = 'gradMode';
			linearMode.className = 'vis-setting';
		var linearModeLabel = document.createElement('label');
			linearModeLabel.htmlFor = 'linearMode';
			linearModeLabel.innerHTML = 'Linear';
			linearModeLabel.className = 'vis-setting';
		var radialMode = document.createElement('input');
			radialMode.id = 'radialMode';
			radialMode.type = 'radio';
			radialMode.name = 'gradMode';
			radialMode.className = 'vis-setting';
			radialMode.checked = 'true';
		var radialModeLabel = document.createElement('label');
			radialModeLabel.htmlFor = 'radialMode';
			radialModeLabel.innerHTML = 'Radial';
			radialModeLabel.className = 'vis-setting';

		gradModeDiv.appendChild(linearModeLabel);
		gradModeDiv.appendChild(linearMode);
		gradModeDiv.appendChild(radialModeLabel);
		gradModeDiv.appendChild(radialMode);
		visSettings.appendChild(gradModeDiv);


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

	var radiusDiv = document.createElement('div');
			radiusDiv.className = 'vis-setting';
		var radiusModeCheck = document.createElement('input');
			radiusModeCheck.id = 'radiusMode';
			radiusModeCheck.type = 'checkbox';
			radiusModeCheck.className = 'vis-setting';
			radiusModeCheck.checked = true;
		var radiusModeLabel = document.createElement('label');
			radiusModeLabel.htmlFor = 'radiusMode';
			radiusModeLabel.innerHTML = 'Radius Mode';
			radiusModeLabel.className = 'vis-setting';
	var resolutionDiv = document.createElement('div');
			radiusDiv.className = 'vis-setting';
		var resolutionModeCheck = document.createElement('input');
			resolutionModeCheck.id = 'resolutionMode';
			resolutionModeCheck.type = 'checkbox';
			resolutionModeCheck.className = 'vis-setting';
			resolutionModeCheck.checked = false;
		var resolutionModeLabel = document.createElement('label');
			resolutionModeLabel.htmlFor = 'resolutionMode';
			resolutionModeLabel.innerHTML = 'Resolution Mode';
			resolutionModeLabel.className = 'vis-setting';
	var strokeDiv = document.createElement('div');
			strokeDiv.className = 'vis-setting';
		var strokeModeCheck = document.createElement('input');
			strokeModeCheck.id = 'strokeMode';
			strokeModeCheck.type = 'checkbox';
			strokeModeCheck.className = 'vis-setting';
			strokeModeCheck.checked = true;
		var strokeModeLabel = document.createElement('label');
			strokeModeLabel.htmlFor = 'strokeMode';
			strokeModeLabel.innerHTML = 'Stroke Mode';
			strokeModeLabel.className = 'vis-setting';

	radiusDiv.appendChild(resolutionModeLabel);
	radiusDiv.appendChild(resolutionModeCheck);
	resolutionDiv.appendChild(radiusModeLabel);
	resolutionDiv.appendChild(radiusModeCheck);
	strokeDiv.appendChild(strokeModeLabel);
	strokeDiv.appendChild(strokeModeCheck);
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

			canvasCtx.fillStyle = 'rgba(237, 230, 224, 0.1)';
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
			particleCountInput.type = 'number';
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
		alphaInput.type = 'number';
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

	var posX = canvWidth/2;
	var posY = canvHeight/2;

	var logda = 3;

	startAnimating(5);

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
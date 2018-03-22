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
	var visGui = new dat.GUI({ autoPlace: false });
	visGui.domElement.id = 'visdat-gui';
	$('#visual-options').append(visGui.domElement);
	var visGuiSettings = {
		gradMode : 'radial'
	};
	visGui.add(visGuiSettings, 'gradMode', ['linear', 'radial']);

	canvasCtx.clearRect(0,0,canvWidth,canvHeight);

	function draw(){
		drawVisual = requestAnimationFrame(draw);
		analyser.getByteFrequencyData(dataArray);
		var colourStops = 5;

		var gradMode;
		var grad;

		if (visGuiSettings.gradMode === "linear"){
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
	var visGui = new dat.GUI({ autoPlace: false });
	visGui.domElement.id = 'visdat-gui';
	$('#visual-options').append(visGui.domElement);
	var visGuiSettings = {
		alpha : 1,
		radiusMode : true,
		resolutionMode : false,
		strokeMode : true
	};
	visGui.add(visGuiSettings, 'alpha').min(0).max(10);
	visGui.add(visGuiSettings, 'radiusMode');
	visGui.add(visGuiSettings, 'resolutionMode');
	visGui.add(visGuiSettings, 'strokeMode');


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
			if(visGuiSettings.resolutionMode){
				circleResolution = logda*3;
				if(circleResolution < 3) circleResolution = 3;
			}else{
				circleResolution = (Math.random() * 80) +2;
			}

			if(visGuiSettings.radiusMode){
				radAxis = (canvWidth > canvHeight) ? canvHeight/2 : canvWidth/2;
				radius = radAxis/logda;
				if(radius > (radAxis-10)) radius = radAxis-10;
			}else{
				radius = (Math.random() * radAxis) +2;
			}

			angle = Math.PI*2/circleResolution;

			canvasCtx.fillStyle = 'rgba(237, 230, 224, '+ (visGuiSettings.alpha/10) +')';
			canvasCtx.fillRect(0,0, canvWidth,canvHeight);

			canvasCtx.beginPath();
			for (var i = 0; i <= circleResolution; i++) {
				var x = Math.cos(angle*i) * radius;
				var y = Math.sin(angle*i) * radius;
				canvasCtx.lineTo(canvWidth/2 + x, canvHeight/2+ y);
			}
			canvasCtx.closePath();

			if(visGuiSettings.strokeMode){
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
		var visGui = new dat.GUI({ autoPlace: false });
		visGui.domElement.id = 'visdat-gui';
		$('#visual-options').append(visGui.domElement);
		var visGuiSettings = {
			particleCount : 30,
		};
		visGui.add(visGuiSettings, 'particleCount').min(5).max(50).onChange(
			function(){
				clear();
				init();
			});

		canvasCtx.globalCompositeOperation = 'source-over';

		var particles, partCounter;
		function init(){
			particles = [];
			partCounter = 0;
			for (var i = 0; i < visGuiSettings.particleCount; i++) {
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
			this.hue = 360/visGuiSettings.particleCount * (Math.random()*(visGuiSettings.particleCount-1));
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

				for (var j = 0; j < particles.length; j++) {

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

function shapeAgents(dataArray, bufferLength){

	//Runtime UI stuff
	var visGui = new dat.GUI({ autoPlace: false });
	visGui.domElement.id = 'visdat-gui';
	$('#visual-options').append(visGui.domElement);
	var visGuiSettings = {
		resolution : 20,
		initRadius : (canvWidth > canvHeight ? canvHeight : canvWidth) /8,
		fillShape : false,
		clearBg : false
	};
	visGui.add(visGuiSettings, 'resolution').min(3).max(100).onChange(init);
	visGui.add(visGuiSettings, 'initRadius').min(10)
		.max(canvWidth > canvHeight ? canvHeight : canvWidth/4)
		.step(10).onChange(init);
	visGui.add(visGuiSettings, 'fillShape');
	visGui.add(visGuiSettings, 'clearBg');


	var stepSize = 2;
	var centerStepSize = 0.01;
	var centerX, centerY;
	var x = [visGuiSettings.resolution];
	var y = [visGuiSettings.resolution];
	var logda = 3;


	function init(){

		canvasCtx.fillStyle = 'rgba(237, 230, 224, 1)';
		canvasCtx.fillRect(0,0, canvWidth,canvHeight);

		centerX = canvWidth/2;
		centerY = canvHeight/2;
		var angle = (360/visGuiSettings.resolution) * (Math.PI / 180);
		for(var i=0; i < visGuiSettings.resolution; i++){
			x[i] = Math.cos(angle*i) * visGuiSettings.initRadius;
			y[i] = Math.sin(angle*i) * visGuiSettings.initRadius;
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

			if(visGuiSettings.clearBg){
				canvasCtx.fillStyle = 'rgba(237, 230, 224, 1)';
				canvasCtx.fillRect(0,0, canvWidth,canvHeight);
			}

			//float towards randomised space on screen (in lieu of mouse)
			var randX = Math.random() * canvWidth;
			var randY = Math.random() * canvHeight;
			centerX += (randX-centerX) * centerStepSize;
			centerY += (randY-centerY) * centerStepSize;

			//calc new points
			for(var i=0; i < visGuiSettings.resolution; i++){
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
			for(var i=0; i < visGuiSettings.resolution; i++){
				canvasCtx.lineTo(x[i]+centerX, y[i]+centerY);
			}
			canvasCtx.closePath();

			canvasCtx.lineJoin = "round";
			canvasCtx.lineWidth = logda+1;
			canvasCtx.miterLimit = logda;

			if(visGuiSettings.fillShape){
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
		var visGui = new dat.GUI({ autoPlace: false });
		visGui.domElement.id = 'visdat-gui';
		$('#visual-options').append(visGui.domElement);
		var visGuiSettings = {
			showRandNode : true,
			maxRadius : 5
		};
		visGui.add(visGuiSettings, 'showRandNode').onChange(init);
		visGui.add(visGuiSettings, 'maxRadius').min(0).max(20).onChange(init);

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
			maxRad = visGuiSettings.maxRadius;
			showRandomSeeds = visGuiSettings.showRandNode;

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
	var visGui = new dat.GUI({ autoPlace: false });
	visGui.domElement.id = 'visdat-gui';
	$('#visual-options').append(visGui.domElement);
	var visGuiSettings = {
		textInput : 'there is always soma, delicious soma, half a gramme for a half-holiday, a gramme for a week-end, two grammes for a trip to the gorgeous East, three for a dark eternity on the moon',
		case : 'upper',
		leading : 100
	};
	visGui.add(visGuiSettings, 'textInput').onChange(init);
	visGui.add(visGuiSettings, 'case', ['lower', 'upper', 'off']).onChange(init);
	visGui.add(visGuiSettings, 'leading').min(10).max((canvHeight/4)*2);

	var textSample, typeFace, maxFontSize;
	var xPos, yPos, endOfPage;
	var i, fontSize;

	function init(){
		if(visGuiSettings.textInput.length > 0){
			textSample = visGuiSettings.textInput;
		}else{
			textSample = 'there is always soma, delicious soma, half a gramme for a half-holiday, a gramme for a week-end, two grammes for a trip to the gorgeous East, three for a dark eternity on the moon';
		}
		if(visGuiSettings.case === 'upper'){
			textSample = textSample.toUpperCase();
		}else if(visGuiSettings.case === 'lower'){
			textSample = textSample.toLowerCase();
		}

		typeFace = 'Arial';
		maxFontSize = canvHeight/4;
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

	var logda, expda;

	function addLetter(){

		analyser.getByteFrequencyData(dataArray);
		var da = dataArray[0];
		if (da !== 0){
			logda = (Math.log(da) / Math.log(7))*-1;
			expda = Math.floor(Math.exp(logda)*1000);
		}

		xPos += fontSize;
		fontSize = Math.floor((Math.random()*maxFontSize+10));
		if((xPos+maxFontSize/2) > canvWidth){
			xPos = 0;
			yPos += visGuiSettings.leading;
			if (yPos > canvHeight) {
				// console.log('Final letter: ' + textSample[i-1] + ' index: ' + i);
				endOfPage = true;
			};
		}
		canvasCtx.font = fontSize + "px "+ typeFace + "";
		canvasCtx.fillText(textSample[i], xPos, yPos);

		if(!endOfPage){
			i++;
			if(i >= textSample.length) i = 0;
			drawVisual = setTimeout(addLetter, expda);
		}
		else{
			resetPage();
			i++;
			if(i >= textSample.length) i = 0;
			drawVisual = setTimeout(addLetter, expda);
		}
		if($('.visual-mode.active').data('visual') !== 'ConcretePoetry'){
			console.log('clearMe');
			clearTimeout(drawVisual);

		}
	}
	addLetter();
}

function lissajousFigure(dataArray, bufferLength){

		//Runtime UI stuff
		var visGui = new dat.GUI({ autoPlace: false });
		visGui.domElement.id = 'visdat-gui';
		$('#visual-options').append(visGui.domElement);
		var visGuiSettings = {
			freqX : 70,
			freqY : 40,
			modFreqX : 40,
			modFreqY : 40,
			phi : 95,
			pointCount : 1000,
			modulated : false
		};
		visGui.add(visGuiSettings, 'pointCount').min(10).max(1000).onChange(init);
		visGui.add(visGuiSettings, 'phi').min(1).max(360);
		visGui.add(visGuiSettings, 'freqX').min(1).max(70);
		visGui.add(visGuiSettings, 'freqY').min(1).max(70);
		visGui.add(visGuiSettings, 'modulated').onChange(init);
		visGui.add(visGuiSettings, 'modFreqX').min(1).max(70);
		visGui.add(visGuiSettings, 'modFreqY').min(1).max(70);

		var pointCount;
		var freqX, freqY;
		var phi, angle;
		var x, y;
		var margin = 20;

		var modFreqX = 2;
		var modFreqY = 4;
		var modPhi = 0;

		var w, maxDist;
		var oldX, oldY;

		var factorX = canvWidth/2 - margin;
		var factorY = canvHeight/2 - margin;

		var modulated;

		function init(){
			canvasCtx.clearRect(0,0, canvWidth, canvHeight);
			canvasCtx.fillStyle = bgColor;
			canvasCtx.fillRect(0,0, canvWidth, canvHeight);

			if(visGuiSettings.modulated){
				modulated = true;
			}else{
				modulated = false;
			}
			canvasCtx.strokeStyle = 'black';
			pointCount = visGuiSettings.pointCount;
			freqX = visGuiSettings.freqX;
			freqY = visGuiSettings.freqY;
			phi = visGuiSettings.phi;

			startAnimating(15);
		}
		init();


		function draw(){

			canvasCtx.clearRect(0,0, canvWidth, canvHeight);
			canvasCtx.fillStyle = bgColor;
			canvasCtx.fillRect(0,0, canvWidth, canvHeight);

			analyser.getByteFrequencyData(dataArray);
			var da = dataArray[0];
			var logda = (Math.log(da) / Math.log(2));
			if(isFinite(logda) && logda !== 0){
				freqX = logda * visGuiSettings.freqX;
				freqY = logda * visGuiSettings.freqY;
				modFreqX = logda * visGuiSettings.modFreqX;
				modFreqY = logda * visGuiSettings.modFreqY;
				phi = visGuiSettings.phi - logda;
			}
			// console.log('logda: ' + logda);
			// console.log('freqX: ' + freqX + ' freqY: ' + freqY);
			// console.log('phi: ' + phi);

			canvasCtx.beginPath();

			for(var i = 0; i < pointCount; i++){
				angle = map_range(i, 0,pointCount, 0,Math.PI*2);

				if(modulated){
					x = Math.sin(angle*freqX + (Math.PI/180)*phi * Math.cos(angle *modFreqX));
					y = Math.sin(angle*freqY) * Math.cos(angle * modFreqY);
				}else{
					x = Math.sin(angle*freqX + (Math.PI/180)*phi); //lissajous
					y = Math.sin(angle*freqY); //lissajous
				}

				x =  x * factorX + canvWidth/2;
				y = y * factorY + canvHeight/2;

				canvasCtx.lineTo(x,y);
			}
			// canvasCtx.closePath();
			canvasCtx.stroke();
		}

		function map_range(value, low1, high1, low2, high2) {
			return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
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

function lissajousWebs(dataArray, bufferLength){

		//Runtime UI stuff
		var visGui = new dat.GUI({ autoPlace: false });
		visGui.domElement.id = 'visdat-gui';
		$('#visual-options').append(visGui.domElement);
		var visGuiSettings = {
			freqX : 7,
			freqY : 7,
			modFreqX : 3,
			modFreqY : 2,
			phi : 15,
			pointCount : 1000
		};
		visGui.add(visGuiSettings, 'pointCount').min(10).max(1000).onChange(init);
		visGui.add(visGuiSettings, 'phi').min(1).max(720);
		visGui.add(visGuiSettings, 'freqX').min(1).max(20);
		visGui.add(visGuiSettings, 'freqY').min(1).max(20);
		visGui.add(visGuiSettings, 'modFreqX').min(1).max(20);
		visGui.add(visGuiSettings, 'modFreqY').min(1).max(20);

		var pointCount = 1000;
		var lissajousPoints;

		var freqX, freqY;
		var phi;

		var modFreqX, modFreqY;

		var lineWeight = 1;
		var strokeStyle = 'black';
		var lineAlpha = 0.5;

		var connectionRadius = 100;


		function init(){
			canvasCtx.strokeStyle = 'black';
			pointCount = visGuiSettings.pointCount;
			startAnimating(10);
		}
		init();


		function calcLissajPoints(){

			lissajousPoints = [];

			canvasCtx.clearRect(0,0, canvWidth, canvHeight);
			canvasCtx.fillStyle = bgColor;
			canvasCtx.fillRect(0,0, canvWidth, canvHeight);

			analyser.getByteFrequencyData(dataArray);
			var da = dataArray[0];
			var logda = (Math.log(da) / Math.log(2));
			if(isFinite(logda) && logda !== 0){
				freqX = logda * visGuiSettings.freqX;
				freqY = logda * visGuiSettings.freqY;
				modFreqX = logda * visGuiSettings.modFreqX;
				modFreqY = logda * visGuiSettings.modFreqY;
				phi = visGuiSettings.phi - logda;
			}

			for (var i = 0; i <= pointCount; i++) {

				var angle = map_range(i, 0,pointCount, 0,Math.PI);
				var x = Math.sin(angle * freqX + ((Math.PI/180)*phi) * Math.cos(angle * modFreqX));
				var y = Math.sin(angle * freqY) * Math.cos(angle * modFreqY);

				x = x * (canvWidth/2 -30);
				y = y * (canvHeight/2 -30);

				lissajousPoints.push({
					x: x,
					y: y
				});
			}
			drawLissaj();
		}
		calcLissajPoints();

		function drawLissaj(){
			canvasCtx.lineWidth = lineWeight;

			for(var i = 0; i < pointCount; i++){
				for(var j = 0; j < pointCount; j++){

					var p1 = lissajousPoints[i];
					var p2 = lissajousPoints[j];

					var d = Math.sqrt(Math.pow((p2.x-p1.x),2) + Math.pow((p2.y-p1.y),2));
					var a = Math.pow(1/(d/connectionRadius+1), 6);

					if(d <= connectionRadius){
						// h = map_range(1-a, 0,1, minHueValue, maxHueValue) % 360;
						// canvasCtx.strokeStyle = 'hsla('+ h +',50%,50%,' + a +')';

						canvasCtx.beginPath();
						canvasCtx.moveTo(p1.x + canvWidth/2, p1.y + canvHeight/2);
						canvasCtx.lineTo(p2.x  + canvWidth/2, p2.y + canvHeight/2);
						canvasCtx.strokeStyle = 'rgba(0,0,0,' + a +')';
						canvasCtx.stroke();
					}
				}
			}
		}


		function map_range(value, low1, high1, low2, high2) {
			return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
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

				calcLissajPoints();
			}
		}
	}

function nodeAttraction(dataArray, bufferLength){

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
		var visGui = new dat.GUI({ autoPlace: false });
		visGui.domElement.id = 'visdat-gui';
		$('#visual-options').append(visGui.domElement);
		var visGuiSettings = {
			nodeDamping : 40,
			showAttractNode : false,
			attractRadius : 200,
			attractStrength : -10,
			attractRamp : 200,
			attractMaxVelocity : 15
		};
		visGui.add(visGuiSettings, 'nodeDamping').min(0).max(100);
		visGui.add(visGuiSettings, 'showAttractNode');
		visGui.add(visGuiSettings, 'attractRadius').min(0).max(500);
		visGui.add(visGuiSettings, 'attractStrength').min(-50).max(50);
		visGui.add(visGuiSettings, 'attractRamp').min(0).max(1000);
		visGui.add(visGuiSettings, 'attractMaxVelocity').min(0).max(20);


		var xCount = canvWidth/10;
		var yCount = canvHeight/10;
		var nodeCount = xCount * yCount;
		var nodes;
		var node_Damping = visGuiSettings.nodeDamping/100;

		var attractor;
		var attractor_MaxRamp, attractor_Radius, attractor_Strength;

		var attractNode;
		var attractNode_MaxVelocity;

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
				attractor.radius = visGuiSettings.attractRadius;
				attractor.strength = visGuiSettings.attractStrength;
				attractor.ramp = visGuiSettings.attractRamp/100;

			attractNode = new Node(canvWidth/2, canvHeight/2);
				attractNode.setBoundary(0,0, canvWidth, canvHeight);
				attractNode.setDamping(0);

				attractNode.velocity.x = visGuiSettings.attractMaxVelocity/2;
				attractNode.velocity.y = visGuiSettings.attractMaxVelocity/2;

			startAnimating(10);
		}
		init();


		function draw(){

			analyser.getByteFrequencyData(dataArray);
			var da = dataArray[0];

			canvasCtx.clearRect(0,0, canvWidth,canvHeight);
			canvasCtx.fillStyle = bgColor;
			canvasCtx.fillRect(0,0, canvWidth,canvHeight);

			attractor_Radius = visGuiSettings.attractRadius;
			attractor_Strength = visGuiSettings.attractStrength;
			attractNode_MaxVelocity = visGuiSettings.attractMaxVelocity;
			attractor_MaxRamp = da/visGuiSettings.attractRamp;

			attractor.strength = attractor_Strength;
			attractor.radius = attractor_Radius;

			//velocity cap
			if(attractNode.velocity.x > attractNode_MaxVelocity) attractNode.velocity.x = attractNode_MaxVelocity;
			if(attractNode.velocity.x < attractNode_MaxVelocity *-1) attractNode.velocity.x = attractNode_MaxVelocity*-1;
			if(attractNode.velocity.y > attractNode_MaxVelocity) attractNode.velocity.y = attractNode_MaxVelocity;
			if(attractNode.velocity.y < attractNode_MaxVelocity *-1) attractNode.velocity.y = attractNode_MaxVelocity*-1;

			attractNode.velocity.x -= Math.random()*attractNode_MaxVelocity;
			attractNode.velocity.y -= Math.random()*attractNode_MaxVelocity;
			attractNode.velocity.x += Math.random()*attractNode_MaxVelocity;
			attractNode.velocity.y += Math.random()*attractNode_MaxVelocity;

			attractNode.update();
			if(visGuiSettings.showAttractNode){
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

			for(var i = 0; i < nodes.length; i++){

				node_Damping = visGuiSettings.nodeDamping/100;
				nodes[i].setDamping(node_Damping);
				attractor.attract(nodes[i]);
				nodes[i].update();

				canvasCtx.beginPath();
				canvasCtx.arc(nodes[i].x, nodes[i].y, 2, 0, Math.PI*2);
				canvasCtx.closePath();

				var rand = Math.floor(Math.random()*2);
				if(i%5 === 0){
					canvasCtx.fillStyle = 'hsl(282, 100%, 50%)';
				}else if(i%3 === 0){
					canvasCtx.fillStyle = 'hsl(332, 100%, 50%)';
				}else{
					canvasCtx.fillStyle = 'hsl(182, 100%, 50%)';
				}

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

function chladniPlate(dataArray, bufferLength){

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
		var visGui = new dat.GUI({ autoPlace: false });
		visGui.domElement.id = 'visdat-gui';
		$('#visual-options').append(visGui.domElement);
		var visGuiSettings = {
			nodeDamping : 10,
			mode : 'smooth',
			attractRadius : 10,
			attractStrength : 100,
			attractRamp : 1,
		};
		visGui.add(visGuiSettings, 'nodeDamping').min(0).max(100);
		visGui.add(visGuiSettings, 'mode', ['basic', 'smooth', 'twirl']);
		visGui.add(visGuiSettings, 'attractRadius').min(0).max(20);
		visGui.add(visGuiSettings, 'attractStrength').min(0).max(200);
		visGui.add(visGuiSettings, 'attractRamp').min(0.1).max(5);

		var xCount = 100;
		var yCount = 100;
		var gridStepX = canvWidth/xCount;
		var gridStepY = canvHeight/yCount;

		var nodeDamping;
		var attractor, nodes;

		function init(){

			attractor = new Attractor(canvWidth/2, canvHeight/2);
			nodes = [];

			canvasCtx.lineWidth = 1;
			canvasCtx.strokeStyle = 'black';

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

			if(visGuiSettings.mode === 'smooth'){
				attractor.mode = 'smooth';
			}else if(visGuiSettings.mode === 'twirl'){
				attractor.mode = 'twirl';
			}else{
				attractor.mode = 'basic';
			}

			analyser.getByteFrequencyData(dataArray);
			var da = dataArray[0];

			attractor.strength = Math.random()* (da * (visGuiSettings.attractStrength/100));
				if(Math.floor(Math.random()*2) === 1) attractor.strength *= -1;
			attractor.radius = Math.random()* (da*visGuiSettings.attractRadius);

			attractor.ramp = Math.random()*visGuiSettings.attractRamp;

			// nodeDamping = Math.random()*0.8;
			// 	if(Math.floor(Math.random()*2) === 1) nodeDamping *= -1;

			nodeDamping = visGuiSettings.nodeDamping/100; //non-random


			for (var i = 0; i < nodes.length; i++) {
				nodes[i].setDamping(nodeDamping);
				attractor.attract(nodes[i]);
				nodes[i].update();
			}

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

function fractalTree(dataArray, bufferLength){

  $('#visualiser').hide();

  function resetCanv(){
    var newVis = $('.visual-mode.active').data('visual');
		if( newVis !== 'FractalTree'){
			removeP5Canvas(newVis);
			$('.visual-mode').off('click', resetCanv);
		}
	}
	$('.visual-mode').on('click', resetCanv);

  var visGui = new dat.GUI({ autoPlace: false });
	visGui.domElement.id = 'visdat-gui';
	$('#visual-options').append(visGui.domElement);
	var visGuiSettings = {
		treeCount : 12,
		reactTreeNum : true,
		branchCount : 200,
		reactBranchNum : true,
		branchLength : 100,
		reactLength : true,
		branchDecay : 67,
		reactDecay : false,
	};
	visGui.add(visGuiSettings, 'treeCount').min(0).max(24).step(4);
	visGui.add(visGuiSettings, 'reactTreeNum');
	visGui.add(visGuiSettings, 'branchCount').min(0).max(500);
	visGui.add(visGuiSettings, 'reactBranchNum');
	visGui.add(visGuiSettings, 'branchLength').min(0).max(1000);
	visGui.add(visGuiSettings, 'reactLength');
	visGui.add(visGuiSettings, 'branchDecay').min(0).max(100);
	visGui.add(visGuiSettings, 'reactDecay');

  var p5Init = function( p ) {

		var tree = [];
		var da;

    p.setup = function() {
      var canvas = p.createCanvas(canvWidth, canvHeight);
      canvas.id('p5-canvas');
			p.colorMode(p.HSB);
    };

    p.draw = function() {

			analyser.getByteFrequencyData(dataArray);
			da = p.map(dataArray[0], 0, 255, 0, 1);
			console.log(dataArray[0]);

			var treeCount = visGuiSettings.treeCount;
			if (visGuiSettings.reactTreeNum) {
				treeCount = treeCount * da + (treeCount/2);
			}

			p.background(bgColor);
			var branchCount = visGuiSettings.branchCount;
			if (visGuiSettings.reactBranchNum) {
				branchCount = branchCount * da;
			}

			p.translate(canvWidth/2, canvHeight/2);

			for (var i = 0; i < treeCount; i++) {
				drawTree(branchCount);
				p.rotate((Math.PI/180)*(360/treeCount));
			}
		};

		function drawTree(branchCount){
			tree = [];
			var a = p.createVector(0, 0);
			var branchLength = visGuiSettings.branchLength;
			if(visGuiSettings.reactLength){
				branchLength = branchLength*da+(branchLength/2);
			}
			var b = p.createVector(0, 0 -branchLength);

			tree[0] = new Branch(a, b);

			for (var i = 0; i < branchCount/2; i++) {
				if(!tree[i].finished){
					tree.push(tree[i].branchA());
					tree.push(tree[i].branchB());
					tree[i].finished = true;
				}
				tree[i].hue += 20;
				tree[i].show();
			}
		}

		function Branch(start, end){
			this.hue = 200;
			this.begin = start;
			this.end = end;
			this.finished = false;
			this.show = function(){
				p.stroke(this.hue, 100, 50);
				p.line( this.begin.x, this.begin.y, this.end.x, this.end.y);
			}
			this.branchA = function(){
				var dir = p5.Vector.sub(this.end, this.begin);
				dir.rotate(p.PI/4);
				var branchDecay = visGuiSettings.branchDecay;
				if (visGuiSettings.reactDecay) {
					branchDecay = branchDecay*(1-da) + branchDecay/2;
				}
				dir.mult(branchDecay/100);
				var newEnd = p5.Vector.add(this.end, dir);
				var right = new Branch(this.end, newEnd);
				return right;
			}
			this.branchB = function(){
				var dir = p5.Vector.sub(this.end, this.begin);
				dir.rotate(-p.PI/4);
				var branchDecay = visGuiSettings.branchDecay;
				if (visGuiSettings.reactDecay) {
					branchDecay = branchDecay*(1-da) + branchDecay/2;
				}
				dir.mult(branchDecay/100);
				var newEnd = p5.Vector.add(this.end, dir);
				var left = new Branch(this.end, newEnd);
				return left;
			}
		}

  };

  var myp5 = new p5(p5Init, 'container');
}

function lSystem(dataArray, bufferLength){

  $('#visualiser').hide();

  function resetCanv(){
    var newVis = $('.visual-mode.active').data('visual');
		if( newVis !== 'Lsystem'){
			removeP5Canvas(newVis);
			$('.visual-mode').off('click', resetCanv);
		}
	}
	$('.visual-mode').on('click', resetCanv);

  // var visGui = new dat.GUI({ autoPlace: false });
	// visGui.domElement.id = 'visdat-gui';
	// $('#visual-options').append(visGui.domElement);
	// var visGuiSettings = {
	// 	treeCount : 12,
	// 	reactTreeNum : true,
	// 	branchCount : 200,
	// 	reactBranchNum : true,
	// 	branchLength : 100,
	// 	reactLength : true,
	// 	branchDecay : 67,
	// 	reactDecay : false,
	// };
	// visGui.add(visGuiSettings, 'treeCount').min(0).max(24).step(4);
	// visGui.add(visGuiSettings, 'reactTreeNum');
	// visGui.add(visGuiSettings, 'branchCount').min(0).max(500);
	// visGui.add(visGuiSettings, 'reactBranchNum');
	// visGui.add(visGuiSettings, 'branchLength').min(0).max(1000);
	// visGui.add(visGuiSettings, 'reactLength');
	// visGui.add(visGuiSettings, 'branchDecay').min(0).max(100);
	// visGui.add(visGuiSettings, 'reactDecay');

  var p5Init = function( p ) {

    p.setup = function() {
      var canvas = p.createCanvas(canvWidth, canvHeight);
      canvas.id('p5-canvas');
			p.background(51);
			p.stroke(255);
    };

		var axiom = "F";
		var sentence = axiom;
		var rules = [];
		rules[0] = {
			a : 'F',
			b : 'FF+[+F-F-F]-[-F+F+F]'
		}

		var len = 1000;

		function generate(){
			// Looks at every letter in the 'sentence' / axiom
			// and replaces according to the rule

			var nextSentence = "";
			len *= 0.5;

			for (var i = 0; i < sentence.length; i++) {

				var found = false;
				var current = sentence.charAt(i);

				for (var j = 0; j < rules.length; j++) {
						if( current == rules[j].a ){
							nextSentence += rules[j].b
							found = true;
							break;
						}
				}
				if (!found) {
					nextSentence += current;
				}
			}
			sentence = nextSentence;
			turtle();
		}

		function turtle(){
			//parse each letter as a drawing instruction
			//based off the rudimentary Turtle drawer

			p.background(51);
			p.resetMatrix();
			p.translate(canvWidth/2, canvHeight);

			for (var i = 0; i < sentence.length; i++) {
				var current = sentence.charAt(i);

				if (current == 'F') {
					p.line(0,0,0, -len);
					p.translate(0, -len);
				}else if (current == '+') {
					p.rotate(p.PI/6);
				}else if (current == '-') {
					p.rotate(-p.PI/6);
				}else if (current == '[') {
					p.push();
				}else if (current == ']') {
					p.pop();
				}

			}
		}

		$('body').click(function(){
			generate();
		});


    p.draw = function() {

		};
  };

  var myp5 = new p5(p5Init, 'container');
}

function julia8bit(dataArray, bufferLength){

  $('#visualiser').hide();

  function resetCanv(){
    var newVis = $('.visual-mode.active').data('visual');
		if( newVis !== 'Julia8bit'){
			removeP5Canvas(newVis);
			$('.visual-mode').off('click', resetCanv);
		}
	}
	$('.visual-mode').on('click', resetCanv);

  var visGui = new dat.GUI({ autoPlace: false });
	visGui.domElement.id = 'visdat-gui';
	$('#visual-options').append(visGui.domElement);
	var visGuiSettings = {
		sampleRes : 140,
		maxIterations : 35,
		aConst: -0.70176,
		bConst: - 0.02,
		minPos : -1.6,
		maxPos : 1.7,
	};
	visGui.add(visGuiSettings, 'sampleRes').min(0).max(500).step(1);
	visGui.add(visGuiSettings, 'maxIterations').min(0).max(100).step(1);
	visGui.add(visGuiSettings, 'minPos').min(-2.5).max(2.5);
	visGui.add(visGuiSettings, 'maxPos').min(-2.5).max(2.5);
	visGui.add(visGuiSettings, 'aConst').min(-2.50000).max(2.50000);
	visGui.add(visGuiSettings, 'bConst').min(-2.50000).max(2.50000);

  var p5Init = function( p ) {

    p.setup = function() {
      var canvas = p.createCanvas(canvWidth, canvHeight);
      canvas.id('p5-canvas');
			p.pixelDensity(1);
			p.noStroke();
			p.colorMode(p.HSB, 255);
    };

    p.draw = function() {

			p.background(0);

			analyser.getByteFrequencyData(dataArray);

			var sampleSize = visGuiSettings.sampleRes;
			var sampleWidth = p.width/sampleSize;
			var sampleHeight = p.height/sampleSize;

			var da = p.map(dataArray[0], 0, 255, -2.5, 2.5);
			// console.log(da);

			for(var x = 0; x < sampleSize; x++){
				for(var y = 0; y < sampleSize; y++){

					var a = p.map( x*sampleWidth, 0, sampleWidth*sampleSize, visGuiSettings.minPos, visGuiSettings.maxPos );
					var b = p.map( y*sampleHeight, 0, sampleHeight*sampleSize, visGuiSettings.minPos, visGuiSettings.maxPos );

					var ca = a;
					var cb = b;

					var maxIterations = visGuiSettings.maxIterations + da;
					var n = 0; //tracks the number of iterations


					//  complex numbers which does not diverge when iterated
					while (n < maxIterations) {

						// mandelbrot
						// var aa = a * a - b * b;
						// var bb = 2 * a * b;
						// a = aa + ca;
						// b = bb + cb;

						// mandelbrot
						// var escapeTime = 4;
						// if (a * a + b * b > escapeTime) { //ensures result doesn't tend towards infinity

						// julia
						var aa = a * a;
						var bb = b * b;
						// julia
						var escapeTime = 4;
						if (aa + bb > escapeTime){

							break;
						}
						var twoab = 2.0 * a * b;
						a = aa - bb + (visGuiSettings.aConst + da);
						b = twoab + visGuiSettings.bConst;


						n++;
					}

					var bright = p.map(n, 0, maxIterations, 0, 255);
					// // check if n is inside of the mandelbrot set
					if (n === maxIterations) {
						bright = 0;
					}
					p.fill(Math.sin(bright)*255, 200, Math.sin(bright)*255);
					p.ellipseMode(p.CENTER);
					p.ellipse(x*sampleWidth, y*sampleHeight, sampleWidth, sampleHeight);
				}
			}
    };
  };

  var myp5 = new p5(p5Init, 'container');
}

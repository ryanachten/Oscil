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
	var visGui = new dat.GUI();
	var visGuiSettings = {
		gradMode : 'radial'
	};
	visGui.add(visGuiSettings, 'gradMode', ['linear', 'radial']);

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
	var visGui = new dat.GUI();
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
		var visGui = new dat.GUI();
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

function dumbAgents(dataArray, bufferLength){

	//Runtime UI stuff
	var visGui = new dat.GUI();
	var visGuiSettings = {
		alpha : 0.2
	};
	visGui.add(visGuiSettings, 'alpha').min(0).max(100);

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

		canvasCtx.fillStyle = 'rgba(237, 230, 224, ' + visGuiSettings.alpha +')';
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
	var visGui = new dat.GUI();
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
		var visGui = new dat.GUI();
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

		var leadingInput = document.createElement('input');
			leadingInput.id = 'leadingInput';
			leadingInput.type = 'range';
			leadingInput.className = 'vis-setting';
			leadingInput.min = 10;
			leadingInput.max = (canvHeight/4)*2;
			leadingInput.value = 100;
		var leadingLabel = document.createElement('label');
			leadingLabel.htmlFor = 'leadingInput';
			leadingLabel.innerHTML = 'Line Height';
			leadingLabel.className = 'vis-setting';


	visSettings.appendChild(textAreaLabel);
	visSettings.appendChild(textAreaInput);

	visSettings.appendChild(leadingLabel);
	visSettings.appendChild(leadingInput);

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



	var textSample, typeFace, maxFontSize;
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
		// console.log('logda: ' + logda);
		// console.log(' ');

		xPos += fontSize;
		fontSize = Math.floor((Math.random()*maxFontSize+10));
		if((xPos+maxFontSize/2) > canvWidth){
			xPos = 0;
			yPos += parseInt(leadingInput.value);;
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
			drawVisual = setTimeout(addLetter, expda);
		}
		else{
			resetPage();
			i++;
			if(i >= textSample.length) i = 0;
			drawVisual = setTimeout(addLetter, expda);
		}
		if(document.getElementById('visual-select').value !== 'ConcretePoetry'){
			console.log('clearMe');
			clearTimeout(drawVisual);

		}
	}
	addLetter();
}

function lissajousFigure(dataArray, bufferLength){

		//Runtime UI stuff
		var visSettings	= document.getElementById('vis-settings');
			visSettings.style.display = 'block';

		var freqXInput = document.createElement('input');
			freqXInput.type = 'range';
			freqXInput.id = 'freqXInput';
			freqXInput.className = 'vis-setting';
			freqXInput.min = 1;
			freqXInput.max = 70;
			freqXInput.value = 40;
		var freqXLabel = document.createElement('label');
			freqXLabel.htmlFor = 'freqXInput';
			freqXLabel.className = 'vis-setting';
			freqXLabel.innerHTML = 'Freq X';

		var freqYInput = document.createElement('input');
			freqYInput.type = 'range';
			freqYInput.id = 'freqYInput';
			freqYInput.className = 'vis-setting';
			freqYInput.min = 1;
			freqYInput.max = 70;
			freqYInput.value = 40;
		var freqYLabel = document.createElement('label');
			freqYLabel.htmlFor = 'freqYInput';
			freqYLabel.className = 'vis-setting';
			freqYLabel.innerHTML = 'Freq Y';

		var phiInput = document.createElement('input');
			phiInput.type = 'range';
			phiInput.id = 'phiInput';
			phiInput.className = 'vis-setting';
			phiInput.min = 1;
			phiInput.max = 360;
			phiInput.value = 95;
		var phiLabel = document.createElement('label');
			phiLabel.htmlFor = 'phiInput';
			phiLabel.className = 'vis-setting';
			phiLabel.innerHTML = 'Phi';

		var pointCountInput = document.createElement('input');
			pointCountInput.type = 'range';
			pointCountInput.id = 'pointCountInput';
			pointCountInput.className = 'vis-setting';
			pointCountInput.min = 10;
			pointCountInput.max = 1000;
			pointCountInput.value = 1000;
			pointCountInput.addEventListener("change", function(){
					init();
				});
		var pointCountLabel = document.createElement('label');
			pointCountLabel.htmlFor = 'pointCountInput';
			pointCountLabel.className = 'vis-setting';
			pointCountLabel.innerHTML = 'Point Count';

		var modFreqXInput = document.createElement('input');
			modFreqXInput.type = 'range';
			modFreqXInput.id = 'modFreqXInput';
			modFreqXInput.className = 'vis-setting';
			modFreqXInput.min = 1;
			modFreqXInput.max = 70;
			modFreqXInput.value = 40;
		var modFreqXLabel = document.createElement('label');
			modFreqXLabel.htmlFor = 'modFreqXInput';
			modFreqXLabel.className = 'vis-setting';
			modFreqXLabel.innerHTML = 'Mod Freq X';

		var modFreqYInput = document.createElement('input');
			modFreqYInput.type = 'range';
			modFreqYInput.id = 'modFreqYInput';
			modFreqYInput.className = 'vis-setting';
			modFreqYInput.min = 1;
			modFreqYInput.max = 70;
			modFreqYInput.value = 40;
		var modFreqYLabel = document.createElement('label');
			modFreqYLabel.htmlFor = 'modFreqYInput';
			modFreqYLabel.className = 'vis-setting';
			modFreqYLabel.innerHTML = 'Mod Freq Y';

		var modulatedDiv = document.createElement('div');
				modulatedDiv.className = 'vis-setting';
			var modulatedCheck = document.createElement('input');
				modulatedCheck.id = 'modulatedCheck';
				modulatedCheck.type = 'checkbox';
				modulatedCheck.className = 'vis-setting switch-input';
				modulatedCheck.checked = false;
				modulatedCheck.addEventListener("change", function(){
					init();
				});
			var modulatedPaddel = document.createElement('label');
				modulatedPaddel.className = 'vis-setting switch-paddle';
				modulatedPaddel.htmlFor = 'modulatedCheck';
			var modulatedLabel = document.createElement('label');
				modulatedLabel.htmlFor = 'modulatedCheck';
				modulatedLabel.innerHTML = 'Modulated';
				modulatedLabel.className = 'vis-setting';

			modulatedDiv.appendChild(modulatedLabel);
			modulatedDiv.appendChild(modulatedCheck);
			modulatedDiv.appendChild(modulatedPaddel);
		visSettings.appendChild(modulatedDiv);
		visSettings.appendChild(pointCountLabel);
		visSettings.appendChild(pointCountInput);
		visSettings.appendChild(phiLabel);
		visSettings.appendChild(phiInput);
		visSettings.appendChild(freqXLabel);
		visSettings.appendChild(freqXInput);
		visSettings.appendChild(freqYLabel);
		visSettings.appendChild(freqYInput);

		visSettings.appendChild(modFreqXLabel);
		visSettings.appendChild(modFreqXInput);
		visSettings.appendChild(modFreqYLabel);
		visSettings.appendChild(modFreqYInput);

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

			if(modulatedCheck.checked){
				modulated = true;
			}else{
				modulated = false;
			}
			canvasCtx.strokeStyle = 'black';
			pointCount = parseInt(pointCountInput.value);
			freqX = parseInt(freqXInput.value);
			freqY = parseInt(freqYInput.value);
			phi = parseInt(phiInput.value);
			console.log('pointCount: ' + pointCount);
			console.log('freqX: ' + freqX + ' freqY: ' + freqY);
			console.log('phi: ' + phi);

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
				freqX = logda * parseInt(freqXInput.value);
				freqY = logda * parseInt(freqYInput.value);
				modFreqX = logda * parseInt(modFreqXInput.value);
				modFreqY = logda * parseInt(modFreqYInput.value);
				phi = parseInt(phiInput.value) - logda;
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
		var visSettings	= document.getElementById('vis-settings');
			visSettings.style.display = 'block';

		var freqXInput = document.createElement('input');
			freqXInput.type = 'range';
			freqXInput.id = 'freqXInput';
			freqXInput.className = 'vis-setting';
			freqXInput.min = 1;
			freqXInput.max = 20;
			freqXInput.value = 10;
		var freqXLabel = document.createElement('label');
			freqXLabel.htmlFor = 'freqXInput';
			freqXLabel.className = 'vis-setting';
			freqXLabel.innerHTML = 'Freq X';

		var freqYInput = document.createElement('input');
			freqYInput.type = 'range';
			freqYInput.id = 'freqYInput';
			freqYInput.className = 'vis-setting';
			freqYInput.min = 1;
			freqYInput.max = 20;
			freqYInput.value = 7;
		var freqYLabel = document.createElement('label');
			freqYLabel.htmlFor = 'freqYInput';
			freqYLabel.className = 'vis-setting';
			freqYLabel.innerHTML = 'Freq Y';

		var phiInput = document.createElement('input');
			phiInput.type = 'range';
			phiInput.id = 'phiInput';
			phiInput.className = 'vis-setting';
			phiInput.min = 1;
			phiInput.max = 720;
			phiInput.value = 15;
		var phiLabel = document.createElement('label');
			phiLabel.htmlFor = 'phiInput';
			phiLabel.className = 'vis-setting';
			phiLabel.innerHTML = 'Phi';

		var pointCountInput = document.createElement('input');
			pointCountInput.type = 'range';
			pointCountInput.id = 'pointCountInput';
			pointCountInput.className = 'vis-setting';
			pointCountInput.min = 10;
			pointCountInput.max = 1000;
			pointCountInput.value = 1000;
			pointCountInput.addEventListener("change", function(){
					init();
				});
		var pointCountLabel = document.createElement('label');
			pointCountLabel.htmlFor = 'pointCountInput';
			pointCountLabel.className = 'vis-setting';
			pointCountLabel.innerHTML = 'Point Count';

		var modFreqXInput = document.createElement('input');
			modFreqXInput.type = 'range';
			modFreqXInput.id = 'modFreqXInput';
			modFreqXInput.className = 'vis-setting';
			modFreqXInput.min = 1;
			modFreqXInput.max = 20;
			modFreqXInput.value = 3;
		var modFreqXLabel = document.createElement('label');
			modFreqXLabel.htmlFor = 'modFreqXInput';
			modFreqXLabel.className = 'vis-setting';
			modFreqXLabel.innerHTML = 'Mod Freq X';

		var modFreqYInput = document.createElement('input');
			modFreqYInput.type = 'range';
			modFreqYInput.id = 'modFreqYInput';
			modFreqYInput.className = 'vis-setting';
			modFreqYInput.min = 1;
			modFreqYInput.max = 20;
			modFreqYInput.value = 2;
		var modFreqYLabel = document.createElement('label');
			modFreqYLabel.htmlFor = 'modFreqYInput';
			modFreqYLabel.className = 'vis-setting';
			modFreqYLabel.innerHTML = 'Mod Freq Y';

		visSettings.appendChild(pointCountLabel);
		visSettings.appendChild(pointCountInput);
		visSettings.appendChild(phiLabel);
		visSettings.appendChild(phiInput);
		visSettings.appendChild(freqXLabel);
		visSettings.appendChild(freqXInput);
		visSettings.appendChild(freqYLabel);
		visSettings.appendChild(freqYInput);

		visSettings.appendChild(modFreqXLabel);
		visSettings.appendChild(modFreqXInput);
		visSettings.appendChild(modFreqYLabel);
		visSettings.appendChild(modFreqYInput);

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
			pointCount = parseInt(pointCountInput.value);
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
				freqX = logda * parseInt(freqXInput.value);
				freqY = logda * parseInt(freqYInput.value);
				modFreqX = logda * parseInt(modFreqXInput.value);
				modFreqY = logda * parseInt(modFreqYInput.value);
				phi = parseInt(phiInput.value) - logda;
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
		var visSettings	= document.getElementById('vis-settings');
			visSettings.style.display = 'block';

		var nodeDampingInput = document.createElement('input');
			nodeDampingInput.type = 'range';
			nodeDampingInput.id = 'nodeDampingInput';
			nodeDampingInput.className = 'vis-setting';
			nodeDampingInput.min = 0;
			nodeDampingInput.max = 100;
			nodeDampingInput.value = 40; //need to be /100 for 0.8
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
			attractRampInput.max = 1000;
			attractRampInput.value = 200; //need to be /100 for 0.2
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
			attractMaxVelocityInput.value = 15;
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


		var xCount = canvWidth/10;
		var yCount = canvHeight/10;
		var nodeCount = xCount * yCount;
		var nodes;
		var node_Damping = nodeDampingInput.value/100;

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

			analyser.getByteFrequencyData(dataArray);
			var da = dataArray[0];

			canvasCtx.clearRect(0,0, canvWidth,canvHeight);
			canvasCtx.fillStyle = bgColor;
			canvasCtx.fillRect(0,0, canvWidth,canvHeight);

			attractor_Radius = attractRadiusInput.value;
			attractor_Strength = attractStrengthInput.value;
			attractNode_MaxVelocity = attractMaxVelocityInput.value;
			attractor_MaxRamp = da/attractRampInput.value;

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



			for(var i = 0; i < nodes.length; i++){

				node_Damping = nodeDampingInput.value/100;
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
		visSettings.appendChild(nodeDampingLabel);
		visSettings.appendChild(nodeDampingInput);
		visSettings.appendChild(attractRadiusLabel);
		visSettings.appendChild(attractRadiusInput);
		visSettings.appendChild(attractStrengthLabel);
		visSettings.appendChild(attractStrengthInput);
		visSettings.appendChild(attractRampLabel);
		visSettings.appendChild(attractRampInput);

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

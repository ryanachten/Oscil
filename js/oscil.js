/*
Resources:
	mdn/voice-change-o-matic
	https://github.com/mdn/voice-change-o-matic/blob/gh-pages/scripts/app.js
*/

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();


//Smoothing / calibration settings - these should all be sliders
// analyser.minDecibels = -90;
// analyser.maxDecibels = -10;
var fftInput = document.getElementById("fft-input");
fftInput.onchange = function(){
	window.cancelAnimationFrame(drawVisual);
	visualise(visualisationMode.value);
}

var smoothingRange = document.getElementById("smoothing-input");
smoothingRange.onchange = function(){
	console.log("val: " + smoothingRange.value);
	analyser.smoothingTimeConstant = smoothingRange.value/100;
}

var visualisationMode = document.querySelector('#visual-select');
visualisationMode.onchange = function(){
	window.cancelAnimationFrame(drawVisual);
	visualise(visualisationMode.value);
}


//Canvas Setup
var bgColor = 'rgb(237, 230, 224)';
var canvas = document.querySelector("#visualiser");
	
if(canvas.getContext){
	canvas.width = $(window).width();
	canvas.height = $(window).height();
	var canvWidth = canvas.width;
	var canvHeight = canvas.height;
	var canvasCtx = canvas.getContext('2d'); //wonder what this does?
	canvasCtx.fillStyle = bgColor;
	canvasCtx.fillRect(0,0, canvWidth, canvHeight);

	
	var drawVisual;

	//Microphone access
	navigator.getUserMedia (
		{
			audio: true
		},
		function(stream) {
			source = audioCtx.createMediaStreamSource(stream);
			source.connect(analyser);

			visualise(visualisationMode.value);
		  },

		function(err) {
			console.log('The following gUM error occured: ' + err);
		}
	);
}

function getBuffer(fftSize){
	analyser.fftSize = fftSize; //1024
	var bufferLength = analyser.frequencyBinCount;
	console.log(bufferLength);
	var dataArray = new Uint8Array(bufferLength);
	var dataBuffer = {
		"buffer" : bufferLength,
		"data" : dataArray
	}
	return dataBuffer;
}


function visualise(visMode){

	var dataBuffer = getBuffer(fftInput.value);
	var bufferLength = dataBuffer.buffer;
	var dataArray = dataBuffer.data;

	console.log(visMode);
	if(visMode === 'BarGraph'){
		barGraph(dataArray, bufferLength); 
	}
	else if(visMode === 'WaveForm'){
		waveForm(dataArray, bufferLength);
	}
	else if(visMode === 'Shapes'){
		shapes(dataArray, bufferLength);
	}
	else if(visMode === 'Off'){
		visOff();
	}
}

function visOff(){
	canvasCtx.clearRect(0,0,canvWidth, canvHeight);
	canvasCtx.fillStyle = bgColor;
	canvasCtx.fillRect(0,0,canvWidth, canvHeight);
}

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


function shapes(dataArray, bufferLength){
	canvasCtx.clearRect(0,0,canvWidth, canvHeight);
	canvasCtx.fillStyle = bgColor;
	canvasCtx.fillRect(0,0,canvWidth, canvHeight);

	function drawRect(){
		canvasCtx.fillStyle =  "black";

		var originX = canvWidth/2; var originY = canvHeight/2;
		var fillRectWidth = canvWidth/2; var fillRectHeight = canvHeight/2;
		var clearRectWidth = canvWidth/4; var clearRectHeight = canvHeight/4;
		var strokeRectWidth = canvWidth/8; var strokeRectHeight = canvHeight/8;

		canvasCtx.fillRect(originX-fillRectWidth/2, originY-fillRectHeight/2, fillRectWidth, fillRectHeight);
		canvasCtx.clearRect(originX-clearRectWidth/2, originY-clearRectHeight/2, clearRectWidth, clearRectHeight);
		canvasCtx.strokeRect(originX-strokeRectWidth/2, originY-strokeRectHeight/2, strokeRectWidth, strokeRectHeight);
	}
	
	function drawTriangle(){
		canvasCtx.fillStyle =  "black";

		var originX = canvWidth/2; var originY = canvHeight/2;
		var radiusX = canvWidth/4; var radiusY = canvHeight/4;

		canvasCtx.shadowOffsetX = canvWidth/8; canvasCtx.shadowOffsetY = canvHeight/8;
		canvasCtx.shadowBlur = 100;
		canvasCtx.shadowColor = 'rgba(0,0,0,0.5)';

		canvasCtx.beginPath();
		canvasCtx.moveTo(originX, originY-radiusY); //top corner
		canvasCtx.lineTo(originX+radiusX, originY+radiusY); //right
		canvasCtx.lineTo(originX-radiusX, originY+radiusY); //left corner
		canvasCtx.fill();
	}

	function drawSmiley(){

		var originX = canvWidth/2; var originY = canvHeight/2;
		var outerRadius = (canvWidth > canvHeight ? canvHeight : canvWidth)/3;
		var mouthLength = outerRadius/2; var mouthHeight = outerRadius/4;
		var eyeRadius = outerRadius/4;

		//Head
		var colourStops = 5;

		//Radial
		var grad = canvasCtx.createRadialGradient(canvWidth/2,canvHeight/2, 0, //inner circle - can move this later
													canvWidth/2, canvHeight/2,(canvWidth > canvHeight ? canvHeight : canvWidth)/2);	//outer circle

		for (var i = 1; i < colourStops; i++) {
			grad.addColorStop(1/i,'hsl(' + Math.floor((360/colourStops)*i) + ',80%, 70%)');
		};

		canvasCtx.fillStyle = grad;
		canvasCtx.beginPath();
		canvasCtx.arc(originX, originY, outerRadius, 0, Math.PI * 2, true); //outer circle
		canvasCtx.closePath();
		canvasCtx.fill();

		//Mouth
		canvasCtx.fillStyle = bgColor;
		canvasCtx.beginPath();
		canvasCtx.moveTo(originX-mouthLength, originY+mouthHeight); //left point of mouth
		canvasCtx.arc(originX, originY+mouthHeight, mouthLength, 0, Math.PI, false); //right point of mouth		
		canvasCtx.closePath();
		canvasCtx.fill();

		//Eyes
		canvasCtx.beginPath();
		canvasCtx.moveTo((originX+eyeRadius/2)-eyeRadius, originY-eyeRadius);
		canvasCtx.arc((originX-eyeRadius/2)-eyeRadius, originY-eyeRadius, eyeRadius, 0, Math.PI * 2, true); //left eye
		canvasCtx.closePath();
		canvasCtx.fill();

		canvasCtx.beginPath();
		canvasCtx.moveTo((originX+eyeRadius/2)+eyeRadius*2, originY-eyeRadius);
		canvasCtx.arc((originX-eyeRadius/2)+eyeRadius*2, originY-eyeRadius, eyeRadius, 0, Math.PI * 2, true); //left eye
		canvasCtx.closePath();
		canvasCtx.fill();		
		
	}

	function drawPath(){

		canvasCtx.fillStyle =  "black";	

		var p = new Path2D('M101.4 28.8c10.6 0 21.2 0 31.8 0 0.9 0 2.1-0.1 2.3 1 0.1 0.7-0.4 1.7-0.9 2.2 -8.1 8.1-16.2 16.1-24.4 24.1 -0.8 0.8-1.1 1.5-1.1 2.7 0.1 6 0 12 0.1 18 0 1.4-0.4 2.2-1.7 2.9 -3.7 2-7.2 4.1-10.9 6.2 -2 1.1-3 0.5-3-1.8 0-8.4 0-16.9 0-25.3 0-1.1-0.3-1.9-1.1-2.6 -8-7.8-16-15.7-23.9-23.6 -0.3-0.3-0.6-0.5-0.8-0.8 -0.3-0.6-0.8-1.5-0.6-1.9 0.3-0.5 1.2-1 1.8-1 5.6-0.1 11.2 0 16.9 0C91.1 28.8 96.3 28.8 101.4 28.8zM200 0H0v111.4h200V0z');
		canvasCtx.fill(p);
	}

	function drawGrid(){

		var cellCount = 20;

		for (var i = 0; i < cellCount; i++) {
			for (var j = 0; j < cellCount; j++) {
				canvasCtx.fillStyle = 'hsl(' + Math.floor(360/cellCount *(i+j)) + ',50%, 70%)';

				//square grid
				// canvasCtx.fillRect(j * canvWidth/cellCount, i * canvHeight/cellCount, canvWidth/cellCount, canvHeight/cellCount);

				//circle grid
				canvasCtx.beginPath();
				canvasCtx.arc((j * canvWidth/cellCount)+canvWidth/cellCount/2, (i * canvHeight/cellCount)+canvHeight/cellCount/2,
								((canvWidth+canvHeight)/2)/cellCount/4, 0, Math.PI * 2, true);
				canvasCtx.fill();
			};
		};		
	}

	function drawCircles(){

		var circleCount = 10;
		var circleRadScale = (canvWidth > canvHeight ? canvHeight : canvWidth)/circleCount/2;
		console.log(circleRadScale);

		for (var i = 0; i < circleCount; i++) {
			canvasCtx.beginPath();
			canvasCtx.fillStyle = 'hsl(' + Math.floor((360/circleCount)*(i*2)) + ',50%, 70%)';
			canvasCtx.globalAlpha = 1/i*2;
			console.log(canvasCtx.globalAlpha);
			canvasCtx.arc(canvWidth/2, canvHeight/2, circleRadScale*i,0, Math.PI*2, true);
			canvasCtx.fill();
		};
	}

	function drawLines(){

		var lineCount = 20;

		for (var i = 1; i < lineCount; i++) {
			
			canvasCtx.strokeStyle = 'hsl(' + Math.floor((360/lineCount)*(i*2)) + ',80%, 70%)';

			canvasCtx.lineWidth = (canvWidth/lineCount)/i;
			console.log(canvasCtx.lineWidth);
			canvasCtx.beginPath();

			canvasCtx.moveTo(canvWidth/lineCount * i, 0);
			canvasCtx.lineTo(canvWidth/lineCount * i, canvHeight);

			canvasCtx.stroke();
		};
	}

	function drawGradient(){

		drawVisual = requestAnimationFrame(drawGradient);
		analyser.getByteFrequencyData(dataArray); //whats diff between getByteTimeDomainData and this?
		var colourStops = 5;

		var gradMode;
		var grad;

		if (gradMode == 'linear'){
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

			// console.log('dataArray: ' + dataArray[i]);
			// console.log('dataArray Length: ' + dataArray[i].length);
			// console.log('bufferLength: ' + bufferLength);
		}

		canvasCtx.fillStyle = grad;
		canvasCtx.fillRect(0,0,canvWidth, canvHeight);
	}

	// drawGradient();

	function drawPattern(){

		var img = new Image();
		img.src = 'http://pngimg.com/uploads/palm_tree/palm_tree_PNG2494.png';
		
		

		img.onload = function(){
			draw();
		}

		function draw(){
			drawVisual = requestAnimationFrame(draw);
			analyser.getByteFrequencyData(dataArray);
			
			for(var i = 0; i < bufferLength; i+=50) {

				var da = dataArray[i]; //temp max of 200
				console.log(da);
				var tileCount;
				if (da !== 0){
					if (da == 1){
						da = 2;
					}
					if(da < 10){
						tileCount = da;
					}
					else if (da > 30){
						tileCount = da/10;
					}
				}
				// if(tileCount < 4){
				// 	tileCount = 4;
				// }else if(tileCount > 30){
				// 	tileCount = 30;
				// }
				canvasCtx.clearRect(0,0,canvWidth, canvHeight);
				tileImg(tileCount);
			}
			function tileImg(tileCount){
				for (var i = 0; i < tileCount; i++) {
					for (var j = 0; j < tileCount; j++){
											
						var imgWidth = canvWidth/tileCount;
						var imgHeight = canvHeight/tileCount;

						canvasCtx.drawImage(img, imgWidth*i, imgHeight*j, imgWidth, imgHeight);
					}
				}
			}
		}
	}
	drawPattern();

	function drawTransGrid(){

		var cellCount = 5;

		for (var i = 0; i < cellCount; i++) {
			for (var j = 0; j < cellCount; j++) {
				
				canvasCtx.save();
				canvasCtx.fillStyle = 'hsl(' + (360/cellCount)*((i+j)/2) + ', 70%, 70%)';
				canvasCtx.translate((canvWidth/cellCount)*i, (canvHeight/cellCount)*j);
				canvasCtx.fillRect(0,0,canvWidth/cellCount -30, canvHeight/cellCount -30);
				canvasCtx.restore();
			};
		};
	}

	function drawSpiralMatrixTest(){

		var sin = Math.sin(Math.PI/6);
		var cos = Math.cos(Math.PI/6);
		var sectionLength = (canvWidth > canvHeight ? canvHeight : canvWidth)/4;
		var sectionWidth = sectionLength/5;

		canvasCtx.translate(canvWidth/2, canvHeight/2);
		var c = 0;
		var count = 12;
		for (var i = 0; i <= count; i++) {
			c = Math.floor(255 /count *i);
			canvasCtx.fillStyle = 'hsl('+ (360/count)*i + ', 70%, 70%)';
			canvasCtx.fillRect(100,0, sectionLength, sectionWidth);
			canvasCtx.transform(cos, sin, -sin, cos, 0, 0);
		}
	}

	function animEarthExample(){
		var sun = new Image();
		var earth = new Image();
		var moon = new Image();

		function init(){
			sun.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
			earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';
			moon.src = 'https://mdn.mozillademos.org/files/1443/Canvas_moon.png';
			window.requestAnimationFrame(draw);
		}

		function draw(){
			canvasCtx.globalCompositeOperation = 'destination-over';
			canvasCtx.clearRect(0,0,canvWidth, canvHeight);

			canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.4)'; //'rgba(0, 0, 0, 0.4)'
			canvasCtx.strokeStyle = 'rgba(0,153,255,0.4)';
			canvasCtx.save();
			canvasCtx.translate(150,150);

			//Earth
			var time = new Date();
			canvasCtx.rotate(((2 * Math.PI) / 60) * time.getSeconds() + ((2 * Math.PI) / 60000) * time.getMilliseconds());
			canvasCtx.translate(105, 0);
			canvasCtx.fillRect(0, -12, 50, 24);
			canvasCtx.drawImage(earth, -12, -12);

			//Moons
			canvasCtx.save();
			canvasCtx.rotate(((2 * Math.PI) / 6) * time.getSeconds() + ((2 * Math.PI) / 6000) * time.getMilliseconds());
			canvasCtx.translate(0, 28.5);
			canvasCtx.drawImage(moon, -3.5, -3.5);
			canvasCtx.restore();

			canvasCtx.restore();

			canvasCtx.beginPath();
			canvasCtx.arc(150, 150, 105, 0, Math.PI * 2, false);
			canvasCtx.stroke();

			canvasCtx.drawImage(sun, 0, 0, 300, 300);

			window.requestAnimationFrame(draw);
		}

		init();
	}

	function animBallExample(){

		var ball = {

			x : 100,
			y : 100,
			radius : 25,
			colour : 'blue',
			draw : function(){
				canvasCtx.beginPath();
				canvasCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
				canvasCtx.closePath();
				canvasCtx.fillStyle = this.colour;
				canvasCtx.fill();
			}
		};

		ball.draw();
	}

	// drawRect();
	// drawTriangle();
	// drawSmiley();
	// drawPath();	
	// drawGrid();
	// drawCircles();
	// drawLines();
	
	// drawPattern();
	// drawTransGrid();
	// drawRotateTest();
	// drawSpiralMatrixTest();
	// animEarthExample();


}


$(window).resize(function(){
	canvas.width = $(window).width();
	canvas.height = $(window).height();
	canvWidth = canvas.width;
	canvHeight = canvas.height;
});
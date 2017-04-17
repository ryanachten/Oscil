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
var smoothingRange = document.getElementById("smoothing-input");
var visualisationMode = document.querySelector('#visual-select');
fftInput.onchange = function(){
	visualise(visualisationMode.value);
}


smoothingRange.onchange = function(){
	console.log("val: " + smoothingRange.value);
	analyser.smoothingTimeConstant = smoothingRange.value/10;
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

	// canvasCtx.clearRect(0,0,canvWidth, canvHeight);
	// canvasCtx.fillStyle = bgColor;
	// canvasCtx.fillRect(0,0,canvWidth, canvHeight);

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
		shapes();
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

	// analyser.fftSize = 256;

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
        // console.log('barHeight: ' + barHeight);

        canvasCtx.fillStyle = 'hsl('+ barHeight +',50%,70%)';
        // console.log('rgb(' + (barHeight+100) + ',' + (barHeight+100) + ',50)');
        canvasCtx.fillRect(x,y,barWidth,barHeight);

        x += barWidth;
      }
    };

    draw();
}


//Waveform/oscilloscope
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


function shapes(){
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

		canvasCtx.fillStyle =  "black";	
		canvasCtx.arc(originX, originY, outerRadius, 0, Math.PI * 2, true); //outer circle
		canvasCtx.moveTo(originX-mouthLength, originY+mouthHeight); //left point of mouth
		canvasCtx.arc(originX, originY+mouthHeight, mouthLength, 0, Math.PI, false); //right point of mouth
		canvasCtx.moveTo((originX+eyeRadius/2)-eyeRadius, originY-eyeRadius);
		canvasCtx.arc((originX-eyeRadius/2)-eyeRadius, originY-eyeRadius, eyeRadius, 0, Math.PI * 2, true); //left eye
		canvasCtx.moveTo((originX+eyeRadius/2)+eyeRadius*2, originY-eyeRadius);
		canvasCtx.arc((originX-eyeRadius/2)+eyeRadius*2, originY-eyeRadius, eyeRadius, 0, Math.PI * 2, true); //left eye

		canvasCtx.stroke();
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

		var colourStops = 5;

		//Linear
		// var grad = canvasCtx.createLinearGradient(0,0, canvWidth, canvHeight);

		//Radial
		var grad = canvasCtx.createRadialGradient(canvWidth/2,canvHeight/2, 0, //inner circle
													canvWidth/2, canvHeight/2,(canvWidth > canvHeight ? canvHeight : canvWidth)/2);	//outer circle
		
		for (var i = 1; i < colourStops; i++) {
			grad.addColorStop(1/i,'hsl(' + Math.floor((360/colourStops)*i) + ',80%, 70%)');
		};

		canvasCtx.fillStyle = grad;
		canvasCtx.fillRect(0,0,canvWidth, canvHeight);
		
	}

	// drawRect();
	// drawTriangle();
	// drawSmiley();
	// drawPath();	
	// drawGrid();
	// drawCircles();
	// drawLines();
	drawGradient();

}

visualisationMode.onchange = function(){
	window.cancelAnimationFrame(drawVisual);
	visualise(visualisationMode.value);
}





$(window).resize(function(){
	canvas.width = $(window).width();
	canvas.height = $(window).height();
	canvWidth = canvas.width;
	canvHeight = canvas.height;
});
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
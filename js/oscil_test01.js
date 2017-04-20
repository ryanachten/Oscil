/*
Resources:
	mdn/voice-change-o-matic
	https://github.com/mdn/voice-change-o-matic/blob/gh-pages/scripts/app.js
*/

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();


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
	analyser.smoothingTimeConstant = smoothingRange.value/10;
}

var visualisationMode = document.querySelector('#visual-select');


//Canvas Setup
var bgColor = 'rgb(237, 230, 224)';
var canvas = document.querySelector("#visualiser");
	
if(canvas.getContext){
	canvas.width = $(window).width();
	canvas.height = $(window).height();
	var canvWidth = canvas.width;
	var canvHeight = canvas.height;
	var canvasCtx = canvas.getContext('2d');
	
	var drawVisual; //

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
		barHeight = dataArray[i]*3;

		var y = canvHeight/2-barHeight/2;

		canvasCtx.fillStyle = 'hsl('+ barHeight +',50%,70%)';
		canvasCtx.fillRect(x,y,barWidth,barHeight);

		x += barWidth;
	  }
	};

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
$(document).foundation();

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();


//Smoothing / calibration settings - these should all be sliders

var fftInput = document.getElementById("fft-input");
fftInput.onchange = function(){
	window.cancelAnimationFrame(drawVisual);
	visualise(visualisationMode.value);
}

var minDb = document.getElementById("min-db-input");
minDb.onchange = function(){
	analyser.minDecibels = minDb.value;
}
var maxDb = document.getElementById("max-db-input");
maxDb.onchange = function(){
	analyser.maxDecibels = maxDb.value;
}


var smoothingRange = document.getElementById("smoothing-input");
smoothingRange.onchange = function(){
	// console.log("val: " + smoothingRange.value);
	analyser.smoothingTimeConstant = smoothingRange.value/100;
}

function removeVisualSettings(){
	var visSettings	= document.getElementsByClassName('vis-setting');
	if(visSettings.length == 0){
		return;
	}
	$('.vis-setting').remove();
}

var visualisationMode = document.querySelector('#visual-select');
visualisationMode.onchange = function(){
	window.cancelAnimationFrame(drawVisual);
	drawVisual = undefined;
	
	removeVisualSettings();
	document.getElementById('vis-settings').style.display = 'none';
	
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
	var canvasCtx = canvas.getContext('2d');
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
	else if(visMode === 'Refract'){
		refract(dataArray, bufferLength);
	}
	else if(visMode === 'Gradient'){
		gradient(dataArray, bufferLength);
	}
	else if(visMode === 'PolyShapes'){
		polyShapes(dataArray, bufferLength);
	}
	else if(visMode === 'Particles'){
		particles(dataArray, bufferLength);
	}
	else if(visMode === 'Macroblocks'){
		macroblocks(dataArray, bufferLength);
	}
	else if(visMode === 'RepeatPix'){
		repeatPix(dataArray, bufferLength);
	}
	else if(visMode === 'PixMix'){
		pixMix(dataArray, bufferLength);
	}
	else if(visMode === 'PixShuffle'){
		pixShuffle(dataArray, bufferLength);
	}
	else if(visMode === 'DumbAgents'){
		dumbAgents(dataArray, bufferLength);
	}
	else if(visMode === 'ShapeAgents'){
		shapeAgents(dataArray, bufferLength);
	}
	else if(visMode === 'BrownianTree'){
		brownianTree(dataArray, bufferLength);
	}
	else if(visMode === 'ConcretePoetry'){
		concretePoetry(dataArray, bufferLength);
	}
	else if(visMode === 'Test'){
		tests(dataArray, bufferLength); //
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



$(window).resize(function(){
	canvas.width = $(window).width();
	canvas.height = $(window).height();
	canvWidth = canvas.width;
	canvHeight = canvas.height;
});
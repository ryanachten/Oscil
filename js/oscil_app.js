var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();

var audioGui = new dat.GUI({ autoPlace: false });
audioGui.domElement.id = 'audiodat-gui';
$('#audio-options').append(audioGui.domElement);
var audioGuiSettings = {
	fftsize : 256,
	minDb : -100,
	maxDb : 20,
	smoothing : 80
};
audioGui.add(audioGuiSettings, 'fftsize', [256]).onChange(
	function(){
		window.cancelAnimationFrame(drawVisual);
		visualise(visualisationMode.value);
	});
audioGui.add(audioGuiSettings, 'minDb').min(-150).max(-50).onChange(
	function(){
		analyser.minDecibels = audioGuiSettings.minDb;
	});
audioGui.add(audioGuiSettings, 'maxDb').min(-80).max(20).onChange(
	function(){
		analyser.maxDecibels = audioGuiSettings.maxDb;
	});
audioGui.add(audioGuiSettings, 'smoothing').min(0).max(100).onChange(
	function(){
		analyser.smoothingTimeConstant = audioGuiSettings.smoothing/100;
	});


var visualisationMode = document.querySelector('#visual-select');
visualisationMode.onchange = function(){
	window.cancelAnimationFrame(drawVisual);
	drawVisual = undefined;

	$('#visdat-gui').remove();

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

	var dataBuffer = getBuffer(audioGuiSettings.fftsize);
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
	else if(visMode === 'ImgShuffle'){
		imgShuffle(dataArray, bufferLength);
	}
	else if(visMode === 'PixelPainting'){
		pixelPainting(dataArray, bufferLength);
	}
	else if(visMode === 'LissajousFigure'){
		lissajousFigure(dataArray, bufferLength);
	}
	else if(visMode === 'LissajousWebs'){
		lissajousWebs(dataArray, bufferLength);
	}
	else if(visMode === 'NodeAttraction'){
		nodeAttraction(dataArray, bufferLength);
	}
	else if(visMode === 'ChladniPlate'){
		chladniPlate(dataArray, bufferLength);
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

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

$('.visual-type-toggle').click(function(e){
	$('.visual-type-toggle.active').removeClass('active');
	$('.visual-selection.active').removeClass('active');
	$(this).addClass('active');
	switch ($(this).data('type')) {
		case 'shape':
			$('#shape-visuals').addClass('active');
			break;
		case 'image':
			$('#image-visuals').addClass('active');
			break;
		case 'video':
			$('#video-visuals').addClass('active');
			break;
		case 'threed':
			$('#threed-visuals').addClass('active');
			break;
		default:
			$('#shape-visuals').addClass('active');
	}});

// Visual thumbnail event
$('.visual-mode').click(function(){
	window.cancelAnimationFrame(drawVisual);
	drawVisual = undefined;
	$('#visdat-gui').remove();
	$('.visual-mode.active').removeClass('active');
	$(this).addClass('active');
	visualise( $(this).data('visual') );
});

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

			visualise( $('.visual-mode.active').data('visual') );
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
	switch (visMode) {

		// Shape Visuals
		case 'BarGraph' : barGraph(dataArray, bufferLength); break;
		case 'WaveForm' : waveForm(dataArray, bufferLength); break;
		case 'Refract' : refract(dataArray, bufferLength); break;
		case 'Gradient' : gradient(dataArray, bufferLength); break;
		case 'PolyShapes' : polyShapes(dataArray, bufferLength); break;
		case 'ShapeAgents' : shapeAgents(dataArray, bufferLength); break;
		case 'BrownianTree' : brownianTree(dataArray, bufferLength); break;
		case 'Particles' : particles(dataArray, bufferLength); break;
		case 'ConcretePoetry' : concretePoetry(dataArray, bufferLength); break;
		case 'LissajousFigure' : lissajousFigure(dataArray, bufferLength); break;
		case 'LissajousWebs' : lissajousWebs(dataArray, bufferLength); break;
		case 'NodeAttraction' : nodeAttraction(dataArray, bufferLength); break;
		case 'ChladniPlate' : chladniPlate(dataArray, bufferLength); break;
		case 'FractalTree' : fractalTree(dataArray, bufferLength); break;
		case 'Lsystem' : lSystem(dataArray, bufferLength); break;
		case 'Julia8bit' : julia8bit(dataArray, bufferLength); break;

		// Image Visuals
		case 'Macroblocks' : macroblocks(dataArray, bufferLength); break;
		case 'RepeatPix' : repeatPix(dataArray, bufferLength); break;
		case 'PixMix' : pixMix(dataArray, bufferLength); break;
		case 'PixShuffle' : pixShuffle(dataArray, bufferLength); break;
		case 'ImgShuffle' : imgShuffle(dataArray, bufferLength); break;
		case 'PixelPainting' : pixelPainting(dataArray, bufferLength); break;

		// Video Visuals
		case 'DrosteVideo' : drosteVideo(dataArray, bufferLength); break;
		case 'Muybridge' : muybridge(dataArray, bufferLength); break;
		case 'RippleTank' : rippleTank(dataArray, bufferLength); break;
		case 'Tesserae' : tesserae(dataArray, bufferLength); break;
		case 'ParticlePainting' : particlePainting(dataArray, bufferLength);
		case 'SlitScan' : slitScan(dataArray, bufferLength); break;

		// 3D Visuals
		case 'ThreedTest' : threedTest(dataArray, bufferLength); break;
		case 'MengerSponge' : mengerSponge(dataArray, bufferLength); break;
		case 'SuperShapes' : superShapes(dataArray, bufferLength); break;
		case 'TerrainGen' : terrainGen(dataArray, bufferLength); break;

		// Utilities
		case 'Test' : tests(dataArray, bufferLength); break;
		case 'Off' : visOff(dataArray, bufferLength); break;
		default:

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

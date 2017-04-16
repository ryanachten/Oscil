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
var smoothingRange = document.getElementById("smoothing-input");
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

	var visualisationMode = document.querySelector('#visual-select');
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


function visualise(visMode){
	console.log(visMode);
	if(visMode === 'BarGraph'){
		barGraph(); 
	}
	else if(visMode === 'WaveForm'){
		waveForm();
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

function barGraph(){
	analyser.fftSize = 256;
    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);
    var dataArray = new Uint8Array(bufferLength);

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

        canvasCtx.fillStyle = 'hsl('+ barHeight +',80%,70%)';
        // console.log('rgb(' + (barHeight+100) + ',' + (barHeight+100) + ',50)');
        canvasCtx.fillRect(x,y,barWidth,barHeight);

        x += barWidth;
      }
    };

    draw();
}


//Waveform/oscilloscope
function waveForm(){

	analyser.fftSize = 1024; //defines Fast Fourier Transform rate 
	var bufferLength = analyser.frequencyBinCount; // length of freqBinCount is half the fft
	var dataArray = new Uint8Array(bufferLength); //defines how many datapoints collecting for that fft size

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

		var originX = canvWidth/2;
		var originY = canvHeight/2;
		var fillRectWidth = canvWidth/2; var fillRectHeight = canvHeight/2;
		var clearRectWidth = canvWidth/4; var clearRectHeight = canvHeight/4;
		var strokeRectWidth = canvWidth/8; var strokeRectHeight = canvHeight/8;

		canvasCtx.fillRect(originX-fillRectWidth/2, originY-fillRectHeight/2, fillRectWidth, fillRectHeight);
		canvasCtx.clearRect(originX-clearRectWidth/2, originY-clearRectHeight/2, clearRectWidth, clearRectHeight);
		canvasCtx.strokeRect(originX-strokeRectWidth/2, originY-strokeRectHeight/2, strokeRectWidth, strokeRectHeight);
	}
	
	function drawTriangle(){
		canvasCtx.fillStyle =  "black";

		var originX = canvWidth/2;
		var originY = canvHeight/2;
		var radiusX = canvWidth/4;
		var radiusY = canvHeight/4;
		canvasCtx.beginPath();
		canvasCtx.moveTo(originX, originY-radiusY); //top corner
		canvasCtx.lineTo(originX+radiusX, originY+radiusY); //right
		canvasCtx.lineTo(originX-radiusX, originY+radiusY); //left corner
		canvasCtx.fill();
	}

	function drawSmiley(){
		
		canvasCtx.fillStyle =  "black";	

		var originX = canvWidth/2;
		var originY = canvHeight/2;
		var outerRadius = canvWidth/4;
		var mouthLength = outerRadius/2;
		var mouthHeight = outerRadius/4;
		var eyeRadius = outerRadius/4;

		canvasCtx.arc(originX, originY, outerRadius, 0, Math.PI * 2, true); //outer circle
		canvasCtx.moveTo(originX-mouthLength, originY+mouthHeight); //left point of mouth
		canvasCtx.arc(originX, originY+mouthHeight, mouthLength, 0, Math.PI, false); //right point of mouth
		canvasCtx.moveTo((originX+eyeRadius/2)-eyeRadius, originY-eyeRadius);
		canvasCtx.arc((originX-eyeRadius/2)-eyeRadius, originY-eyeRadius, eyeRadius, 0, Math.PI * 2, true); //left eye
		canvasCtx.moveTo((originX+eyeRadius/2)+eyeRadius*2, originY-eyeRadius);
		canvasCtx.arc((originX-eyeRadius/2)+eyeRadius*2, originY-eyeRadius, eyeRadius, 0, Math.PI * 2, true); //left eye

		canvasCtx.stroke();
	}

	// drawRect();
	// drawTriangle();
	drawSmiley();

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
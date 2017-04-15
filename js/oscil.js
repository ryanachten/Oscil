var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();

//Microphone access
navigator.getUserMedia (
	{
		audio: true
	},
	function(stream) {
		source = audioCtx.createMediaStreamSource(stream);
		source.connect(analyser);
	  },

	function(err) {
		console.log('The following gUM error occured: ' + err);
	}
);

//Canvas Setup
var bgColor = 'rgb(237, 230, 224)';
var canvas = document.querySelector("#visualiser");
	canvas.width = $(window).width();
	canvas.height = $(window).height();
var canvWidth = canvas.width;
var canvHeight = canvas.height;
var canvasCtx = canvas.getContext('2d'); //wonder what this does?
canvasCtx.fillStyle = bgColor;
canvasCtx.fillRect(0,0, canvWidth, canvHeight);

function barGraph(active){
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
        barHeight = dataArray[i]*2;

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
function waveForm(active){

	console.log(active);

	// if(active === true){
		analyser.fftSize = 2048; //defines Fast Fourier Transform rate 
		var bufferLength = analyser.frequencyBinCount; // length of freqBinCount is half the fft
		var dataArray = new Uint8Array(bufferLength); //defines how many datapoints collecting for that fft size

		canvasCtx.clearRect(0,0,canvWidth,canvHeight); //reset canvas for new vis

		var drawVisual;

		function draw(){
			drawVisual = requestAnimationFrame(draw); //this keeps looping the drawing function once it has started
			analyser.getByteTimeDomainData(dataArray); //retrieve the data and copy it into our array
			canvasCtx.fillStyle = bgColor;
			canvasCtx.fillRect(0,0, canvWidth, canvHeight);

			//line width and color
			canvasCtx.lineWidth = 1;
				canvasCtx.strokeStyle = 'rgb(0,0,0)';
				canvasCtx.beginPath();

			//width of ea. segment = canv.w / arraylength
			var sliceWidth = canvWidth * 1.0 / bufferLength;
				var x = 0; //position to move to to draw ea. line segment

			for(var i=0; i <bufferLength; i++){
				var v = dataArray[i] / 128.0; //128.0 height based on the data point value form the array
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
		if(active === true){
			draw();
		}	
		else{
			console.log('clear');
			// drawVisual = requestAnimationFrame(draw);
			cancelAnimationFrame(drawVisual);
			canvasCtx.clearRect(0,0,canvWidth,canvHeight);
		}	
}

// var waveToggle = false;
// $('#waveform-button').click(function(){
// 	if(waveToggle){
// 		waveForm(false);
// 		console.log("waveForm(false);");
// 		waveToggle = false;
// 	}else{
// 		waveForm(true);
// 		console.log("waveForm(true);");
// 		waveToggle = true;
// 	}

// });
// waveForm(true);
barGraph(true);
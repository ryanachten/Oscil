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

	canvasCtx.clearRect(0,0,canvWidth,canvHeight);
	
	function draw(){
		drawVisual = requestAnimationFrame(draw);
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

	draw();
}

function particles(dataArray, bufferLength){

		canvasCtx.globalCompositeOperation = 'source-over';

		var particleCount = 30;
		var particles = [];
		var partCounter = 0;
		for (var i = 0; i < particleCount; i++) {
			particles.push(new create_particle());
			partCounter++;
			console.log('partCounter: ' + partCounter);
		};

		function create_particle(){

			var partMaxSize = 50;
			var partMinSize = 10;
			this.radius = Math.random()*(partMaxSize-partMinSize);
			this.hue = 360/particleCount * (Math.random()*(particleCount-1));
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

				for (var j = 0; j < particleCount; j++) {
				
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
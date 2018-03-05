var visGuiSettings = {
  showRandNode : {
    active: true,
    requiresInitOnChange: true
  },
  maxRadius : {
    active: 30,
    min: 0,
    max: 20,
    requiresInitOnChange: true
  }
};

function brownianTree(dataArray, bufferLength){


		var currentCount;
		var x, y, r;
		var maxRad;
		var showRandomSeeds;

		function init(){

			canvasCtx.clearRect(0,0,canvWidth,canvHeight);
			canvasCtx.fillStyle = bgColor;
			canvasCtx.fillRect(0,0,canvWidth,canvHeight);

			currentCount = 1;
			x = [];
			y = [];
			r = []; //radius
			maxRad = visGuiSettings.maxRadius;
			showRandomSeeds = visGuiSettings.showRandNode;

			x[0] = Math.random()*canvWidth;
			y[0] = Math.random()*canvHeight;
			r[0] = (Math.random()*maxRad)+1;
		}
		init();

		function draw(){

			//random params
			var newR = (Math.random()*maxRad)+1;
			var newX = (Math.random()*canvWidth-newR)+(0+newR);
			var newY = (Math.random()*canvHeight-newR)+(0+newR);
			var closestDist = 100000000;
			var closestIndex = 0;

			//find closest circle
			for(var i = 0; i < currentCount; i++){
				var newDist = Math.sqrt(Math.pow(newX-x[i],2)+Math.pow(newY-y[i],2));
				if(newDist < closestDist){
					closestDist = newDist;
					closestIndex = i;
				}
			}

			if(showRandomSeeds){
				canvasCtx.beginPath();
				canvasCtx.moveTo(newX, newY);
				canvasCtx.arc(newX, newY, newR, 0, Math.PI*2);
				canvasCtx.fillStyle = 'black';
				canvasCtx.fill();
				canvasCtx.moveTo(newX, newY);
				canvasCtx.lineTo(x[closestIndex], y[closestIndex]);
				canvasCtx.lineWidth = 1;
				canvasCtx.strokeStyle = 'black';
				canvasCtx.stroke();
				canvasCtx.closePath();
			}


			//align to closest circle
			var angle = Math.atan2(newY-y[closestIndex], newX-x[closestIndex]);

			x[currentCount] = x[closestIndex] + Math.cos(angle) * (r[closestIndex]+newR);
			y[currentCount] = y[closestIndex] + Math.sin(angle) * (r[closestIndex]+newR);
			r[currentCount] = newR;
			canvasCtx.beginPath();
			canvasCtx.moveTo(x[currentCount], y[currentCount]);
			canvasCtx.arc(x[currentCount], y[currentCount], r[currentCount]*2, 0, Math.PI*2);
			canvasCtx.fillStyle = 'black';
			canvasCtx.fill();
			canvasCtx.closePath();

			currentCount++;
		}

		var stop = false;
		var frameCount = 0;
		var fps, fpsInterval, startTime, now, then, elapsed;
		var logda;

		function startAnimating(){
			then = Date.now();
			startTime = then;
			animate();
		}

		function animate(fps){

			for(var i = 0; i < bufferLength; i+=30) {

				analyser.getByteFrequencyData(dataArray);
				var da = dataArray[i];

				if (da !== 0){
					logda = Math.floor(Math.log(da) / Math.log(1.2))+3;
					// console.log(logda);
				}
			}

			fps = logda;
			fpsInterval = 1000/fps;

			if(stop){
				return;
			}
			drawVisual = requestAnimationFrame(animate);

			now = Date.now();
			elapsed = now - then;

			if(elapsed > fpsInterval){
				then = now - (elapsed % fpsInterval);
				// console.log('fps: ' + fps);
				draw();
			}
		}


		startAnimating();
}

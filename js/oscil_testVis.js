function tests(dataArray, bufferLength){

	console.log('Testing');

	canvasCtx.clearRect(0,0,canvWidth, canvHeight);
	canvasCtx.fillStyle = bgColor;
	canvasCtx.fillRect(0,0,canvWidth, canvHeight);


	function structuralAgents(){

		var maxCount = 5000;
		var currentCount = 1;
		var x = [];
		var y = [];
		var r = []; //radius
		var closestIndex = [maxCount];
		var minRadius = 5;
		var maxRadius = 50;

		function init(){

			x[0] = Math.random()*canvWidth;
			y[0] = Math.random()*canvHeight;
			r[0] = (Math.random()*maxRadius)+1;
			closestIndex[0] = 0;
		}
		init();

		function draw(){

			console.log('currentCount: ' + currentCount);

			//create random pos
			var newX = (Math.random()*(canvWidth-maxRadius)+(maxRadius));
			var newY = (Math.random()*(canvHeight-maxRadius)+(maxRadius));
			var newR = minRadius;

			var intersection = false;

			//check if new circle intersects w/ another
			for(var i=0; i < currentCount; i++){
				var d = Math.sqrt(Math.pow(newX-x[i],2)+Math.pow(newY-y[i],2));
				console.log('d: ' + d);
				if(d < (newR + r[i])){
					console.log('intersection');
					intersection = true;
					break; //check usage - should be fine
				}
			}

			if(!intersection){
				//get closest neighbour and closest radius
				var newRadius = canvWidth;
				for(var i=0; i < currentCount; i++){
					var d = Math.sqrt(Math.pow(newX-x[i],2)+Math.pow(newY-y[i],2));
					console.log('newRadius > : ' + newRadius);
					if(newRadius > d-r[i]){
						// console.log('newRadius > : ' + newRadius);
						newRadius = d-r[i];
						// console.log('d-r[i] : ' + (d-r[i]));
						closestIndex[currentCount] = i;
					}
				}
				if(newRadius > maxRadius) newRadius = maxRadius;

				x[currentCount] = newX;
				y[currentCount] = newY;
				r[currentCount] = newRadius;

				canvasCtx.beginPath();
				console.log('draw');
				canvasCtx.arc(x[currentCount], y[currentCount], r[currentCount]*2, 0, Math.PI*2);
				canvasCtx.strokeStyle = 'black';
				canvasCtx.stroke();
				canvasCtx.closePath();

				currentCount++;
			}

			
		}

		var stop = false;
		var frameCount = 0;
		var fps, fpsInterval, startTime, now, then, elapsed;

		function startAnimating(fps){
			fpsInterval = 1000/fps;
			then = Date.now();
			startTime = then;
			animate();
		}

		function animate(){

			if(stop){
				return;
			}
			drawVisual = requestAnimationFrame(animate);

			now = Date.now();
			elapsed = now - then;

			if(elapsed > fpsInterval){
				then = now - (elapsed % fpsInterval);

				draw();
			}
		}
		startAnimating(1);	
	}
	// structuralAgents();
}
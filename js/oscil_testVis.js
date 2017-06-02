function tests(dataArray, bufferLength){

	console.log('Testing');

	canvasCtx.clearRect(0,0,canvWidth, canvHeight);
	canvasCtx.fillStyle = bgColor;
	canvasCtx.fillRect(0,0,canvWidth, canvHeight);


	function brownianTree(){

		var maxCount = 5000;
		var currentCount = 1;
		var x = [];
		var y = [];
		var r = []; //radius
		var maxRad = 5;
		var showRandomSeeds = true;

		function init(){

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

			//TODO: add random line and pos
			if(showRandomSeeds){
				canvasCtx.beginPath();
				canvasCtx.moveTo(newX, newY);
				canvasCtx.arc(newX, newY, newR, 0, Math.PI*2);
				canvasCtx.fillStyle = 'black';
				canvasCtx.fill();
				canvasCtx.moveTo(newX, newY);
				canvasCtx.lineTo(x[closestIndex], y[closestIndex]);
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
			// console.log('currentCount: ' + currentCount);
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
		startAnimating(30);	
	}
	
	brownianTree();

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
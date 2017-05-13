function tests(dataArray, bufferLength){

	console.log('Testing');

	canvasCtx.clearRect(0,0,canvWidth, canvHeight);
	canvasCtx.fillStyle = bgColor;
	canvasCtx.fillRect(0,0,canvWidth, canvHeight);

	function drawRect(){
		canvasCtx.fillStyle =  "black";

		var originX = canvWidth/2; var originY = canvHeight/2;
		var fillRectWidth = canvWidth/2; var fillRectHeight = canvHeight/2;
		var clearRectWidth = canvWidth/4; var clearRectHeight = canvHeight/4;
		var strokeRectWidth = canvWidth/8; var strokeRectHeight = canvHeight/8;

		canvasCtx.fillRect(originX-fillRectWidth/2, originY-fillRectHeight/2, fillRectWidth, fillRectHeight);
		canvasCtx.clearRect(originX-clearRectWidth/2, originY-clearRectHeight/2, clearRectWidth, clearRectHeight);
		canvasCtx.strokeRect(originX-strokeRectWidth/2, originY-strokeRectHeight/2, strokeRectWidth, strokeRectHeight);
	}
	
	function drawTriangle(){

		console.log('drawTriangle');

		canvasCtx.fillStyle =  "black";

		var originX = canvWidth/2; var originY = canvHeight/2;
		var radiusX = canvWidth/4; var radiusY = canvHeight/4;

		canvasCtx.shadowOffsetX = canvWidth/8; canvasCtx.shadowOffsetY = canvHeight/8;
		canvasCtx.shadowBlur = 100;
		canvasCtx.shadowColor = 'rgba(0,0,0,0.5)';

		canvasCtx.beginPath();
		canvasCtx.moveTo(originX, originY-radiusY); //top corner
		canvasCtx.lineTo(originX+radiusX, originY+radiusY); //right
		canvasCtx.lineTo(originX-radiusX, originY+radiusY); //left corner
		canvasCtx.fill();
	}

	function drawSmiley(){

		var originX = canvWidth/2; var originY = canvHeight/2;
		var outerRadius = (canvWidth > canvHeight ? canvHeight : canvWidth)/3;
		var mouthLength = outerRadius/2; var mouthHeight = outerRadius/4;
		var eyeRadius = outerRadius/4;

		//Head
		var colourStops = 5;

		//Radial
		var grad = canvasCtx.createRadialGradient(canvWidth/2,canvHeight/2, 0, //inner circle - can move this later
													canvWidth/2, canvHeight/2,(canvWidth > canvHeight ? canvHeight : canvWidth)/2);	//outer circle

		for (var i = 1; i < colourStops; i++) {
			grad.addColorStop(1/i,'hsl(' + Math.floor((360/colourStops)*i) + ',80%, 70%)');
		};

		canvasCtx.fillStyle = grad;
		canvasCtx.beginPath();
		canvasCtx.arc(originX, originY, outerRadius, 0, Math.PI * 2, true); //outer circle
		canvasCtx.closePath();
		canvasCtx.fill();

		//Mouth
		canvasCtx.fillStyle = bgColor;
		canvasCtx.beginPath();
		canvasCtx.moveTo(originX-mouthLength, originY+mouthHeight); //left point of mouth
		canvasCtx.arc(originX, originY+mouthHeight, mouthLength, 0, Math.PI, false); //right point of mouth		
		canvasCtx.closePath();
		canvasCtx.fill();

		//Eyes
		canvasCtx.beginPath();
		canvasCtx.moveTo((originX+eyeRadius/2)-eyeRadius, originY-eyeRadius);
		canvasCtx.arc((originX-eyeRadius/2)-eyeRadius, originY-eyeRadius, eyeRadius, 0, Math.PI * 2, true); //left eye
		canvasCtx.closePath();
		canvasCtx.fill();

		canvasCtx.beginPath();
		canvasCtx.moveTo((originX+eyeRadius/2)+eyeRadius*2, originY-eyeRadius);
		canvasCtx.arc((originX-eyeRadius/2)+eyeRadius*2, originY-eyeRadius, eyeRadius, 0, Math.PI * 2, true); //left eye
		canvasCtx.closePath();
		canvasCtx.fill();		
	}

	function drawPath(){

		canvasCtx.fillStyle =  "black";	

		var p = new Path2D('M101.4 28.8c10.6 0 21.2 0 31.8 0 0.9 0 2.1-0.1 2.3 1 0.1 0.7-0.4 1.7-0.9 2.2 -8.1 8.1-16.2 16.1-24.4 24.1 -0.8 0.8-1.1 1.5-1.1 2.7 0.1 6 0 12 0.1 18 0 1.4-0.4 2.2-1.7 2.9 -3.7 2-7.2 4.1-10.9 6.2 -2 1.1-3 0.5-3-1.8 0-8.4 0-16.9 0-25.3 0-1.1-0.3-1.9-1.1-2.6 -8-7.8-16-15.7-23.9-23.6 -0.3-0.3-0.6-0.5-0.8-0.8 -0.3-0.6-0.8-1.5-0.6-1.9 0.3-0.5 1.2-1 1.8-1 5.6-0.1 11.2 0 16.9 0C91.1 28.8 96.3 28.8 101.4 28.8zM200 0H0v111.4h200V0z');
		canvasCtx.fill(p);
	}

	function drawGrid(){

		var cellCount = 20;

		for (var i = 0; i < cellCount; i++) {
			for (var j = 0; j < cellCount; j++) {
				canvasCtx.fillStyle = 'hsl(' + Math.floor(360/cellCount *(i+j)) + ',50%, 70%)';

				//square grid
				// canvasCtx.fillRect(j * canvWidth/cellCount, i * canvHeight/cellCount, canvWidth/cellCount, canvHeight/cellCount);

				//circle grid
				canvasCtx.beginPath();
				canvasCtx.arc((j * canvWidth/cellCount)+canvWidth/cellCount/2, (i * canvHeight/cellCount)+canvHeight/cellCount/2,
								((canvWidth+canvHeight)/2)/cellCount/4, 0, Math.PI * 2, true);
				canvasCtx.fill();
			};
		};		
	}

	function drawCircles(){

		var circleCount = 10;
		var circleRadScale = (canvWidth > canvHeight ? canvHeight : canvWidth)/circleCount/2;
		console.log(circleRadScale);

		for (var i = 0; i < circleCount; i++) {
			canvasCtx.beginPath();
			canvasCtx.fillStyle = 'hsl(' + Math.floor((360/circleCount)*(i*2)) + ',50%, 70%)';
			canvasCtx.globalAlpha = 1/i*2;
			console.log(canvasCtx.globalAlpha);
			canvasCtx.arc(canvWidth/2, canvHeight/2, circleRadScale*i,0, Math.PI*2, true);
			canvasCtx.fill();
		};
	}

	function drawLines(){

		var lineCount = 20;

		for (var i = 1; i < lineCount; i++) {
			
			canvasCtx.strokeStyle = 'hsl(' + Math.floor((360/lineCount)*(i*2)) + ',80%, 70%)';

			canvasCtx.lineWidth = (canvWidth/lineCount)/i;
			console.log(canvasCtx.lineWidth);
			canvasCtx.beginPath();

			canvasCtx.moveTo(canvWidth/lineCount * i, 0);
			canvasCtx.lineTo(canvWidth/lineCount * i, canvHeight);

			canvasCtx.stroke();
		};
	}

	function drawTransGrid(){

		var cellCount = 5;

		for (var i = 0; i < cellCount; i++) {
			for (var j = 0; j < cellCount; j++) {
				
				canvasCtx.save();
				canvasCtx.fillStyle = 'hsl(' + (360/cellCount)*((i+j)/2) + ', 70%, 70%)';
				canvasCtx.translate((canvWidth/cellCount)*i, (canvHeight/cellCount)*j);
				canvasCtx.fillRect(0,0,canvWidth/cellCount -30, canvHeight/cellCount -30);
				canvasCtx.restore();
			};
		};
	}

	function drawSpiralMatrixTest(){

		var sin = Math.sin(Math.PI/6);
		var cos = Math.cos(Math.PI/6);
		var sectionLength = (canvWidth > canvHeight ? canvHeight : canvWidth)/4;
		var sectionWidth = sectionLength/5;

		canvasCtx.translate(canvWidth/2, canvHeight/2);
		var c = 0;
		var count = 12;
		for (var i = 0; i <= count; i++) {
			c = Math.floor(255 /count *i);
			canvasCtx.fillStyle = 'hsl('+ (360/count)*i + ', 70%, 70%)';
			canvasCtx.fillRect(100,0, sectionLength, sectionWidth);
			canvasCtx.transform(cos, sin, -sin, cos, 0, 0);
		}
	}

	function animEarthExample(){
		var sun = new Image();
		var earth = new Image();
		var moon = new Image();

		function init(){
			sun.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
			earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';
			moon.src = 'https://mdn.mozillademos.org/files/1443/Canvas_moon.png';
			window.requestAnimationFrame(draw);
		}

		function draw(){
			canvasCtx.globalCompositeOperation = 'destination-over';
			canvasCtx.clearRect(0,0,canvWidth, canvHeight);

			canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.4)'; //'rgba(0, 0, 0, 0.4)'
			canvasCtx.strokeStyle = 'rgba(0,153,255,0.4)';
			canvasCtx.save();
			canvasCtx.translate(150,150);

			//Earth
			var time = new Date();
			canvasCtx.rotate(((2 * Math.PI) / 60) * time.getSeconds() + ((2 * Math.PI) / 60000) * time.getMilliseconds());
			canvasCtx.translate(105, 0);
			canvasCtx.fillRect(0, -12, 50, 24);
			canvasCtx.drawImage(earth, -12, -12);

			//Moons
			canvasCtx.save();
			canvasCtx.rotate(((2 * Math.PI) / 6) * time.getSeconds() + ((2 * Math.PI) / 6000) * time.getMilliseconds());
			canvasCtx.translate(0, 28.5);
			canvasCtx.drawImage(moon, -3.5, -3.5);
			canvasCtx.restore();

			canvasCtx.restore();

			canvasCtx.beginPath();
			canvasCtx.arc(150, 150, 105, 0, Math.PI * 2, false);
			canvasCtx.stroke();

			canvasCtx.drawImage(sun, 0, 0, 300, 300);

			window.requestAnimationFrame(draw);
		}

		init();
	}

	function animBallExample(){

		var raf;
		var running = false;

		var ball = {
			x : canvWidth/2,
			y : canvHeight/2,
			vx : 5,
			vy : 2,
			radius : 25,
			colour : 'blue',
			draw : function(){
				canvasCtx.beginPath();
				canvasCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
				canvasCtx.closePath();
				canvasCtx.fillStyle = this.colour;
				canvasCtx.fill();
			}
		};

		function clear(){
			canvasCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
			canvasCtx.fillRect(0,0, canvWidth, canvHeight);
		}

		function draw(){
			clear();
			ball.draw();
			ball.x += ball.vx;
			ball.y += ball.vy;
			//gravity
			// ball.vy *= .99; 
			// ball.vy += .25;

			//Boundaries
			if(ball.y + ball.vy > canvas.height || ball.y + ball.vy < 0){
				ball.vy = -ball.vy;
			}
			if(ball.x + ball.vx > canvas.width || ball.x + ball.vx < 0){
				ball.vx = -ball.vx;
			}

			raf = window.requestAnimationFrame(draw);
		}

		canvas.addEventListener('mousemove', function(e){
			console.log('move');
			if(!running){
				clear();
				ball.x = e.clientX;
				ball.y = e.clientY;
				ball.draw();
			}
		});

		canvas.addEventListener('click', function(e){
			console.log('click');
			if(!running){
				raf = window.requestAnimationFrame(draw);
				running = true;
			}
		});

		canvas.addEventListener('mouseout', function(e){
			console.log('out');
			window.cancelAnimationFrame(raf);
			running = false;
		});
		
		ball.draw();
	}

	function imgColorPick(){

		//Color Picker
		var img = new Image();
		img.src = 'https://upload.wikimedia.org/wikipedia/commons/4/44/Jelly_cc11.jpg' + '?' + new Date().getTime();
		img.setAttribute('crossOrigin', '');

		img.onload = function(){
			canvasCtx.drawImage(img, 0,0);
			img.style.display = 'none';
		};

		function pick(event){
			var x = event.layerX;
			var y = event.layerY;
			var pixel = canvasCtx.getImageData(x,y,1,1);
			var data = pixel.data;
			var rgba = 'rgba('+ data[0] + data[1] + data[2] + data[3] + ')';
			console.log(rgba);
		}
		canvas.addEventListener('mousemove', pick);
	}

	function imgGreyInvert(){
		//Invert and Greyscale
		var img = new Image();
		img.src = 'https://upload.wikimedia.org/wikipedia/commons/4/44/Jelly_cc11.jpg' + '?' + new Date().getTime();
		img.setAttribute('crossOrigin', '');
		img.onload = function(){
			draw(this);
		};

		function draw(img){
			canvasCtx.drawImage(img, 0,0 , canvWidth, canvWidth);
			img.style.display = 'none'
			var imgdata = canvasCtx.getImageData(0,0, canvWidth, canvHeight);
			var data = imgdata.data;

			var invert = function(){
				for (var i = 0; i < data.length; i+=4) {
					data[i] = 255 - data[i]; //r
					data[i+1] = 255 - data[i+1]; //g
					data[i+2] = 255 - data[i+2]; //b
				};
				canvasCtx.putImageData(imgdata, 0,0);
			};
			invert();

			var grayscale = function(){
				for (var i = 0; i < data.length; i+=4) {
					var avg = (data[i] + data[i+1] + data[i+3]) /3;

					data[i] = avg;
					data[i+1] = avg;
					data[i+2] = avg;
				};
				canvasCtx.putImageData(imgdata, 0,0);
			};
			grayscale();
		}
	}

	function imgZoomAlias(){

		var zoomCanvas = document.createElement('canvas');
		document.getElementById('container').appendChild(zoomCanvas);
		zoomCanvas.id = 'zoomCanvas'
		zoomCanvas.width = 200;
		zoomCanvas.height = 200;
		zoomCanvas.style.position = 'absolute';
		zoomCanvas.style.zIndex = 8;
		zoomCanvas.style.right = '100px';
		zoomCanvas.style.top = '100px';

		var zoomctx = zoomCanvas.getContext('2d');
		// zoomctx.fillStyle = 'black';
		// zoomctx.fillRect(0,0, zoomCanvas.width,zoomCanvas.height);

		var img = new Image();
		img.src = 'https://upload.wikimedia.org/wikipedia/commons/4/44/Jelly_cc11.jpg' + '?' + new Date().getTime();
		img.setAttribute('crossOrigin', '');
		img.onload = function(){
			draw(this);
		};

		function draw(){
			canvasCtx.drawImage(img, 0,0,canvWidth, canvHeight);
			img.style.display = 'none';

			function disableSmoothing(){
				zoomctx.imageSmoothingEnabled = false;
				zoomctx.mozImageSmoothingEnabled = false;
				zoomctx.webkitImageSmoothingEnabled = false;
				zoomctx.msImageSmoothingEnabled = false;
			}
			// disableSmoothing();

			var zoom = function(event){
				var x = event.layerX;
				var y = event.layerY;
				zoomctx.drawImage(canvas, Math.abs(x-5), Math.abs(y-5),
									10,10, 0,0, 200,200);
			};
			canvas.addEventListener('mousemove', zoom);
		}
	}

	function drawRegPoly(){

		function polygon(x, y, radius, sides, startAngle, anticlockwise, image){
		
			if (sides < 3) return;

			var a = (Math.PI * 2) / sides;
			a = anticlockwise ? -a : a;
			
			canvasCtx.save();
			canvasCtx.translate(x,y);
			canvasCtx.rotate(startAngle);
			
			var verticesCos = [];
			var verticesSin = [];
			for (var i = 0; i < sides; i++) {
				var point1 = radius*Math.cos(a*i);
				var point2 = radius*Math.sin(a*i);
				verticesCos.push(point1);
				verticesSin.push(point2);
			}
			for (var i = 0; i < verticesCos.length; i++) {
				canvasCtx.beginPath();
				canvasCtx.moveTo(verticesCos[i], verticesSin[i]);
				if(i === (verticesCos.length-1)){
					canvasCtx.lineTo(verticesCos[0], verticesSin[0]);
				}else{
					canvasCtx.lineTo(verticesCos[i+1], verticesSin[i+1]);
				}
				canvasCtx.lineTo(0,0);
				canvasCtx.closePath();
				canvasCtx.fillStyle = 'hsl('+ 360/verticesCos.length *i +',50%,70%)';
				canvasCtx.fill();
				
				//image placement
				canvasCtx.beginPath();

				//a (img axis)
				var imgX = (verticesCos[i] + verticesCos[i+1]) /2;
				var imgY = (verticesSin[i] + verticesSin[i+1]) /2;
				var aDist = Math.sqrt(Math.pow(imgX,2)+Math.pow(imgY,2));
				console.log('aDist: ' + aDist);

				// //c (hypotenuse)
				var cDist = Math.sqrt(Math.pow(verticesCos[i],2)+Math.pow(verticesSin[i],2));
				console.log('cDist: ' + cDist);

				//theta
				var theta = Math.acos(aDist/cDist);
				console.log('theta: ' + theta);
				console.log('thetaDeg: ' + (180/Math.PI) * theta);

				canvasCtx.save();
				
				// canvasCtx.rotate(theta * (i+1));
				console.log('theta * (i+1): ' + theta * (i+1));
				canvasCtx.drawImage(img, imgX-150, imgY-150, 300, 300);
				
				console.log(' *** ');
				canvasCtx.restore();

			}
			canvasCtx.restore();
		}

		var img = new Image();
		img.src = 'http://pngimg.com/uploads/palm_tree/palm_tree_PNG2494.png';
		img.onload = function(){
			polygon(canvWidth/2, canvHeight/2, 300, 6, 0, false, img);
		}
	}

	

	// drawRect();
	// drawTriangle();
	// drawSmiley();
	// drawPath();	
	// drawGrid();
	// drawCircles();
	// drawLines();
	// drawPattern();
	// drawTransGrid();
	// drawRotateTest();
	// drawSpiralMatrixTest();
	// animEarthExample();
	// animBallExample();
	// imgColorPick();
	// imgGreyInvert();
	// imgZoomAlias();
	// drawRegPoly();



	//Generative tests

	function helloShape(){

		canvasCtx.translate(canvWidth/2, canvHeight/2);

		function draw(){
			var circleResolution = (Math.random() * 80) +2;
			var radius = (Math.random() * canvWidth/4) +2;
			var angle = Math.PI*2/circleResolution;
			
			canvasCtx.lineWidth = (Math.random() * 15) +4;
			canvasCtx.strokeStyle = 'hsl('+ ((Math.random() * 360) +1)
											+ ', 70%, 70%)';

			canvasCtx.translate(-canvWidth/2, -canvHeight/2);

			canvasCtx.fillStyle = 'rgba(237, 230, 224, 0.2)';
			canvasCtx.fillRect(0,0, canvWidth,canvHeight);

			canvasCtx.translate(canvWidth/2, canvHeight/2);

			canvasCtx.beginPath();
			for (var i = 0; i <= circleResolution; i++) {
				var x = Math.cos(angle*i) * radius;
				var y = Math.sin(angle*i) * radius;
				console.log('x: ' + x);
				console.log('y: ' + y);

				canvasCtx.lineTo(x, y);
			}
			canvasCtx.closePath();
			canvasCtx.stroke();
			
			


			drawVisual = requestAnimationFrame(draw);
		}
		draw();
	}
	helloShape();

}
const init = ({canvasCtx, visualSettings, canvWidth, canvHeight}) => {

  return new Promise(function(resolve, reject) {

  		var Attractor = (function(x, y){

  			this.x = x;
  			this.y = y;
  			this.radius = 200; //radius of impact
  			this.strength = 1; //+ for attraction, - for repulsion
  			this.ramp = 0.5; // form of function
  			this.mode = 'basic';

  			this.attract = function(node){
  				var dx = this.x - node.x;
  				var dy = this.y - node.y;
  				var d = Math.sqrt(
  						Math.pow(dx, 2) + Math.pow(dy, 2)
  					);
  				var f = 0;

  				switch(this.mode){
  					case 'basic':
  						if(d > 0 && d < this.radius){
  							//calc force
  							var s = d/this.radius;
  							f = (1 / Math.pow(s, 0.5*this.ramp) -1);
  							f = this.strength * f / this.radius;
  						}
  						break;
  					case 'smooth': // Fallthrough
  					case 'twirl':
  						if(d > 0 && d < this.radius){
  							var s = Math.pow(d/this.radius, 1/this.ramp);
  							f = s * 9 * this.strength * (1 / (s + 1) + ((s-3) /4)) /d;
  						}
  						break;
  					default:
  						f = null;
  				}

  				//apply force
  				if(this.mode !== 'twirl'){
  					node.velocity.x += dx * f;
  					node.velocity.y += dy * f;
  				}
  				else{
  					node.velocity.x += dx * f;
  					node.velocity.y -= dy * f;
  				}
  			};
  		});

  		var Node = (function(x, y){

  			this.minX = 5;
  			this.minY = 5;
  			this.maxX = canvWidth-5;
  			this.maxY = canvHeight-5;
  			this.damping = 0.1;
  			this.x = x;
  			this.y = y;
  			this.velocity = {
  				x: null,
  				y: null
  			};

  			this.update = function(){

  				this.x += this.velocity.x;
  				this.y += this.velocity.y;

  				if(this.x < this.minX){
  					this.x = this.minX - (this.x - this.minX);
  					this.velocity.x *= -1;
  				}

  				if(this.x > this.maxX){
  					this.x = this.maxX - (this.x - this.maxX);
  					this.velocity.x *= -1;
  				}

  				if(this.y < this.minY){
  					this.y = this.minY - (this.y - this.minY);
  					this.velocity.y *= -1;
  				}

  				if(this.y > this.maxY){
  					this.y = this.maxY - (this.y - this.maxY);
  					this.velocity.y *= -1;
  				}

  				this.velocity.x *= (1-this.damping);
  				this.velocity.y *= (1-this.damping);
  			};

  			this.setBoundary = function(minX, minY, maxX, maxY){
  				this.minX = minX;
  				this.minY = minY;
  				this.maxX = maxX;
  				this.maxY = maxY;
  			};

  			this.setDamping = function(newDamping){
  				this.damping = newDamping;
  			};
  		});

  		var xCount = 100;
  		var yCount = 100;
  		var gridStepX = canvWidth/xCount;
  		var gridStepY = canvHeight/yCount;

  		var nodeDamping;

			const attractor = new Attractor(canvWidth/2, canvHeight/2);
			let nodes = [];

			canvasCtx.lineWidth = 1;
			canvasCtx.strokeStyle = 'black';

			var xPos, yPos;

			for(var x = 0; x < xCount; x++){
				for(var y = 0; y < yCount; y++){
				xPos = gridStepX *x;
				yPos = gridStepY *y;

				var node = new Node(xPos, yPos);
					node.velocity.x = 0; //??
					node.velocity.y = 0; //??
					node.damping = nodeDamping;

				nodes.push(node);
			}
		}

    const ownSettings = {
      attractor, nodes,
      xCount, yCount
    };
    resolve(ownSettings);
  });
}


const draw = ({
    canvasCtx, visualSettings, ownSettings,
    canvWidth, canvHeight,
    bufferLength, dataArray
  }) => {

  const {
    attractor, nodes, xCount, yCount
  } = ownSettings;

  canvasCtx.clearRect(0,0, canvWidth, canvHeight);
  canvasCtx.fillStyle = 'white';
  canvasCtx.fillRect(0,0, canvWidth, canvHeight);


  attractor.mode = visualSettings.mode.active;

  // if(visualSettings.mode.active === 'smooth'){
  //   attractor.mode = 'smooth';
  // }else if(visGuiSettings.mode === 'twirl'){
  //   attractor.mode = 'twirl';
  // }else{
  //   attractor.mode = 'basic';
  // }

  var da = dataArray[0];

  attractor.strength = Math.random()* (da * (visualSettings.attractStrength.active/100));
    if(Math.floor(Math.random()*2) === 1) attractor.strength *= -1;
  attractor.radius = Math.random()* (da*visualSettings.attractRadius.active);

  attractor.ramp = Math.random()*visualSettings.attractRamp.active;

  const nodeDamping = visualSettings.nodeDamping.active/100; //non-random


  for (var i = 0; i < nodes.length; i++) {
    nodes[i].setDamping(nodeDamping);
    attractor.attract(nodes[i]);
    nodes[i].update();
  }

  var i = 0;
  for(var y = 0; y < yCount; y++){
    canvasCtx.beginPath()
    for(var x = 0; x < xCount; x++){
      canvasCtx.moveTo(nodes[i].x, nodes[i].y);

      var theta = Math.atan2(canvHeight/2 - nodes[i].y, canvWidth/2 -nodes[i].x); //point towards centre
      // var theta = Math.atan2(nodes[i+1].y - nodes[i].y, nodes[i+1].x -nodes[i].x); //point towards neighbour
      canvasCtx.lineTo((Math.cos(theta)*5) + nodes[i].x, (Math.sin(theta)*5) +nodes[i].y);

      if(i+2 < nodes.length-1) i++;
    }
    canvasCtx.closePath();
    canvasCtx.stroke();
  }

  return {
    attractor, nodes, xCount, yCount
  };
}

export default {
  init,
  draw,
  type: 'shape',
  renderer: 'html',
  settings: {
    nodeDamping: {
      active: 10,
      min: 0,
      max: 100,
    },
    mode: {
      active: 'smooth',
      options: ['basic', 'smooth', 'twirl']
    },
    attractRadius: {
      active: 10,
      min: 0,
      max: 20,
    },
    attractStrength: {
      active: 100,
      min: 0,
      max: 200,
    },
    attractRamp: {
      active: 1,
      min: 0.1,
      max: 5,
    }
  },
  thumbImg: 'https://c1.staticflickr.com/3/2936/14764020945_8929458f57_q.jpg'
}

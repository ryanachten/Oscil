const init = ({canvasCtx, visualSettings, canvWidth, canvHeight}) => {

  return new Promise(function(resolve, reject) {

		const Attractor = (function(x, y){

			this.x = x;
			this.y = y;
			this.radius = 200; //radius of impact
			this.strength = 1; //+ for attraction, - for repulsion
			this.ramp = 0.5; // form of function
			this.mode = 'basic';

			this.attract = function(node){
				const dx = this.x - node.x;
				const dy = this.y - node.y;
				const d = Math.sqrt(
						Math.pow(dx, 2) + Math.pow(dy, 2)
					);
				let f = 0;

				switch(this.mode){
					case 'basic':
						if(d > 0 && d < this.radius){
							//calc force
							const s = d/this.radius;
							f = (1 / Math.pow(s, 0.5*this.ramp) -1);
							f = this.strength * f / this.radius;
						}
						break;
					case 'smooth': // Fallthrough
					case 'twirl':
						if(d > 0 && d < this.radius){
							const s = Math.pow(d/this.radius, 1/this.ramp);
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

		const Node = (function(x, y){

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

		const xCount = 100;
		const yCount = 100;
		const gridStepX = canvWidth/xCount;
		const gridStepY = canvHeight/yCount;

    let nodeDamping;

		const attractor = new Attractor(canvWidth/2, canvHeight/2);
		let nodes = [];

		canvasCtx.lineWidth = 1;
		canvasCtx.strokeStyle = 'black';

		for(let x = 0; x < xCount; x++){
			for(let y = 0; y < yCount; y++){
				let xPos = gridStepX *x;
				let yPos = gridStepY *y;

				const node = new Node(xPos, yPos);
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
    canvWidth, canvHeight, bgColour,
    bufferLength, dataArray
  }) => {

  const {
    attractor, nodes, xCount, yCount
  } = ownSettings;

  canvasCtx.clearRect(0,0, canvWidth, canvHeight);
  canvasCtx.fillStyle = bgColour;
  canvasCtx.fillRect(0,0, canvWidth, canvHeight);


  attractor.mode = visualSettings.mode.active;

  const da = dataArray[0];

  attractor.strength = Math.random()* (da * (visualSettings.attractStrength.active/100));
    if(Math.floor(Math.random()*2) === 1) attractor.strength *= -1;
  attractor.radius = Math.random()* (da*visualSettings.attractRadius.active);

  attractor.ramp = Math.random()*visualSettings.attractRamp.active;

  const nodeDamping = visualSettings.nodeDamping.active/100; //non-random


  for (let i = 0; i < nodes.length; i++) {
    nodes[i].setDamping(nodeDamping);
    attractor.attract(nodes[i]);
    nodes[i].update();
  }

  let i = 0;
  for(let y = 0; y < yCount; y++){
    canvasCtx.beginPath()
    for(let x = 0; x < xCount; x++){
      canvasCtx.moveTo(nodes[i].x, nodes[i].y);

      const theta = Math.atan2(canvHeight/2 - nodes[i].y, canvWidth/2 -nodes[i].x); //point towards centre
      // const theta = Math.atan2(nodes[i+1].y - nodes[i].y, nodes[i+1].x -nodes[i].x); //point towards neighbour
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
  frameRate: 30,
  description: 'Attraction patterns reminiscent of Chladni figures',
  thumbImg: 'shapes/oscil_thumb_chladniplate.jpg',
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
  }
}

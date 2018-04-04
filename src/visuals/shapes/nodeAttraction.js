const init = ({canvasCtx, visualSettings, canvWidth, canvHeight}) => {

  const Attractor = (function(x, y){

  	this.x = x;
  	this.y = y;
  	this.radius = 200; //radius of impact
  	this.strength = 1; //+ for attraction, - for repulsion
  	this.ramp = 0.5; // form of function

  	this.attract = function(node){
  		const dx = this.x - node.x;
  		const dy = this.y - node.y;
  		const d = Math.sqrt(
  				Math.pow(dx, 2) + Math.pow(dy, 2)
  			);
  		if(d > 0 && d < this.radius){
  			//calc force
  			const s = d/this.radius;
  			const f = (1 / Math.pow(s, 0.5*this.ramp) -1);

  			//apply force
  			node.velocity.x += dx * f;
  			node.velocity.y += dy * f;
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


  return new Promise(function(resolve, reject) {

    const xCount = canvWidth/10;
    const yCount = canvHeight/10;
    const nodeCount = xCount * yCount;
    const node_Damping = visualSettings.nodeDamping/100;

    const nodes = [];
    const gridSizeX = canvWidth/xCount;
    const gridSizeY = canvHeight/yCount;

    for(let y = 0; y < yCount; y++){
      for(let x = 0; x < xCount; x++){
        const xPos = x*gridSizeX;
        const yPos = y*gridSizeY;
        const node = new Node(xPos, yPos);
          node.setBoundary(0,0, canvWidth, canvHeight);
          node.setDamping(node_Damping);
        nodes.push(node);
      }
    }

    const attractor = new Attractor(canvWidth/2, canvHeight/2);
      attractor.radius = visualSettings.attractRadius.active;
      attractor.strength = visualSettings.attractStrength.active;
      attractor.ramp = visualSettings.attractRamp.active/100;

    const attractNode = new Node(canvWidth/2, canvHeight/2);
      attractNode.setBoundary(0,0, canvWidth, canvHeight);
      attractNode.setDamping(0);

      attractNode.velocity.x = visualSettings.attractMaxVelocity.active/2;
      attractNode.velocity.y = visualSettings.attractMaxVelocity.active/2;

    const ownSettings = {
      attractor, attractNode, nodes
    }
    resolve(ownSettings);
  });
};

const draw = ({
    canvasCtx, visualSettings, ownSettings,
    canvWidth, canvHeight, bgColour,
    bufferLength, dataArray
  }) => {

	const da = dataArray[0];
  const {
    attractor, attractNode, nodes
  } = ownSettings;

	canvasCtx.clearRect(0,0, canvWidth,canvHeight);
	canvasCtx.fillStyle = bgColour;
	canvasCtx.fillRect(0,0, canvWidth,canvHeight);

	const attractor_Radius = visualSettings.attractRadius.active;
	const attractor_Strength = visualSettings.attractStrength.active;
	const attractNode_MaxVelocity = visualSettings.attractMaxVelocity.active;
	const attractor_MaxRamp = da/visualSettings.attractRamp.active;

	attractor.strength = attractor_Strength;
	attractor.radius = attractor_Radius;

	//velocity cap
	if(attractNode.velocity.x > attractNode_MaxVelocity) attractNode.velocity.x = attractNode_MaxVelocity;
	if(attractNode.velocity.x < attractNode_MaxVelocity *-1) attractNode.velocity.x = attractNode_MaxVelocity*-1;
	if(attractNode.velocity.y > attractNode_MaxVelocity) attractNode.velocity.y = attractNode_MaxVelocity;
	if(attractNode.velocity.y < attractNode_MaxVelocity *-1) attractNode.velocity.y = attractNode_MaxVelocity*-1;

	attractNode.velocity.x -= Math.random()*attractNode_MaxVelocity;
	attractNode.velocity.y -= Math.random()*attractNode_MaxVelocity;
	attractNode.velocity.x += Math.random()*attractNode_MaxVelocity;
	attractNode.velocity.y += Math.random()*attractNode_MaxVelocity;

	attractNode.update();
	if(visualSettings.showAttractNode.active){
		canvasCtx.beginPath();
		canvasCtx.arc(attractNode.x, attractNode.y, 5, 0, Math.PI*2);
		canvasCtx.closePath();
		canvasCtx.fillStyle = 'red';
		canvasCtx.fill();
		canvasCtx.beginPath();
		canvasCtx.arc(attractNode.x, attractNode.y, attractor.radius, 0, Math.PI*2);
		canvasCtx.closePath();
		canvasCtx.strokeStyle = 'red';
		canvasCtx.stroke();
	}

	attractor.x = attractNode.x;
	attractor.y = attractNode.y;


	attractor.ramp = Math.random()*attractor_MaxRamp;
	if(Math.floor(Math.random()*2) === 1) attractor.ramp*=-1;

  const node_Damping = visualSettings.nodeDamping.active/100;

	for(let i = 0; i < nodes.length; i++){

		nodes[i].setDamping(node_Damping);
		attractor.attract(nodes[i]);
		nodes[i].update();

		canvasCtx.beginPath();
		canvasCtx.arc(nodes[i].x, nodes[i].y, 2, 0, Math.PI*2);
		canvasCtx.closePath();

		const rand = Math.floor(Math.random()*2);
		// if(i%5 === 0){
		// 	canvasCtx.fillStyle = 'hsl(282, 100%, 50%)';
		// }else if(i%3 === 0){
		// 	canvasCtx.fillStyle = 'hsl(332, 100%, 50%)';
		// }else{
		// 	canvasCtx.fillStyle = 'hsl(182, 100%, 50%)';
		// }
    	canvasCtx.fillStyle = 'black';

		canvasCtx.fill();
	}

  return ownSettings;
}


export default {
  init,
  draw,
  type: 'shape',
  renderer: 'html',
  frameRate: 10,
  description: 'Randomly moving magnetic attraction / repulsion',
  thumbImg: 'shapes/oscil_thumb_nodeattraction.jpg',
  settings: {
    nodeDamping: {
      active: 40,
      min: 0,
      max: 100
    },
    showAttractNode: {
      active: false,
    },
    attractRadius: {
      active: 200,
      min: 0,
      max: 500
    },
    attractStrength: {
      active: -10,
      min: -50,
      max: 50
    },
    attractRamp: {
      active: 200,
      min: 0,
      max: 1000
    },
    attractMaxVelocity: {
      active: 15,
      min: 0,
      max: 20
    }
  }
}

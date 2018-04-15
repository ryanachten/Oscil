import {mapRange} from '../../utilities/visualUtilities';

const init = ({canvasCtx, visualSettings, canvWidth, canvHeight}) => {

  return new Promise(function(resolve, reject) {
    canvasCtx.globalCompositeOperation = 'source-over';
    const count = Math.round(visualSettings.particleCount.active);
    let particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new create_particle(count));
    }
    resolve({particles});
  });

  function create_particle(count){

    const partMaxSize = 50;
    const partMinSize = 10;
    this.radius = Math.random()*(partMaxSize-partMinSize);
    this.hue = 360/count * (Math.random()*(count-1));
    this.colour = 'hsl(' + this.hue + ', 70%, 70%)';
    this.colour2 = 'hsl(' + (360-this.hue) + ', 70%, 70%)';
    this.x = Math.random()*canvWidth;
    this.y = Math.random()*canvHeight;

    this.vx = Math.random()*10-2; //change
    this.vy = Math.random()*10-2; //change
  }
}


const draw = ({
    canvasCtx, visualSettings, ownSettings,
    canvWidth, canvHeight,
    bufferLength, dataArray
  }) => {

    const particles = ownSettings.particles;

    canvasCtx.fillStyle = 'rgba(237, 230, 224, 0.3)';
    canvasCtx.fillRect(0,0, canvWidth, canvHeight);


    const step = Math.floor(bufferLength/particles.length);

    for(var i = 0; i < bufferLength; i+=20) {
      for (let j = 0; j < particles.length; j++) {

        const da = dataArray[i];

        const p = particles[j];

        canvasCtx.beginPath();
        canvasCtx.arc(p.x, p.y, p.radius, 0, Math.PI*2, true);
        canvasCtx.closePath();

        let grad;
        try {
           grad = canvasCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        } catch (e) {
          grad = canvasCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        }

        if (da !== 0){
          p.hue = p.hue + 1;
          p.colour = 'hsl(' + p.hue + ', 70%, 70%)';
          p.colour2 = 'hsl(' + (360 - p.hue) + ', 70%, 70%)';
          p.x += p.vx;
          p.y += p.vy;
        }

        grad.addColorStop(0, p.colour2);
        // grad.addColorStop(0.4, p.colour);
        // grad.addColorStop(0.4, 'white');
        grad.addColorStop(1, p.colour);

        canvasCtx.fillStyle = grad;
        canvasCtx.fill();

        //Boundaries
        if(p.y + p.vy > canvHeight || p.y + p.vy < 0){
          p.vy = -p.vy;
        }
        if(p.x + p.vx > canvWidth || p.x + p.vx < 0){
          p.vx = -p.vx;
        }
    }
  }
  ownSettings.particles = particles;
  return ownSettings;
}

export default {
  init,
  draw,
  type: 'shape',
  renderer: 'html',
  settings: {
    particleCount : {
      active: 30,
      min: 5,
      max: 50,
      requiresInitOnChange: true
    }
  },
  description: 'Reactive particle system',
  thumbImg: 'shapes/oscil_thumb_particles.jpg'
};

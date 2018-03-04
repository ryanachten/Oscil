import {mapRange} from '../utilities/visualUtilities';

export const particleInit = ({canvasCtx, visualSettings, canvWidth, canvHeight}) => {
  canvasCtx.globalCompositeOperation = 'source-over';
  const count = Math.round(visualSettings.particleCount.active);
  console.log('particle count:', count);
  let particles = [];
  for (let i = 0; i < count; i++) {
    particles.push(new create_particle(count));
  }

  function create_particle(count){

    const partMaxSize = 50;
    const partMinSize = 10;
    this.radius = Math.random()*(partMaxSize-partMinSize);
    this.hue = 360/count * (Math.random()*(count-1));
    // console.log(hue);
    this.colour = 'hsl(' + this.hue + ', 70%, 70%)';
    this.x = Math.random()*canvWidth;
    this.y = Math.random()*canvHeight;

    this.vx = Math.random()*10-2; //change
    this.vy = Math.random()*10-2; //change
  }

  return {particles};
}


export const particleDraw = ({
    canvasCtx, visualSettings, ownSettings,
    canvWidth, canvHeight,
    bufferLength, dataArray
  }) => {

    const particles = ownSettings.particles;

    canvasCtx.fillStyle = 'rgba(237, 230, 224, 0.3)';
    canvasCtx.fillRect(0,0, canvWidth, canvHeight);


    const step = Math.floor(bufferLength/particles.length);

    for (let j = 0; j < particles.length; j++) {

      let da = dataArray[j*step]/255.0;
      // console.log(mapRange);
      da = mapRange(da, 0, 1, -2, 2);
      // console.log(da);

      const p = particles[j];

      canvasCtx.beginPath();
      canvasCtx.arc(p.x, p.y, p.radius, 0, Math.PI*2, true);
      canvasCtx.closePath();

      const grad = canvasCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
      if (da !== 0){
        p.hue = p.hue + 1;
        p.colour = 'hsl(' + p.hue + ', 70%, 70%)';

        const switchX = Math.floor(Math.random()*2);
        switchX === 0 ? p.vx -= da : p.vx += da;

        const switchY = Math.floor(Math.random()*2);
        switchY === 0 ? p.vy -= da : p.vy += da;
        //
        p.x += (p.vx);
        p.y += (p.vy);
      }

      grad.addColorStop(0, 'white');
      grad.addColorStop(0.4, p.colour);
      grad.addColorStop(0.4, 'white');
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

  ownSettings.particles = particles;
  return ownSettings;
}

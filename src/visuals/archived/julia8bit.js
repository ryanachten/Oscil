const init = ({p, visualSettings, canvWidth, canvHeight, video}) => {

  return new Promise(function(resolve, reject) {

    const canvas = p.createCanvas(canvWidth, canvHeight);
    canvas.id('p5-canvas');
    p.pixelDensity(1);
    p.noStroke();
    p.colorMode(p.HSB, 255);

    const ownSettings = {

    };
    resolve(ownSettings);
  });
};


const draw = ({
    p, visualSettings, ownSettings,
    canvWidth, canvHeight,
    bufferLength, dataArray, bgColour,
  }) => {

	p.background(0);

	const sampleSize = visualSettings.sampleRes.active;
	const sampleWidth = p.width/sampleSize;
	const sampleHeight = p.height/sampleSize;

	const da = p.map(dataArray[0], 0, 255, -2.5, 2.5);
	// console.log(da);

	for(let x = 0; x < sampleSize; x++){
		for(let y = 0; y < sampleSize; y++){

			let a = p.map( x*sampleWidth, 0, sampleWidth*sampleSize, visualSettings.minPos.active, visualSettings.maxPos.active );
			let b = p.map( y*sampleHeight, 0, sampleHeight*sampleSize, visualSettings.minPos.active, visualSettings.maxPos.active );

			const ca = a;
			const cb = b;

			const maxIterations = visualSettings.maxIterations.active + da;
			let n = 0; //tracks the number of iterations


			//  complex numbers which does not diverge when iterated
			while (n < maxIterations) {

				// julia
				const aa = a * a;
				const bb = b * b;
				// julia
				const escapeTime = 4;
				if (aa + bb > escapeTime){

					break;
				}
				const twoab = 2.0 * a * b;
				a = aa - bb + (visualSettings.aConst.active + da);
				b = twoab + visualSettings.bConst.active;


				n++;
			}

			let bright = p.map(n, 0, maxIterations, 0, 255);
			// // check if n is inside of the mandelbrot set
			if (n === maxIterations) {
				bright = 0;
			}
			p.fill(125+Math.sin(bright)*125, 200, 125+Math.sin(bright)*125);
			p.ellipseMode(p.CENTER);
			p.ellipse(x*sampleWidth, y*sampleHeight, sampleWidth, sampleHeight);
		}
	}
};

export default {
  init,
  draw,
  type: 'shape',
  renderer: 'p5',
  thumbImg: 'shapes/oscil_thumb_julia8bit.jpg',
  description: 'Lo-fi representation of the Julia set fractal',
  settings: {
    sampleRes: {
      active: 140,
      min: 0,
      max: 500
    },
		maxIterations: {
      active: 35,
      min: 0,
      max: 100
    },
		aConst: {
      active: -0.70176,
      min: -2.50000,
      max: 2.50000
    },
		bConst: {
      active: -0.02,
      min: -2.50000,
      max: 2.50000
    },
		minPos: {
      active: -1.6,
      min: -2.5,
      max:  2.5
    },
		maxPos: {
      active: 1.7,
      min: -2.5,
      max:  2.5
    }
  }
}

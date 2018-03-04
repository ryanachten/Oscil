import waveform from '../visuals/waveform';
import barGraph from '../visuals/barGraph';
import gradient from '../visuals/gradient';
import {particleInit, particleDraw} from '../visuals/particles';

const visuals = {
  waveform: {
    draw: waveform,
    type: 'shape',
    thumbImg: 'https://c2.staticflickr.com/4/3890/14587030670_727b688651_q.jpg'
  },
  barGraph: {
    draw: barGraph,
    type: 'shape',
    thumbImg: 'https://c1.staticflickr.com/3/2912/14763226235_c97c9a4aba_q.jpg'
  },
  gradient: {
    draw: gradient,
    type: 'shape',
    settings: {
      gradMode : {
        options: ['linear', 'radial'],
        active: 'radial'
      }
    }
  },
  particles: {
    init: particleInit,
    draw: particleDraw,
    type: 'shape',
    settings: {
      particleCount : {
        active: 30,
        min: 5,
        max: 50,
        requiresInitOnChange: true
      }
    },
    thumbImg: 'https://c1.staticflickr.com/1/501/20506686861_c48dddabac_q.jpg'
  }
};

export default visuals;

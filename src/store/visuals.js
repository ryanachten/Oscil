import waveform from '../visuals/waveform';
import barGraph from '../visuals/barGraph';
import gradient from '../visuals/gradient';

const visuals = {
  waveform: {
    visual: waveform,
    type: 'shape',
    thumbImg: 'https://c2.staticflickr.com/4/3890/14587030670_727b688651_q.jpg'
  },
  barGraph: {
    visual: barGraph,
    type: 'shape',
    thumbImg: 'https://c1.staticflickr.com/3/2912/14763226235_c97c9a4aba_q.jpg'
  },
  gradient: {
    visual: gradient,
    type: 'shape',
    settings: {
      gradMode : {
        options: ['linear', 'radial'],
        active: 'radial'
      }
    }
  }
};

export default visuals;

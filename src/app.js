import React from 'react';
import ReactDOM from 'react-dom';

import AppRouter from './routers/AppRouters.js'
import configureStore from './store/configureStore';

import 'normalize.css/normalize.css';
import './styles/style.scss';


import getCurrentVisual from './selectors/visual';
import {setVisual, updateVisualSettings} from './actions/visual';

const store = configureStore();
store.subscribe( () => {
  const state = store.getState();
  const currentVisual = getCurrentVisual(state.visual);
  console.log(currentVisual);

});

store.dispatch(
  setVisual({
    visual:'waveform',
  })
);

store.dispatch(
  updateVisualSettings({
    settings: {
      gradMode: 'linear'
    }
  })
);

store.dispatch(
  setVisual({
    visual:'barGraph',
  })
);
//
// store.dispatch(
//   setupAudio({
//     bufferLength: 128,
//     dataArray: [128]
//   })
// );


ReactDOM.render( <AppRouter />, document.getElementById('app') );

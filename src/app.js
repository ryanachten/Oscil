import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

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
  // console.log(currentVisual);

});

store.dispatch(
  setVisual({
    visual:'gradient',
  })
);

// setTimeout(function () {
//   store.dispatch(
//     setVisual({
//       visual:'barGraph',
//     })
//   );
// }, 3000);

//
// store.dispatch(
//   updateVisualSettings({
//     settings: {
//       gradMode: 'linear'
//     }
//   })
// );
//
// store.dispatch(
//   setVisual({
//     visual:'barGraph',
//   })
// );
//
// store.dispatch(
//   setupAudio({
//     bufferLength: 128,
//     dataArray: [128]
//   })
// );

const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

ReactDOM.render( jsx, document.getElementById('app') );

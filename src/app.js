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

const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

ReactDOM.render( jsx, document.getElementById('app') );

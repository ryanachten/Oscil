import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import AppRouter from './routers/AppRouters.js'
import configureStore from './store/configureStore';

import 'normalize.css/normalize.css';
import './styles/style.scss';

const store = configureStore();

const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

ReactDOM.render( jsx, document.getElementById('app') );

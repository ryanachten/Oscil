import React from 'react';
import ReactDOM from 'react-dom';

import AppRouter from './routers/AppRouters.js'

import 'normalize.css/normalize.css';
import './styles/style.scss';

import store from './store/configureStore';


ReactDOM.render( <AppRouter />, document.getElementById('app') );

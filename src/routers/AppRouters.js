import React from 'react';
import { BrowserRouter, Route, Switch, Link, NavLink } from 'react-router-dom';

import HomePage from '../components/HomePage';
import PortfolioPage from '../components/PortfolioPage';
import visuals from '../store/visuals';
import Waveform from '../components/visuals/Waveform';
import ContactPage from '../components/ContactPage';
import NotFoundPage from '../components/NotFoundPage';
import Header from '../components/Header';


const AppRouter = () => (
  <BrowserRouter>
    <div>
    <Header />
      <Switch>
        <Route path="/" component={HomePage} exact={true} />
        <Route path="/portfolio" component={PortfolioPage} exact={true} />
        <Route path="/:id"
          component={({ match }) => {
            const CurrentVisual = visuals[match.params.id];
            return <CurrentVisual />
          }} />
        <Route path="/contact" component={ContactPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </BrowserRouter>
);


export default AppRouter;

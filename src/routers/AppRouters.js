import React from 'react';
import { BrowserRouter, Route, Switch, Link, NavLink } from 'react-router-dom';

import Header from '../components/Header';
import HomePage from '../components/HomePage';
import visuals from '../store/visuals';
import NotFoundPage from '../components/NotFoundPage';

const AppRouter = () => (
  <BrowserRouter>
    <div>
    <Header />
      <Switch>
        <Route path="/" component={HomePage} exact={true} />
        <Route path="/:id"
          component={({ match }) => {
            const CurrentVisual = visuals[match.params.id].visual;
            return <CurrentVisual />
          }} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </BrowserRouter>
);


export default AppRouter;

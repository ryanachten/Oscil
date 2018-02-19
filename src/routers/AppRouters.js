import React from 'react';
import { BrowserRouter, Route, Switch, Link, NavLink } from 'react-router-dom';

import Header from '../components/Header';
import HomePage from '../components/HomePage';
import visuals from '../store/visuals';
import NotFoundPage from '../components/NotFoundPage';
import VisualCanvas from '../components/VisualCanvas';

const AppRouter = () => (
  <BrowserRouter>
    <div>
    <Header />
      <Switch>
        <Route path="/" component={HomePage} exact={true} />
          <Route path="/:id"
            component={({ match }) => {
              const visualDraw = visuals[match.params.id].visual;
              const visualSettings = visuals[match.params.id].settings;
              return <VisualCanvas
                        key={match.params.id}
                        visualDraw={visualDraw}
                        visualSettings={visualSettings}
                      />
            }} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </BrowserRouter>
);


export default AppRouter;

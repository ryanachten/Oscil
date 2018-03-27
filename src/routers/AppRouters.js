import React from 'react';
import { BrowserRouter, Route, Switch, Link, NavLink } from 'react-router-dom';
import allVisualData from '../store/visuals';

import HomePage from '../components/HomePage';
import NotFoundPage from '../components/NotFoundPage';
import VisualPage from '../components/VisualPage';

const AppRouter = (props) => {

  return(
    <BrowserRouter>
      <div>
        <Switch>
          <Route path="/" component={HomePage} exact={true} />
            <Route path="/:id"
              component={({ match }) => {
                if (allVisualData[match.params.id]) {
                  // If current url exists in store/visuals return vis page
                  return <VisualPage pathId={match.params.id} />
                }
                else{
                  // If current url doesn't exist in store/visuals return 404
                  return <NotFoundPage />
                }
              }} />
          <Route component={NotFoundPage} />
        </Switch>
      </div>
    </BrowserRouter>
  )
};

export default AppRouter;

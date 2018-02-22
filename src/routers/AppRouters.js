import React from 'react';
import { BrowserRouter, Route, Switch, Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import Header from '../components/Header';
import HomePage from '../components/HomePage';
import NotFoundPage from '../components/NotFoundPage';
import VisualCanvas from '../components/VisualCanvas';

// import { setVisual } from '../actions/visual';

const AppRouter = (props) => (
  <BrowserRouter>
    <div>
    <Header />
      <Switch>
        <Route path="/" component={HomePage} exact={true} />
          <Route path="/:id"
            component={({ match }) => {
              // props.dispatch(setVisual({visual: match.params.id}));

              return <VisualCanvas pathId={match.params.id} />
            }} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </BrowserRouter>
);


export default connect()(AppRouter);

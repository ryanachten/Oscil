import React from 'react';
import { Link } from 'react-router-dom';

import Header from './Header';

const NotFoundPage = () => (
  <div className="notfound">
    <Header currentPage="404" />
    <div className="notfound__container">
      <img className="notfound__logo" src="/img/oscil_logo_light.svg"></img>
      <h1>Sorry!<br />
      The visual or page you’re looking for can’t be found…</h1>
      <h2>Check out <Link to="/">home</Link> to find something else!</h2>
    </div>
  </div>
);

export default NotFoundPage;

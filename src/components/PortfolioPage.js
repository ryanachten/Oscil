import React from 'react';
import { NavLink } from 'react-router-dom';

const PortfolioPage = () => (
  <div>
    Look at all my work!
    <nav>
      <NavLink to="/portfolio/1" activeClassName="is-active">Project 1</NavLink>
      <NavLink to="/portfolio/2" activeClassName="is-active">Project 2</NavLink>
    </nav>
  </div>
);

export default PortfolioPage;

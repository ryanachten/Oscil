import React from 'react';
import { NavLink } from 'react-router-dom';
import VisualControlPanel from './VisualControlPanel';

const Header = () => (
  <header>
    <NavLink to="/" activeClassName="is-active" exact={true}>Home</NavLink>
    <NavLink to="/portfolio" activeClassName="is-active">Portfolio</NavLink>
    <NavLink to="/contact" activeClassName="is-active">Contact</NavLink>
    <VisualControlPanel />
  </header>
);

export default Header;

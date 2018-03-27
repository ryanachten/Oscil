import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
    return(
      <header>
        <NavLink
          id="topnav--oscillogo"
          to="/" activeClassName="is-active" exact={true}>
        </NavLink>
        <NavLink to="/" activeClassName="is-active" exact={true}>oscil</NavLink>
      </header>
    )
};

export default Header;

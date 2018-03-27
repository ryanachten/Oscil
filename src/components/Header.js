import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = (props) => {

    const {currentPage} = props;

    return(
      // Toggle nav colour scheme based on page via classes
      <header id="topnav--container" className={`topnav__${currentPage}`}>
        <NavLink
          id="topnav--oscillogo"
          to="/" exact={true}>
        </NavLink>
        <NavLink
          id="topnav--oscillogotype"
          to="/" exact={true}>oscil</NavLink>
      </header>
    )
};

export default Header;

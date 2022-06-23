import React from 'react';
import {Link, NavLink} from 'react-router-dom';

import ActiveUserMenu from 'components/ActiveUserMenu';
import Logo from 'assets/svg/logo.svg';

import styles from 'styles/NavBar.module.css';

const NavBar = () => {
  let str;

  console.log(str);
  return (
    <header className={styles.wrapper}>
      <nav className={styles.nav}>
        <NavLink className={styles.link} to="/">
          My Recipes
        </NavLink>
        <NavLink className={styles.link} to="/about">
          About
        </NavLink>
      </nav>
      <Link to="/" className={styles.logoLink}>
        <Logo />
      </Link>
      <ActiveUserMenu />
    </header>
  );
};

export default NavBar;

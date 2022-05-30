import React from 'react';
import IMAGE from 'assets/favicon-logo.png';

import 'styles/index.css';

import styles from 'styles.module.css';

import SvgImg from 'assets/svg/safari-pinned-tab.svg';

console.log(styles.background);

const App = () => {
  return (
    <div className={styles.background}>
      <h1>Typescript MERN Boilerplate 2022</h1>
      <SvgImg />
    </div>
  );
};

export default App;

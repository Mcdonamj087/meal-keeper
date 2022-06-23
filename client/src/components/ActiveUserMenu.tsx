import React from 'react';

import styles from 'styles/ActiveUserMenu.module.css';

type ActiveUserMenuProps = {};

const ActiveUserMenu: React.FC<ActiveUserMenuProps> = (props) => {
  return (
    <div className={styles.wrapper}>
      <p className={styles.userName}>Matt McDonald</p>
    </div>
  );
};

export default ActiveUserMenu;

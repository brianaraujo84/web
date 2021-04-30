import React from 'react';
import { Link } from 'react-router-dom';

import * as URLS from '../../../urls';

const HeaderNoLogin = () => {
  const { logo } = window.GLOBAL_VARIABLES;

  return (
    <div className="fixed-top">
      <nav className='navbar navbar-dark bg-primary'>
        <div className='container p-0 px-sm-3'>
          <Link className="navbar-brand" to={URLS.HOME}> <img src={logo} height="27" /></Link>
        </div>
      </nav>
      <div />
      <div />
    </div>
  );
};

HeaderNoLogin.displayName = 'HeaderNoLogin';
export default HeaderNoLogin;

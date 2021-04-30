
import React from 'react';
import { Route, Redirect, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LOGIN } from './urls';

const PrivatRoute = ({ ...rest }) => {
  const history = useHistory();
  const loggedIn = useSelector(state => state.profile.loggedIn);
  const { pathname, data, search } = history.location;
  const redirectTo = LOGIN(encodeURIComponent(pathname));
  // const redirectTo = (`/login/${encodeURIComponent(pathname)}`);
  return loggedIn ? <Route {...rest} /> : <Redirect to={{ pathname: redirectTo, data, search }} />;
};
PrivatRoute.displayName = 'PrivatRoute';
export default PrivatRoute;

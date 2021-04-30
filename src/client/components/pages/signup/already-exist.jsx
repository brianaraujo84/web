import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import * as URLS from '../../../urls';

const AlreadyExist = ({message}) => {
  return (
    !!message && <p className="text-danger small mt-1" role="alert">
      <Trans>{message} </Trans> 
      <Link to={URLS.LOGIN()}><Trans>Sign in</Trans></Link>
      <Trans> or </Trans>
      <Link to={URLS.FORGOT_PASSWORD}><Trans>reset your password</Trans></Link>.
    </p>
  );
};
  
AlreadyExist.propTypes = {
  message: PropTypes.string,
};
AlreadyExist.defaultProps = {
  message: '',
};
AlreadyExist.displayName = 'AlreadyExist';
export default AlreadyExist;

import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useActionDispatch } from '../../../hooks';
import { resendCode } from '../../../redux/actions/profile';

import * as URLS from '../../../urls';

const Verification = ({
  phone,
  username,
}) => {
  const [error, setError] = React.useState(null);

  const resend = useActionDispatch(resendCode);

  const phoneMask = React.useMemo(() => {
    if (phone.startsWith('+1')) {
      return `+1 (***) ***-${phone.slice(-4)}`;
    }
    return `+39 (***) ***-${phone.slice(-4)}`;
  }, [phone]);

  const handleResend = async () => {
    setError(null);
    try {
      await resend({ userName: username });
    } catch (err) {
      setError(err?.data?.message);
    }
  };

  return (
    <>
      <form>
        <h1 className="text-center mb-4"><Trans>Verification</Trans></h1>
        <p className="lead text-center"><Trans>We sent a link in text message to the number {{ phoneMask }}. Click the link to verify your phone number.</Trans></p>

        <div className="form-group">
          <p className="text-center mt-3">
            <Trans>Didn't get a text? <a href="#" data-target="link-resend-code" onClick={handleResend}>Resend Code</a></Trans>
          </p>
          {error && <p className="error text-danger"><small>{error}</small></p>}
        </div>

        <div className="row justify-content-between mt-4">
          <div className="col-12">
            <hr className="mt-4" />
            <p className="text-center"><Trans>Did you select the link on your phone?</Trans></p>
            <Link to={URLS.LOGIN()} className="btn btn-outline-primary btn-block"><Trans>I clicked the verification link</Trans></Link>
          </div>
        </div>
      </form>
    </>
  );
};
Verification.propTypes = {
  phone: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
};
Verification.defaultProps = {
  phone: '+188888888',
  username: '+188888888',
};
Verification.displayName = 'Verification';
export default Verification;

import React from 'react';
import { Trans } from 'react-i18next';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { Link, useHistory } from 'react-router-dom';

import * as URLS from '../../../urls';
import { useActionDispatch } from '../../../hooks';
import { logout } from '../../../redux/actions/profile';
import { SubscriptionPlans } from '../../../constants';

const Footer = () => {
  const history = useHistory();
  const profile = useSelector(state => state.profile.data);
  const doLogout = useActionDispatch(logout);

  const {
    username,
  } = profile;

  const handleLogout = async () => {
    const data = {
      username,
    };
    await doLogout(data);
    history.push(URLS.LOGIN());
  };

  const isFreeTrial = React.useMemo(() => {
    return (profile.isManager || profile.isOwner) &&
      profile.subscription?.subscription === SubscriptionPlans.TRIAL;
  }, [profile]);

  return (
    <>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <p className="lead mb-3"><Trans>Password &amp; Security</Trans></p>
          <Link to={URLS.FORGOT_PASSWORD}><Trans>Change Password</Trans></Link>
        </div>
      </div>

      <hr />


      {isFreeTrial && (
        <div className="row justify-content-center">
          <div className="col-12 col-md-6">
            <p className="lead mb-3">
              <Trans>Subscription &amp; Billing</Trans>
            </p>
            <form>
              <div className="form-group">
                <div className="alert alert-primary">
                  <h5>
                    <Trans>Free Trial </Trans>
                    <small className="text-primary">
                      <Trans>expires </Trans>
                      {profile.subscription.expiresOn}
                    </small>
                  </h5>
                  <p>
                    <Trans>We hope you're enjoying Confidence. You can subscribe any time and have Confidence as the new member of your team!</Trans>
                  </p>
                  <Button variant="primary" block disabled>
                    <Trans>Subscribe Now</Trans>
                  </Button>
                  <p className="text-center text-primary mb-0"><small><Trans>$30/mo</Trans></small></p>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <Button
            variant="outline-danger"
            type="button"
            onClick={handleLogout}
            data-target="logout-btn"
            block
          >
            <Trans>Log Out</Trans>
          </Button>
        </div>
      </div>
    </>
  );
};
Footer.displayName = 'Footer';
export default Footer;

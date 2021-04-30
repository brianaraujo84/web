import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import Layout from '../../shared/layout';
import { useTitle, useActionDispatch } from '../../../hooks';
import { startFreeTrail, updateUserProfile, isSubscriptionValid } from '../../../redux/actions/profile';
import * as URLS from '../../../urls';

const styles = {
  subscribe: {
    fontWeight: '300'
  },
};

const Subscription = () => {
  const { t } = useTranslation();
  const history = useHistory();

  useTitle(t('Subscription'));

  const enrollSubscription = useActionDispatch(startFreeTrail);
  const updateUserProfileInfo = useActionDispatch(updateUserProfile);
  const updateSubscriptionData = useActionDispatch(isSubscriptionValid);

  const navBackToHome = () => {
    history.replace(URLS.HOME);
  };

  const startSubscription = async () => {
    const payload = {
      promotionCode: null,
    };
    enrollSubscription(payload).then(() => {
      updateUserProfileInfo({ isWorker: false });
      updateSubscriptionData();
      history.replace(URLS.ADD_LOCATION);
    }, () => {
      history.replace(URLS.PAGE_400);
    });
  };

  return (
    <Layout noheader blue>
      <div>
        <nav className="navbar navbar-dark">
          <div className='container p-0 px-sm-3'>
            <a role="button" className="p-2 text-light" onClick={navBackToHome}><i className="far fa-times fa-lg" aria-hidden="true"></i> <span className="sr-only">Close</span></a>            
          </div>
        </nav>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-9 col-md-5 col-lg-4 mt-5 pt-5">
              <h2 className="text-center mb-4 mt-2">Free Trial!</h2>
              <p className="text-center" style={styles.subscribe}>Kick the tires and see the value that Confidence can have for you and your business.</p>
              <hr className="mt-4 mb-4" />
              <form>
                <h6 className="text-center mb-4">Enjoy a 30-day free trial.</h6>
                <div className="row">
                  <div className="col">
                    <Button
                      variant="outline-primary"
                      className="btn-outline-light"
                      data-target="start-subscription"
                      block
                      onClick={startSubscription}
                    >
                      <Trans i18nKey="start_trial" defaults='Start Trial' />
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

Subscription.displayName = 'Subscription';
export default Subscription;

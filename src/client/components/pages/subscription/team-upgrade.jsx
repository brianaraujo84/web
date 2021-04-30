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
      <nav className="navbar navbar-dark">
        <div className='container p-0 px-sm-3'>
          <a role="button" className="p-2 text-light" onClick={navBackToHome}><i className="far fa-times fa-lg" aria-hidden="true"></i> <span className="sr-only">Close</span></a>          
        </div>
      </nav>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-11 col-md-5 col-lg-4 mt-4">
            <h2 className="text-center mb-4"><i className="fal fa-2x fa-clipboard-check" aria-hidden="true"></i></h2>
            <p className="lead text-center">You completed your task!</p>
            <hr className="my-4 border-light"/>
            <form>
              <h4 className="text-center mb-1 mt-4" style={styles.subscribe}>Want to get work done?</h4>
              <p className="text-center font-weight-light">You can create your own workspace and assign tasks to others.</p>
              <div className="row">
                <div className="col">
                  <Button
                    variant="primary"
                    className="btn-light text-primary"
                    data-target="start-subscription"
                    block
                    onClick={startSubscription}
                  >
                    <Trans i18nKey="create_workspace" defaults='Create Workspace' />
                  </Button>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col">
                  <Button
                    className="text-white btn-block"
                    data-target="start-subscription"
                    block
                    onClick={navBackToHome}
                  >
                    <Trans i18nKey="not_right_now" defaults='Not right now, maybe later' />
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

Subscription.displayName = 'Subscription';
export default Subscription;

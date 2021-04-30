import React from 'react';
import { Trans } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

import * as URLS from '../../../urls';
import { useActionDispatch } from '../../../hooks';
import { isSubscriptionValid } from '../../../redux/actions/profile';

const Content = () => {
  const history = useHistory();

  const [noSubscription, setNoSubscription] = React.useState(false);

  const profile = useSelector(state => state.profile.data);

  const isSubscriptionExpired = useActionDispatch(isSubscriptionValid);

  
  const navToWorkspaceAndSubscriptionChecker = () => {
    if (noSubscription) {
      history.replace(URLS.SUBSCRIPTION);
    } else {
      history.replace(URLS.ADD_LOCATION);
    }
  };

  const subscriptionSetter = () => {
    if (profile && profile.subscription && Object.keys(profile.subscription).length === 0) {
      setNoSubscription(true);
    }
  };

  const checkSubExpiration = async () => {
    try {
      await isSubscriptionExpired();
      subscriptionSetter();
    } catch {
      setNoSubscription(true);
    }
  };

  const {
    firstName,
    imgThumb,
  } = profile;

  React.useEffect(() => {
    if (profile.isOwner) {
      checkSubExpiration();
    }
  }, []);

  return (
    <div className="row row justify-content-center">
      <div className="col-12 col-md-6 mt-4">
        <div className="text-center">
          <img className="profile-pic profile-pic-lg mb-2" src={imgThumb} />
          <h2 className="mb-0 pb-0">Welcome {firstName}!</h2>
          <p className="lead my-3 pb-0">Create your first workspace to<br/> get work done.</p>
          <button className="btn btn-primary btn-block" onClick={navToWorkspaceAndSubscriptionChecker}>
            <Trans 
              i18nKey="add_no_a_workspace" 
              defaults="Add Workspace"
            />
          </button>
        </div>
        <hr className="my-4" />
        <div className="text-center">
          <div className="text-center mb-2">
            <img className="rounded fade-50 mr-2" src="/assets/img/noun_hotel.svg" width="40"/>
            <img className="rounded fade-50 mr-2" src="/assets/img/noun_fire.svg" width="40" />
            <img className="rounded fade-50 mr-2" src="/assets/img/noun_plumbing.svg" width="40" />
            <img className="rounded fade-50 mr-2" src="/assets/img/noun_clean.svg" width="40" />
            <img className="rounded fade-50 mr-2" src="/assets/img/noun_construction.svg" width="40" />
            <img className="rounded fade-50 mr-2" src="/assets/img/noun_school.svg" width="40" />
          </div>
          <p>Browse our marketplace of industry templates to jump start your work.</p>
          <div className="px-4">
            <Link className="btn btn-block btn-outline-secondary" to={URLS.MARKETPLACE}>
              <Trans 
                i18nKey="marketplace" 
                defaults="Marketplace"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

Content.propTypes = {
};

Content.displayName = 'HomeContent';
export default Content;

import React from 'react';
import { Trans } from 'react-i18next';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import moment from 'moment';

import { SubscriptionPlans, StorageKeys } from '../../../constants';
import { getItem, setItem } from '../../../utils/storage-utils';
import { DateUtils } from '../../../utils';
import { useActionDispatch } from '../../../hooks';
import { getCommunicationHeaderObject } from '../../../redux/actions/object';

const OBJECT_HEADER_CONTENT = 'headerContent';

const Header = () => {
  const [showFreeTrial, setShowFreeTrial] = React.useState(true);

  const profile = useSelector(state => state.profile.data);
  const {
    firstName,
    imgThumb,
  } = profile;

  const headerContent = useSelector(state => state.headerContent.data);
  const getHeaderContent = useActionDispatch(getCommunicationHeaderObject(OBJECT_HEADER_CONTENT));

  React.useEffect(() => {
    getHeaderContent();
  }, []);

  const handleCloseFreeTrial = () => {
    setItem(StorageKeys.TRIAL_COUNTER_LAST_DATE_KEY, DateUtils.unicodeFormat(new Date(), 'yyyy-MM-dd'));
    setShowFreeTrial(false);
  };

  const isFreeTrial = React.useMemo(() => {
    return (profile.isManager || profile.isOwner) &&
      profile.subscription?.subscription === SubscriptionPlans.TRIAL;
  }, [profile]);

  React.useEffect(() => {
    const lastVisitDate = getItem(StorageKeys.TRIAL_COUNTER_LAST_DATE_KEY);
    setShowFreeTrial(lastVisitDate !== DateUtils.unicodeFormat(new Date(), 'yyyy-MM-dd'));
  }, []);

  const headerImgFileName = React.useMemo(() => {
    const url = headerContent?.imageUrl;
    if(!url) {return '';}

    return `/api/files/header/image/${url}`;
  }, [headerContent]);

  return (
    <>
      <div className="cover bg-primary" style={{backgroundImage: `url(${headerImgFileName})`}}></div>
      <div className="welcome container px-3 align-items-end">
        <img className="float-left profile-pic mr-2" src={imgThumb} />
        <h3 className="pb-0 text-white">
          <Trans i18nKey="welcome_fname" values={{firstName}}/>
        </h3>
      </div>
      <small className="quote font-italic pr-3">{headerContent?.message}</small>
      <div className="clearfix"></div>
   
      {isFreeTrial && showFreeTrial && (
        <div className="container">
          <div className="alert alert-info mt-3 mb-0">
            <button className="close" data-target="close-tooltip" aria-label="Close" onClick={handleCloseFreeTrial}>
              <span aria-hidden="true">×</span>
            </button>
            <h5>
              <Trans
                i18nKey="free_trial_end_title"
                defaults="Free trial ends in {{daysCount}} days"
                values={{
                  daysCount: moment(new Date(profile.subscription.expiresOn)).diff(new Date(), 'days')
                }}
              />
            </h5>
            <p>
              <Trans
                i18nKey="free_trial_ends_subtitle"
                defaults="Once your trial ends you'll be asked to subscribe to Confidence for $30/month."
              />
            </p>
            <Button variant="info" block disabled>
              <Trans i18nKey="subscribe_now_button" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
Header.displayName = 'LocationsHeader';
export default Header;

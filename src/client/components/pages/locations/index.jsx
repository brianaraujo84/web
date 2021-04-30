import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Layout from '../../shared/layout';
import { useTitle, useGetLocations, useActionDispatch } from '../../../hooks';
import { setObject } from '../../../redux/actions/object';
import { setItem } from '../../../utils/storage-utils';
import { StorageKeys } from '../../../constants';
import { isSubscriptionValid } from '../../../redux/actions/profile';
import * as URLS from '../../../urls';
import Content from './content';
import useDebounce from '../../../hooks/useDebounce';

const Locations = () => {
  const { t } = useTranslation();
  useTitle(t('my_locs'));

  const [noSubscription, setNoSubscription] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState(undefined);

  const history = useHistory();
  const profile = useSelector(state => state.profile.data);

  const isSubscriptionExpired = useActionDispatch(isSubscriptionValid);
  const resetFilterData = useActionDispatch(setObject('taskGroupFilters'));
  const getLocations = useGetLocations();
  
  const locations = useSelector(state => state.locations.items);
 
  const debouncedValues = useDebounce(searchTerm, 500);

  const navigateToHome = () => {
    if (locations.length === 0 && searchTerm === undefined) {
      history.replace(URLS.HOME);
    }
  };

  React.useEffect(() => {
    navigateToHome();
  }, []);

  React.useEffect(() => {
    getLocations({}, undefined, {}, '', true);
  }, []);

  React.useMemo(() => {
    getLocations({ searchTerm: debouncedValues }, undefined, {}, '', true);
  }, [debouncedValues]);

  const subscriptionSetter = () => {
    if (profile && profile.subscription && Object.keys(profile.subscription).length === 0) {
      setNoSubscription(true);
    }
  };

  const checkSubExpiration = async () => {
    try {
      await isSubscriptionExpired();
      subscriptionSetter();
      setLoading(false);
    } catch {
      setNoSubscription(true);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (profile.isOwner) {
      checkSubExpiration();
    } else {
      if (loading) {
        setLoading(false);
      }
    }
    resetFilterData({});
    setItem(StorageKeys.ACTIVE_TAB_KEY, false);
  }, []);

  if (loading) {
    return (
      <Layout>
        <div />
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="content-wrapper">
        <Content fetchMore={getLocations} noSubscription={noSubscription} setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
      </div>
    </Layout>
  );
};

Locations.displayName = 'Locations';
export default Locations;

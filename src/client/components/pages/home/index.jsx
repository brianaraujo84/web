import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Content from './content';
import Layout from '../../shared/layout';
import { useTitle } from '../../../hooks';
import * as URLS from '../../../urls';

const Home = () => {
  const { t } = useTranslation();
  useTitle(t('Get Started'));
  const history = useHistory();

  const locations = useSelector(state => state.locations.items);
 
  const navigateToLocations = () => {
    if (locations.length === 1) {
      const { locationId } = locations[0];
      history.replace(URLS.LOCATION(locationId));
    } else if (locations.length > 1) {
      history.replace(URLS.LOCATIONS);
    }
  };

  React.useEffect(() => {
    navigateToLocations();
  }, []);

  return (
    <Layout>
      <div className="content-wrapper">
        <div className="container pb-4">
          <Content />
        </div>
      </div>
    </Layout>
  );
};

Home.displayName = 'Home';
export default Home;

import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Layout from '../../shared/layout';
import { useTitle } from '../../../hooks';

import Content from './content';

const LocationsConfigureZones = () => {
  const { t } = useTranslation();
  useTitle(t('zones'));
  const { data = {} } = useLocation();
  const { isFirstTime = false, locationType } = data;

  return (
    <Layout>
      <div className="content-wrapper">
        <div className="container pt-3 pb-4">
          <div className="row justify-content-center">
            <div className="col-12 col-md-6">
              <Content isFirstTime={isFirstTime} locationType={locationType} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

LocationsConfigureZones.displayName = 'LocationsConfigureZones';
export default LocationsConfigureZones;

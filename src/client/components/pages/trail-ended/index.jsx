import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import Layout from '../../shared/layout';
import { useTitle } from '../../../hooks';
import * as URLS from '../../../urls';

const styles = {
  subscribe: {
    fontWeight: '300'
  },
};

const TrialEnded = () => {
  const { t } = useTranslation();
  const history = useHistory();
  useTitle(t('Trial Ended'));

  const navToBilling = async () => {
    history.replace(URLS.BILLING);
  };

  return (
    <Layout noheader blue>
      <div className="content-wrapper">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-9 col-md-5 col-lg-4 mt-5">
              <h2 className="text-center mb-4 mt-2">Trial ended.</h2>
              <p className="text-center lead">Your trial period has expired.</p>
              <p className="text-center" style={styles.subscribe}>Subscribe and have Confidence as the new member of your team!</p>
              <h1 className="text-center mb-1 mt-4">$103<small><small>/mo</small></small></h1>
              <p className="small text-center mb-4 font-weight-light">Based on your current usage.</p>
              <form>
                <button type="button" className="btn btn-outline-light btn-block" onClick={navToBilling}>View Summary</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

TrialEnded.displayName = 'TrialEnded';
export default TrialEnded;

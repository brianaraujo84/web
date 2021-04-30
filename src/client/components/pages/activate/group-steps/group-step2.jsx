import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Layout from '../../../shared/layout';
import { useTitle } from '../../../../hooks';
import * as URLS from '../../../../urls';
let pollCount = 0;

const GroupStep2 = ({ connectDevice }) => {
  const { t } = useTranslation();
  useTitle(t('GroupStep2'));
  const history = useHistory();
  const maxPolls = 9, pollTime = 3000;

  const onSuccess = () => {
    history.push(URLS.ACTIVATE('connected'));
  };
  const onFailure = () => {
    if (maxPolls === pollCount) {
      history.push(URLS.ACTIVATE('step5error'));
      return;
    }
    scheduleNextCall();
  };

  const scheduleNextCall = () => {
    setTimeout(() => {
      pollCount++;
      connectDevice().then(onSuccess, onFailure);
    }, pollTime);
  };

  React.useEffect(() => {
    connectDevice().then(onSuccess, onFailure);
    pollCount = 0;
  }, []);

  return (
    <Layout>
      <div className="container pb-4 bg-white content-wrapper">
        <div className="row row justify-content-center">
          <div className="col-11 col-md-6">
            <div className="mt-4">
              <div className="d-flex align-items-end mt-1">
                <div className="col-11 p-0 w-auto"><h1 className="m-0">Badge Activation</h1></div>
              </div>
              <div className="progress mt-2">
                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style={{width: '80%'}}></div>
              </div>
              <p className="my-3 lead mb-0 text-center">Your device is connecting to the Confidence Cloud. Please wait.</p>

              <div className="d-flex justify-content-center align-items-center text-primary mb-3">
                <div className="dot-elastic"></div>
                <p className="mb-0 ml-4">Reconnecting</p>
              </div>

              <div className="text-center text-primary">
                <img src="../../assets/img/device-setup/06.gif" height="340" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};


GroupStep2.propTypes = {
  connectDevice: PropTypes.func,
};
GroupStep2.defaultProps = {
  connectDevice: () => {},
};
GroupStep2.displayName = 'GroupStep2';
export default GroupStep2;

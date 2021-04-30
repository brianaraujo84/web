import React from 'react';
import PropTypes from 'prop-types';
import { useHistory, Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';

import Layout from '../../../shared/layout';
import { useTitle } from '../../../../hooks';
import * as URLS from '../../../../urls';
let pollCount = 0;

const ActivateStep4 = ({ connectDevice }) => {
  const { t } = useTranslation();
  useTitle(t('ActivateStep4'));
  const history = useHistory();
  const maxPolls = 9, pollTime = 3000, initialPollTime = 90000, timerSeconds = 119;

  const [counter, setCounter] = React.useState(timerSeconds);

  const onSuccess = () => {
    history.push(URLS.ACTIVATE('step5'));
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

  const calcTimeDelta = (time) => {
    const seconds = Math.abs(time);
    let sec = Math.floor(seconds % 60);
    sec = `0${sec}`.substr(-2);
    return `${Math.floor((seconds / 60) % 60)} : ${sec}`;
  };

  React.useEffect(() => {
    const pt = setTimeout(() => {
      connectDevice().then(onSuccess, onFailure);
    }, initialPollTime);
    pollCount = 0;

    const timerId = setInterval(() => {
      setCounter(c => c -1);
    }, 1000);

    return () => {
      clearInterval(timerId);
      clearInterval(pt);
    };
  }, []);

  return (
    <Layout>
      <div className="content-wrapper bg-white">
        <div className="col-11 col-md-6">
          <div className="mt-4">
            <div className="d-flex align-items-end mt-1">
              <div className="col-11 p-0 w-auto"><h1 className="m-0"><Trans i18nKey="device_setup" defaults="Device Setup" /></h1></div>
              <div className="col p-0 text-right text-primary">4/5</div>
            </div>
            <div className="progress mt-2">
              <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style={{width: '80%'}}></div>
            </div>
            <p className="mt-3 lead text-center mb-0">Your device is connecting to the Confidence Cloud.</p>
            <p className="mb-3 font-weight-light text-center">This may take up to 2 minutes.
              <span className="d-inline-block countdown border bg-light rounded text-primary ml-1 px-1" style={{minWidth: '50px'}}>{calcTimeDelta(counter)}</span>
            </p>
            <div className="text-center">
              <img className="ml-3" src="../../assets/img/device-setup/06.gif" height="260" />
            </div>
            <p className="mt-3 font-weight-light text-center">When your device displays "CONNECTED" <Link to={URLS.ACTIVATE('step5')}>click here</Link>.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

ActivateStep4.propTypes = {
  connectDevice: PropTypes.func,
};
ActivateStep4.defaultProps = {
  connectDevice: () => {},
};
ActivateStep4.displayName = 'ActivateStep4';
export default ActivateStep4;

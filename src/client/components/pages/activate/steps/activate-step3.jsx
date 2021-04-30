import React from 'react';
import { useHistory } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';

import Layout from '../../../shared/layout';
import { useTitle } from '../../../../hooks';
import * as URLS from '../../../../urls';


const ActivateStep3 = () => {
  const { t } = useTranslation();
  useTitle(t('ActivateStep3'));
  const history = useHistory();

  return (
    <Layout>
      <div className="content-wrapper bg-white">
        <div className="col-11 col-md-6">
          <div className="mt-4">
            <div className="d-flex align-items-end mt-1">
              <div className="col-11 p-0 w-auto"><h1 className="m-0"><Trans i18nKey="device_setup" defaults="Device Setup" /></h1></div>
              <div className="col p-0 text-right text-primary">3/5</div>
            </div>
            <div className="progress mt-2">
              <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{width: '60%'}}></div>
            </div>
            <p className="my-3 lead text-center">Gently insert the Activation Key until you feel a click, and keep it pressed until the screen starts flashing. Remove key. Screen will change to "Setup".</p>
            <div className="text-center">
              <img className="ml-3" src="../../assets/img/device-setup/05.gif" height="260" />
            </div>
            <div className="mt-4">
              <Button
                role="button"
                variant="primary"
                block
                className="text-white"
                onClick={() => history.push(URLS.ACTIVATE('step4'))}>
                  Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

ActivateStep3.displayName = 'ActivateStep3';
export default ActivateStep3;

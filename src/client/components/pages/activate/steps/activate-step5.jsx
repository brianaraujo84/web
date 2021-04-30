import React from 'react';
import { useHistory } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';

import Layout from '../../../shared/layout';
import { useTitle } from '../../../../hooks';
import * as URLS from '../../../../urls';


const ActivateStep5 = () => {
  const { t } = useTranslation();
  useTitle(t('ActivateStep5'));
  const history = useHistory();

  return (
    <Layout>
      <div className="content-wrapper bg-white">
        <div className="col-11 col-md-6">
          <div className="mt-4">
            <div className="d-flex align-items-end mt-1">
              <div className="col-11 p-0 w-auto"><h1 className="m-0"><Trans i18nKey="success" defaults="Success!" /></h1></div>
              <div className="col p-0 text-right text-primary">5/5</div>
            </div>
            <div className="progress mt-2">
              <div className="progress-bar progress-bar-striped bg-success" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={{width: '100%'}}></div>
            </div>
            <p className="my-3 lead text-center">Device is connected securely and successfully configured with the Confidence Cloud!</p>
            <div className="text-center">
              <img className="ml-3" src="../../assets/img/device-setup/07.gif" height="260" />
            </div>
            <div className="mt-4">
              <Button
                role="button"
                variant="primary"
                block
                className="text-white"
                onClick={() => history.push(URLS.ACTIVATE('connecting'))}>
                  Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

ActivateStep5.displayName = 'ActivateStep5';
export default ActivateStep5;

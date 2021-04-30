import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';

import Layout from '../../../shared/layout';
import { useTitle } from '../../../../hooks';


const ActivateStep5Error = () => {
  const { t } = useTranslation();
  useTitle(t('ActivateStep5Error'));

  return (
    <Layout>
      <div className="row row justify-content-center content-wrapper">
        <div className="col-11 col-md-6">
          <div className="mt-4">
            <div className="d-flex align-items-end mt-1">
              <div className="col-11 p-0 w-auto"><h1 className="m-0"><Trans i18nKey="could_not_connect" defaults="Couldn't Connect" /></h1></div>
            </div>
            <p className="my-3 lead text-center">Device could not connect to the Confidence Cloud. Please contact customer support.</p>
            <div className="text-center">
              <img className="ml-3" src="../../assets/img/device-setup/06-error.png" height="260" />
            </div>
            <div className="text-center border-top pt-3 mt-3">
              <p className="mb-2">Do you see an error on your device?</p>
              <Button
                role="button"
                variant="outline-primary"
                block
                disabled>
                <i className="far fa-tools" aria-hidden="true"></i> Troubleshooting
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

ActivateStep5Error.displayName = 'ActivateStep5Error';
export default ActivateStep5Error;

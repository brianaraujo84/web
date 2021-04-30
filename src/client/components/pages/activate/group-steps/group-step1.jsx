import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';

import Layout from '../../../shared/layout';
import { useTitle } from '../../../../hooks';
import * as URLS from '../../../../urls';


const GroupStep1 = () => {
  const { t } = useTranslation();
  useTitle(t('GroupStep1'));
  const history = useHistory();

  return (
    <Layout>
      <div className="container pb-4 bg-white content-wrapper">
        <div className="row row justify-content-center">
          <div className="col-11 col-md-6">
            <div className="mt-4">
              <h1 className="text-center mb-2 mt-4">Click Button</h1>

              <p className="my-3 lead mb-0 text-center">Insert Activation Key in reset button until you feel a click, then remove the key.</p>
              <div className="text-center">
                <img src="../../assets/img/device-setup/connected-click.gif" height="260"/>
              </div>
              <p className="mt-3 text-center">Your device will connect to the Confidence Cloud and display your badge.</p>
              <div className="mt-4">
                <Button
                  role="button"
                  variant="primary"
                  block
                  className="text-white"
                  onClick={() => history.push(URLS.ACTIVATE('gstep2'))}>
                    Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

GroupStep1.displayName = 'GroupStep1';
export default GroupStep1;

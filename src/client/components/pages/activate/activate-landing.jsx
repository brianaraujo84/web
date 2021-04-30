import React from 'react';
import { useHistory } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';

import Layout from '../../shared/layout';
import { useTitle } from '../../../hooks';
import * as URLS from '../../../urls';


const ActivateLanding = () => {
  const { t } = useTranslation();
  useTitle(t('ActivateLanding'));
  const history = useHistory();

  return (
    <Layout>
      <div className="content-wrapper">
        <div className="container pb-4 bg-white">
          <div className="row row justify-content-center">
            <div className="col-11 col-md-6 mt-4">
              <h1 className="text-center mb-4"><Trans i18nKey="devices" defaults="Devices"/></h1>
              <p className="lead text-center"><Trans i18nKey="devices_header_text" defaults="Devices make your space more connected and deliver peace of mind."/></p>
              <div className="text-center">
                <img src="../assets/img/device-outline.png" className="w-100" />
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row justify-content-center pt-3 pb-2 border-top" id="locations">
            <div className="col-12">
              <h4 className="text-center mb-4 mt-4"><Trans i18nKey="add_new_device" defaults="Add new device"/></h4>
              <div className="row">
                <div className="col pr-0">
                  <button className="btn-block py-3 btn btn-primary" onClick={() => history.push(URLS.ACTIVATE('scan'))}><Trans i18nKey="i_have_a_device" defaults="I have a device"/></button>
                </div>
                <div className="col">
                  <button className="btn-block py-3 btn btn-outline-secondary" disabled><Trans i18nKey="buy_a_device" defaults="Buy a device"/></button>
                </div>
              </div>
              <p className="text-center mt-4">
                <a role="button" className="text-primary" onClick={() => history.push(URLS.ADD_DEVICE)}><Trans i18nKey="add_a_virtual" defaults="Add a virtual smart display"/></a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

ActivateLanding.displayName = 'ActivateLanding';
export default ActivateLanding;

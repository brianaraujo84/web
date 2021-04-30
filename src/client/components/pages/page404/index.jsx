import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Layout from '../../shared/layout';
import { useTitle } from '../../../hooks';

const Page400 = () => {
  const { t } = useTranslation();
  useTitle(t('404 Error'));

  return (
    <Layout blue>
      <div className="content-wrapper">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-10 col-md-5 col-lg-4 mt-5">
              <h3 className="text-center mb-4 mt-2">
                <i className="fal fa-2x fa-frown" />
                <p className="text-center lead">
                  <Trans>Page Not Found</Trans>
                </p>
                <p className="text-center text-monospace font-weight-light">
                  <small>
                    <Trans>Error code: 404</Trans>
                  </small>
                </p>
                <Link className="btn btn-outline-light btn-block mt-5" to="/">
                  <Trans>Back to Home Screen</Trans>
                </Link>

              </h3>
            </div>
          </div>
        </div>
      </div>
    </Layout>

  );
};

Page400.displayName = 'Page400';
export default Page400;

import React from 'react';
import { useTranslation } from 'react-i18next';

import Layout from '../../shared/layout';
import { useTitle } from '../../../hooks';
import Content from './content';


const Signup = () => {
  const { t } = useTranslation();

  useTitle(t('Register'));

  return (
    <Layout nologin>
      <div className="content-wrapper">
        <div className="container pb-5 mt-4 pt-5">
          <div className="row row justify-content-center">
            <Content />
          </div>
        </div>
      </div>
    </Layout>
  );
};

Signup.displayName = 'Signup';
export default Signup;

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Layout from '../../shared/layout';
import { useTitle, useActionDispatch } from '../../../hooks';
import { getProfileData } from '../../../redux/actions/profile';

import Header from './header';
import Form from './form';
import Footer from './footer';
import Company from './company';

const Account = () => {
  const { t } = useTranslation();
  useTitle(t('Account'));
  const loadUser = useActionDispatch(getProfileData);
  const profile = useSelector(state => state.profile.data);

  const {
    isOwner,
    company,
  } = profile;

  React.useEffect(() => {
    loadUser();
  }, []);

  return (
    <Layout>
      <div className="content-wrapper">
        <div className="container pb-4">
          <Header />
          <hr className="mt-0" />
          <Form />
          {(isOwner && !!company && !!company.address) && (
            <>
              <hr className="mt-0" />
              <Company />
            </>
          )}
          <hr className="mt-0" />
          <Footer />
        </div>
      </div>
    </Layout>

  );
};

Account.displayName = 'Account';
export default Account;

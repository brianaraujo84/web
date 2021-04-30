import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import Layout from '../../shared/layout';
import { useTitle } from '../../../hooks';

import Content from './content';

const SelectWorkspace = () => {
  const { t } = useTranslation();
  useTitle(t('Select Workspace'));

  return (
    <Layout>
      <div className="content-wrapper">
        <Content />
      </div>
    </Layout>
  );
};

SelectWorkspace.propTypes = {
  location: PropTypes.object,
};

SelectWorkspace.displayName = 'SelectWorkspace';

export default SelectWorkspace;

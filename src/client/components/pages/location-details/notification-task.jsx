import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import Layout from '../../shared/layout';
import { useTitle } from '../../../hooks';

import { useActionDispatch } from '../../../hooks';
import { resetObject } from '../../../redux/actions/object';
import { resetList } from '../../../redux/actions/objects';

import Content from './content';
import Tasks from './tasks';

const OBJECT_LOСATION = 'location';
const OBJECT_TASKS = 'tasks';

const NotifyTaskDetails = () => {
  const { t } = useTranslation();
  const { pathname = '' } = useLocation();

  const isTM = pathname.includes('/location-notify-my');
  const resetLocation = useActionDispatch(resetObject(OBJECT_LOСATION));
  const resetTasks = useActionDispatch(resetList(OBJECT_TASKS));

  useTitle(t('loc_details'));

  React.useEffect(() => {
    return () => {
      resetLocation();
      resetTasks();
    };
  }, []);

  const loading = useSelector(state => {
    return !state.loc || state.loc.initialLoading
      || !state.tasks || state.tasks.initialLoading;
  });

  return (
    <Layout>
      <div className="content-wrapper">
        <div className="pt-3 bg-white">
          <Content isLoading={loading} my isNotifyPage />
        </div>
        <Tasks isLoading={loading} my={isTM} isNotifyPage />
      </div>
    </Layout>
  );
};

NotifyTaskDetails.displayName = 'NotifyTaskDetails';
export default NotifyTaskDetails;

import React from 'react';
import { useTranslation } from 'react-i18next';

const NoMatchingWorkspaces = () => {
  const { t } = useTranslation();

  return (
    <div className="col-12 p-0 text-center mt-3">
      <img src="assets/img/empty.png" width="200" />
      <em className="d-block text-secondary my-4">{t('You don\'t have any matching workspaces. Please try a different search.')}</em>
    </div>
  );
};

NoMatchingWorkspaces.displayName = 'NoMatchingWorkspaces';

export default NoMatchingWorkspaces;

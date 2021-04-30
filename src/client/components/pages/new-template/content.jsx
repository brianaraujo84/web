import React from 'react';
import { Trans } from 'react-i18next';

import Form from './form';

const Content = () => {
  return (
    <>
      <div className="row">
        <div className="d-flex">
          <div className="pl-2">
            <h1><Trans>Create New Template</Trans></h1>
          </div>
        </div>
      </div>
      <Form />
    </>
  );
};

Content.displayName = 'NewTemplateContent';

export default Content;

import React from 'react';
import PropTypes from 'prop-types';

import Form from './form';
import { _postObject } from '../../../services/services';

const Content = ({ template, getTemplates, taskCount }) => {
  const [status, setStatus] = React.useState(template.templateDetails?.status);

  const handleStatusBtnChange = async () => {
    const data = {
      templateId: template.templateDetails.templateId,
      templateName: template.templateDetails.templateName,
      status: !status,
    };
    setStatus(data?.status);
    await _postObject('v1/confidence/reference/template', data);
  };

  return (
    <>
      <div className="row">
        <div className="w-100 mb-2">
          {status ? (
            <div className="alert alert-info mb-0" id="status-active">
              <div className="d-flex align-items-center">
                <div className="col-100 p-0">
                  <h4 className="alert-heading"><small>Status:</small> Active</h4>
                  <p className="mb-0">This template is <strong>Active</strong> and available to users in the Confidence Marketplace. Changes you make are going to take effect immediately.</p>
                </div>
                <div className="col ml-4 p-0 text-right">
                  <button className="btn btn-danger" onClick={handleStatusBtnChange} data-target="#inactivate-template-modal">Inactivate</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="alert alert-danger mb-0" id="status-inactive">
              <div className="d-flex align-items-center">
                <div className="col-100 p-0">
                  <h4 className="alert-heading"><small>Status:</small> Inactive</h4>
                  <p className="mb-0">You need to <strong>add at least one task</strong> in order to be able to activate and make it available to users in the Confidence Marketplace.</p>
                </div>
                <div className="col ml-4 p-0 text-right">
                  <button className="btn btn-info" onClick={handleStatusBtnChange} data-target="#activate-template-modal">Activate</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {template && template.templateDetails && <Form status={status} template={template.templateDetails} getTemplates={getTemplates} taskCount={taskCount} />}
    </>
  );
};

Content.propTypes = {
  template: PropTypes.object,
  getTemplates: PropTypes.func,
  taskCount: PropTypes.string
};

Content.displayName = 'TemplateDetailsContent';

export default Content;

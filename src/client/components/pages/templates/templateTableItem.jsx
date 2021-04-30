import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import * as URLS from '../../../urls';
const styles = {
  img: {
    width: '40px',
    height: '40px',
  },
};

const TemplateTableItem = ({ template }) => {
  return (
    <tr>
      <td>
        {template && <Link className='d-flex align-items-center' to={URLS.TEMPLATE_DETILAS(template.templateId)}>
          <img className='rounded border mr-2' src={`/api/files/template/${template.templateId}/logo/thumbnail.png`} style={styles.img} />
          {template && template.templateName && template.templateName.length > 57 ? template.templateName.slice(0, 57) + '...' : template.templateName}
        </Link>}
      </td>
      <td>{template.status ? 'Active' : 'Inactive'}</td>
      {template && template.author ? <td>{template.author.slice(0, 22) + '...'}</td> : <td/> }
      <td>{template.locationType}</td>
      <td>
        <Link to={URLS.TEMPLATE_TASKS(template.templateId)}>View Tasks</Link>
      </td>
    </tr>
  );
};

TemplateTableItem.propTypes = {
  template: PropTypes.object,
  locationType: PropTypes.string,
  setShowTemplateTasks: PropTypes.func,
};

TemplateTableItem.displayName = 'TemplateTableItem';

export default TemplateTableItem;

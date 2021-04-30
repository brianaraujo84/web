import React from 'react';
import PropTypes from 'prop-types';
import { classnames } from 'react-form-dynamic';
import { Link } from 'react-router-dom';
import { Trans } from 'react-i18next';

const Breadcrumbs = ({ breadcrumbs }) => {
  return (
    <nav id="breadcrumb" aria-label="breadcrumb">
      <ol className="breadcrumb">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index} className={classnames(['breadcrumb-item', index === breadcrumbs.length - 1 && 'active'])}>
            {index < breadcrumbs.length - 1 ? (<Link to={breadcrumb.to}><Trans>{breadcrumb.name}</Trans></Link>) : (<Trans>{breadcrumb.name}</Trans>)}
          </li>))}
      </ol>
    </nav>
  );
};
Breadcrumbs.propTypes = {
  breadcrumbs: PropTypes.array,
};
Breadcrumbs.defaultProps = {
  breadcrumbs: []
};

Breadcrumbs.displayName = 'Breadcrumbs';
export default Breadcrumbs;

import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Trans } from 'react-i18next';
import PropTypes from 'prop-types';

import { useActionDispatch } from '../../../hooks';
import { setObject, resetObject } from '../../../redux/actions/object';
import * as URLS from '../../../urls';

const NEW_TEMPLATE = 'newTemplate';
const LOCATION_TYPE = 'locationType';

const ProductDetails = ({ template, noAvailableWorkspaces }) => {
  const { templateId } = useParams();
  const history = useHistory();

  const getImageUri = (templateId) => {
    return `/api/files/template/${templateId}/logo/thumbnail.png`;
  };

  const newTemplateData = useSelector(state => state.newTemplate?.data);
  const updateTemplateData = useActionDispatch(setObject(NEW_TEMPLATE));
  const saveLocationType = useActionDispatch(setObject(LOCATION_TYPE));
  const clearLocationType = useActionDispatch(resetObject(LOCATION_TYPE));

  const locations = useSelector(state => state.locations?.items);

  const handleClickUse = () => {
    clearLocationType();
    const data = { ...newTemplateData };
    data.selectedTemplate = template;
    updateTemplateData(data);
    if (locations.length === 0) {
      history.push(URLS.ADD_LOCATION);
    } else {
      history.push(URLS.SELECT_WORKSPACE);
    }
  };

  const navToAddWorkspace = () => {
    saveLocationType(template?.templateDetails?.locationType);
    history.push(URLS.ADD_LOCATION, { locationType: template?.templateDetails?.locationType });
  };

  const getScreenShotOneUri = (templateId) => {
    return `/api/files/template/${templateId}/screenshotOne/6`;
  };

  const getScreenShotTwoUri = (templateId) => {
    return `/api/files/template/${templateId}/screenshotTwo/6`;
  };

  const getScreenShotThreeUri = (templateId) => {
    return `/api/files/template/${templateId}/screenshotThree/6`;
  };

  return (
    <>
      <div className='container pt-3'>
        <div className="row justify-content-center">
          <div className="col-4 col-md-2">
            <img
              src={getImageUri(templateId)}
              alt="Card image cap"
              width="100%"
              className="border rounded"
            />
          </div>
          <div className="col-8 col-md-10 pl-0">
            <h4>{template?.referenceTemplateName}</h4>
            <p style={{ lineHeight: '110%' }}>
              <small>{template?.templateDetails?.templateShortDescription}</small>
            </p>
          </div>
        </div>

        <div className="row justify-content-center mt-3 pb-3">
          <div className="col text-left">
            <button
              id="use_template_btn"
              className={`btn btn-block btn-outline-primary ${noAvailableWorkspaces ? 'disabled' : ''}`}
              onClick={noAvailableWorkspaces ? undefined : handleClickUse}
            >
              <Trans i18nKey="use_prod" />
            </button>
            {noAvailableWorkspaces && <div className="alert alert-primary mt-2 mb-0 px-3">
              <i className="fas fa-info-circle" aria-hidden="true"></i>
              <span> A <strong>{template?.templateDetails?.locationType}</strong> workspace is required to use this template.</span>
              <hr className="my-2" />
              <a onClick={navToAddWorkspace} href="#" className="btn btn-sm btn-outline-primary">Create one now</a>
            </div>}
          </div>
        </div>
      </div>
      <div className="bg-light pt-3 pb-2 border-top">
        <div className="container">
          <h5><Trans >About this Product</Trans></h5>
          <p className="mb-2">{template?.templateDetails?.templateDescription}</p>
          <div className="pb-2">
            {template?.templateDetails?.searchTags?.split(', ').length >= 1 && <span className="badge badge-pill badge-primary"><Trans >{template?.templateDetails?.searchTags?.split(', ')[0] || ''}</Trans></span>}
            {' '}
            {template?.templateDetails?.searchTags?.split(', ').length >= 2 && <span className="badge badge-pill badge-primary"><Trans >{template?.templateDetails?.searchTags?.split(', ')[1] || ''}</Trans></span>}
            {' '}
            {template?.templateDetails?.searchTags?.split(', ').length >= 3 && <span className="badge badge-pill badge-primary"><Trans >{template?.templateDetails?.searchTags?.split(', ')[2] || ''}</Trans></span>}
            {' '}
          </div>
        </div>
      </div>

      {/** image carousol */}
      <div className='bg-dark text-light pt-4 pb-4 border-top border-bottom'>
        <div id="template-screenshots" className="container">
          <div className="screenshot border d-inline-block mr-3">
            <img 
              src={getScreenShotOneUri(templateId)} 
              onError={(e)=>{e.target.onerror = null; e.target.src='/assets/img/screenshots/1.png';}} 
            />
          </div>
          <div className="screenshot border d-inline-block mr-3">
            <img 
              src={getScreenShotTwoUri(templateId)}
              onError={(e)=>{e.target.onerror = null; e.target.src='/assets/img/screenshots/2.png';}} 
            />
          </div>
          <div className="screenshot border d-inline-block mr-3">
            <img 
              src={getScreenShotThreeUri(templateId)}
              onError={(e)=>{e.target.onerror = null; e.target.src='/assets/img/screenshots/3.png';}} 
            />
          </div>
        </div>
      </div>

      {!!template?.templateDetails?.abouttheAuthor && (
        <div className="justify-content-center pt-3 pb-2">
          <div className="container">
            {template?.templateDetails?.author && <h5><Trans i18nKey="About " />{template?.templateDetails?.author}</h5>}
            <p className="mb-2">{template?.templateDetails?.abouttheAuthor}</p>
          </div>
        </div>
      )}
    </>
  );
};

ProductDetails.propTypes = {
  template: PropTypes.object,
  noAvailableWorkspaces: PropTypes.bool,
};

ProductDetails.displayName = 'ProductDetails';
export default ProductDetails;

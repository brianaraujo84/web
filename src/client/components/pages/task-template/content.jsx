import React from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Trans } from 'react-i18next';
import PropTypes from 'prop-types';

import { useActionDispatch } from '../../../hooks';
import { getStandardObject } from '../../../redux/actions/object';
import { postConfidenceObject, resetObject, setObject } from '../../../redux/actions/object';
import * as URLS from '../../../urls';
import { DateUtils, TextUtils } from '../../../utils';

const OBJECT_LOСATION = 'location';
const OBJECT_AGGREGATES_GRP = 'group';
const NEW_TEMPLATE = 'newTemplate';
const Content = ({ template }) => {
  const { locationId, templateId } = useParams();
  const { search = '' } = useLocation();
  const { flow = '' } = TextUtils.getQueryParams(search);
  const history = useHistory();

  const getLocation = useActionDispatch(getStandardObject(OBJECT_LOСATION, undefined, undefined, '/summary'));
  const customTemplate = useActionDispatch(postConfidenceObject(OBJECT_AGGREGATES_GRP));
  const clearTemplateData = useActionDispatch(resetObject(NEW_TEMPLATE));
  const groupMenuUpdate = useActionDispatch(setObject('groupMenuUpdate'));

  const newTemplateData = useSelector(state => state.newTemplate.data);

  const updateSideGroupList = () => {
    groupMenuUpdate({update: true});
    setTimeout(() => {
      groupMenuUpdate({update: undefined});
    },500);
  };

  const handleClickUse = async () => {
    const date = new Date();
    const data = { 
      locationId,
      templateName: template.referenceTemplateName,
      sourceTemplateId: templateId,
      targetTemplateId: newTemplateData.taskTemplateId,
      templateType: 'Main',
      taskRecurring: {
        timeZone: DateUtils.getCurrentTZName(),
        recurringType: 'OneTime',
        startDate: DateUtils.unicodeFormat(date, 'yyyy-MM-dd'),
        startTime: DateUtils.roundToNextMinutes(new Date()),
        endTime: DateUtils.roundToNextMinutes(DateUtils.addMinutes(new Date(), 30)),
      },
    };
    const { templateId: newtemplateId } = await customTemplate(data);
    clearTemplateData();
    updateSideGroupList();
    if (flow === 'devices') {
      history.push({ pathname: URLS.ACTIVATE('groups', locationId), search: `newtemplateId=${newtemplateId}` });
    } else {
      history.push(URLS.TASK_DETAILS(locationId, newtemplateId), { newGroup: true });
    }
  };

  const getImageUri = (templateId) => {
    return `/api/files/template/${templateId}/logo/thumbnail.png`;
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

  React.useEffect(() => {
    getLocation(locationId);
  }, []);

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

        <div className="row justify-content-center mt-2 pb-3">
          <div className="col text-left">
            <button
              id="use_template_btn"
              className="btn btn-block btn-outline-primary"
              onClick={handleClickUse}
            >
              <Trans i18nKey="use_template" />
            </button>
          </div>
        </div>
      </div>
      <div className="bg-light pt-3 pb-2 border-top">
        <div className="container">
          <h5><Trans >About this Template</Trans></h5>
          <p className="mb-2">{template?.templateDetails?.templateDescription}</p>
          <div className="pb-2">
            {template?.templateDetails?.searchTags?.split(', ').length >= 1 && <span className="badge badge-pill badge-primary"><Trans >{template?.templateDetails?.searchTags.split(', ')[0] || ''}</Trans></span>}
            {' '}
            {template?.templateDetails?.searchTags?.split(', ').length >= 2 && <span className="badge badge-pill badge-primary"><Trans >{template?.templateDetails?.searchTags.split(', ')[1] || ''}</Trans></span>}
            {' '}
            {template?.templateDetails?.searchTags?.split(', ').length >= 3 && <span className="badge badge-pill badge-primary"><Trans >{template?.templateDetails?.searchTags.split(', ')[2] || ''}</Trans></span>}
            {' '}
          </div>
        </div>
      </div>

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

Content.propTypes = {
  template: PropTypes.object,
};

Content.displayName = 'TaskTemplateContent';
export default Content;

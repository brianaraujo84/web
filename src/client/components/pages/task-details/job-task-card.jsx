import React from 'react';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { useActionDispatch } from '../../../hooks';
import { getJobActivityImages } from '../../../redux/actions/files';
import * as URLS from '../../../urls';
import TaskImage from '../../shared/task-image';
import { preloadImage } from '../../../utils';
import { _getObject } from '../../../services/services';
import { TaskStatus } from '../../../constants';

const JobTaskCard = ({ task, taskSummary, taskIdx, templateImageObj, showFirstTask, isOnLocationDetailsPage, locationUserRole, templateNumberStore }) => {
  const { locationId } = useParams();
  const history = useHistory();
  const { t } = useTranslation();

  const [showMore, setShowMore] = React.useState(showFirstTask);
  const [activityImages, setActivityImages] = React.useState([]);
  const [activityImagesLoaded, setActivityImagesLoaded] = React.useState(false);
  const [isReviewing, setIsReviewing] = React.useState(false);
  const [preloadTplUrl, setPreloadedTemplateImageObj] = React.useState(false);
  const [templateImageObjLocDetailsPage, setTemplateImageObjLocDetailsPage] = React.useState(null);
  const [zoneName, setZoneName] = React.useState('');

  const { assignee } = isOnLocationDetailsPage ? task : taskSummary;

  const getTaskActivityImagesList = useActionDispatch(getJobActivityImages);

  const locationZones = useSelector(state => state.locationZones.items);

  const isInProgressTask = React.useMemo(() => {
    return task.stage && 'in progress' === task.stage.toLowerCase();
  }, [task.stage]);

  const isReviewTask = React.useMemo(() => {
    return task.stage && 'review' === task.stage.toLowerCase();
  }, [task.stage]);

  const isCompletedTask = React.useMemo(() => {
    return task.stage && TaskStatus.completed === task.stage.toLowerCase();
  }, [task.stage]);

  const isRejectedTask = React.useMemo(() => {
    return task.stage && TaskStatus.rejected === task.stage.toLowerCase();
  }, [task.stage]);

  const isReworkTask = React.useMemo(() => {
    return task.stage && 'rework' === task.stage.toLowerCase();
  }, [task.stage]);

  const isIncompleteTask = React.useMemo(() => {
    return task.stage && TaskStatus.incomplete === task.stage.toLowerCase();
  }, [task.stage]);

  const cardColor = React.useMemo(() => {
    return (isReviewTask || isReviewing) ? 'success' : isInProgressTask ? 'primary' : isReworkTask ? 'warning' : (isCompletedTask || isRejectedTask || isIncompleteTask) ? 'dark' : 'secondary';
  }, [isInProgressTask, isReviewTask, isReworkTask, isReviewing]);

  const loadActivityImages = async () => {
    if (task.jobActivityId && task.taskActivityTrackerId) {
      const images = await getTaskActivityImagesList(task.jobActivityId, task.taskActivityTrackerId);
      setActivityImages(images.list);
      setActivityImagesLoaded(true);
    } 
  };

  const showMoreSection = () => {
    if (!activityImagesLoaded) {
      loadActivityImages();
    }
    setShowMore(show => !show);
  };

  const getTaskNumber = (templateId, locationZoneId, sequenceOrder) => {
    if (isOnLocationDetailsPage) {
      const isIdAllocated = templateNumberStore[templateId];
      const isZoneIdAllocated = isIdAllocated && templateNumberStore[templateId][locationZoneId];
      const isNumAllocated = isZoneIdAllocated && templateNumberStore[templateId][locationZoneId][sequenceOrder];
      if (!isIdAllocated) {
        templateNumberStore[templateId] = {};
      }
      if (!isZoneIdAllocated) {
        templateNumberStore[templateId][locationZoneId] = {};
      }

      if (!isNumAllocated) {
        const currentLength = Object.keys(templateNumberStore[templateId][locationZoneId]).length;
        templateNumberStore[templateId][locationZoneId][sequenceOrder] = currentLength + 1;
      }
      return templateNumberStore[templateId][locationZoneId][sequenceOrder];
    }
  };

  React.useMemo(() => {
    if (locationZones.length && task.locationZoneId) {
      const zoneNameList = locationZones.filter(zone => zone.id === task.locationZoneId);
      if (zoneNameList[0] && zoneNameList[0].label  && zoneNameList[0].type) {
        setZoneName(`${zoneNameList[0].type} "${zoneNameList[0].label}"`);
      }  
      if (zoneNameList[0] && zoneNameList[0].type && !zoneNameList[0].label) {
        setZoneName(zoneNameList[0].type);
      }
    }
  }, [locationZones, task.locationZoneId]);

  const [templateImageUrl, templateOriginImageUrl] = React.useMemo(() => {
    if (templateImageObj) {
      const tplUrl = URLS.TEMPLATE_IMAGE_THUMB(templateImageObj.referenceTemplateId, templateImageObj.taskIdMapping[task.taskId]);
      const tplOriginUrl = URLS.TEMPLATE_IMAGE(templateImageObj.referenceTemplateId, templateImageObj.taskIdMapping[task.taskId]);
      preloadImage(tplUrl, () => setPreloadedTemplateImageObj(true));
      preloadImage(tplOriginUrl, ()=>{});
      return [
        tplUrl,
        tplOriginUrl
      ];
    }
    if (templateImageObjLocDetailsPage) {
      const tplUrl = URLS.TEMPLATE_IMAGE_THUMB(templateImageObjLocDetailsPage.referenceTemplateId, templateImageObjLocDetailsPage.taskIdMapping[task.taskId]);
      const tplOriginUrl = URLS.TEMPLATE_IMAGE(templateImageObjLocDetailsPage.referenceTemplateId, templateImageObjLocDetailsPage.taskIdMapping[task.taskId]);
      preloadImage(tplUrl, () => setPreloadedTemplateImageObj(true));
      preloadImage(tplOriginUrl, ()=>{});
      return [
        tplUrl,
        tplOriginUrl
      ];
    }
    return [];
  }, [templateImageObj, templateImageObjLocDetailsPage]);

  React.useEffect(() => {
    if (history?.state?.state?.reviewing && history?.state.state?.reviewing === true) {
      setIsReviewing(true);
      showMoreSection();
      // loadActivityImages();
    } 
  },[history]);

  const loadTemplateImage = async () => {
    const response = await _getObject(`v1/confidence/template/${task.templateId}/reference`);
    setTemplateImageObjLocDetailsPage(response);
  };

  React.useEffect(() => {
    if (isOnLocationDetailsPage && !templateImageObjLocDetailsPage) {
      loadTemplateImage();
    }
    if (!setShowMore) {
      setShowMore(true);
    }
  },[templateImageObjLocDetailsPage]);


  return (
    <>
      <div className={`task alert alert-${cardColor} p-0`} key={taskIdx}>
        {task.sequenceOrder && <a className={'p-1 text-center task-status d-block text-white rounded-left'} style={{ minHeight: '60px' }}>
          <Trans i18nKey="step" /> {!isOnLocationDetailsPage ? task.sequenceOrder : getTaskNumber(task.templateId, task.locationZoneId, task.sequenceOrder)}
        </a>}
        <div className="p-2">
          <div className='d-flex'>
            <div className="col p-0">
              <a onClick={() => history.push({pathname: URLS.TASK_DETAILS(locationId, task.templateId, 'tm'), state: { templateType: task.templateType }})} className="badge badge-light border border-primary text-primary zone-badge">{task.templateName}</a>
            </div>
            {task.stage && <div className="col p-0 d-flex justify-content-end">
              <span className="badge border-primary border text-primary zone-badge">{t(task.stage.replace(/\s/g, ' '))}</span>
            </div>}
          </div>
          {zoneName && <p className="mb-2">
            <span className="badge badge-primary zone-badge">{zoneName}</span>
          </p>}
          <h5 className="alert-heading mb-1" data-target="task-title">{task.task} </h5>
          {
            showMore && (
              <div className="task-detail-overflow pt-2 collapse show">
                {
                  !!task.taskDescription && (
                    <div className="task-description pt-1">
                      <div className="task-subtitle">
                        <div className="view d-flex">
                          <i className="fas fa-align-left pt-1" aria-hidden="true"></i>
                          <span className="sr-only">Task Description</span>
                          <div dangerouslySetInnerHTML={{__html: task.taskDescription}} className='small line-height-1 ml-2 mb-0 task-description' />
                        </div>
                      </div>
                    </div>
                  )
                }
                {!!task.imageRequired && (
                  <div className="d-flex small mb-2 mt-2 align-items-center">
                    <span>
                      <i className="fas fa-check-square lineitem-icon" aria-hidden="true"></i>
                      <span className="sr-only">{`${task.imageRequired === 1 ? 'Image' : 'Screenshot'} Verification`}</span>
                    </span>
                    {
                      task.imageRequired === 1
                        ? <Trans i18nKey="photo_required_for_verification" defaults="Photo required for verification" />
                        : <Trans i18nKey="screenshot_required_for_verification" defaults="Screenshot required for verification" />
                    }
                  </div>
                )}
                {
                  !!templateImageUrl && !!preloadTplUrl && (
                    <div className="task-images pt-3">
                      <h6><Trans i18nKey="task_imgs" /></h6>
                      <TaskImage
                        url={templateImageUrl}
                        originUrl={templateOriginImageUrl}
                        data-target="task-image"
                        task={task}
                      />
                    </div>
                  )
                }
                {
                  !!activityImages && !!activityImages.length && (
                    <div className="task-images pt-3">
                      <h6><Trans i18nKey="imgs_submitted" /> { assignee }</h6>
                      {
                        activityImages.map((image, i) => (
                          <TaskImage
                            key={i}
                            url={image.url}
                            originUrl={image.originUrl}
                            data-target="task-image"
                            task={task}
                            showImageScore={i === 0}
                          />
                        ))
                      }

                    </div>
                  )
                }
              </div>
            )
          }
          <hr className="my-2" />
          <div className="text-right">
            {task.stage === 'Review' && isOnLocationDetailsPage && (locationUserRole === 'Owner' || locationUserRole === 'Manager') && 
              <button
                type='button'
                className='p-1 px-3 ml-1 btn rounded-pill btn-outline-primary'
                data-target='expand-review-button'
                onClick={() => history.push({pathname: URLS.TASK_DETAILS(locationId, task.templateId), state: {templateType: task.templateType }})}
              >
                <Trans i18nKey="review" />
              </button>
            }
            { 
              showMore && (
                <Button
                  onClick={showMoreSection}
                  type="button"
                  variant="outline-primary"
                  className="task-c-button p-1 ml-1 btn rounded-circle task-detail-toggle show">
                  <i className="fas fa-chevron-up" aria-hidden="true" />
                </Button>
              )
            }
            { 
              !showMore && (
                <Button
                  onClick={showMoreSection}
                  type="button"
                  variant="outline-primary"
                  className="task-c-button p-1 ml-1 btn rounded-circle task-detail-toggle collapsed">
                  <i className="fas fa-chevron-down" aria-hidden="true" />
                </Button>
              )
            }
          </div>
        </div>
      </div>
    </>
  );
};

JobTaskCard.propTypes = {
  taskSummary: PropTypes.object,
  templateImageObj: PropTypes.object,
  task: PropTypes.object.isRequired,
  taskIdx: PropTypes.number.isRequired,
  onDelete: PropTypes.func,
  showFirstTask: PropTypes.func,
  isOnLocationDetailsPage: PropTypes.bool,
  locationUserRole: PropTypes.string,
  templateNumberStore: PropTypes.object,
};
JobTaskCard.defaultProps = {
  templateImageObj: null,
  showFirstTask: false,
  templateNumberStore: {},
};
JobTaskCard.displayName = 'JobTaskCard';
export default JobTaskCard;

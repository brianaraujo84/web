import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { classnames } from 'react-form-dynamic';
import { useTranslation, Trans } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { Bar } from 'react-chartjs-2';
import VisibilitySensor from 'react-visibility-sensor';
import { useActionDispatch } from '../../../hooks';
import { postConfidenceObject } from '../../../redux/actions/object';
import * as URLS from '../../../urls';
import { typeIcon, ChartUtils } from '../../../utils';

const OBJECT_AGGREGATES = 'task';
const OBJECT_AGGREGATES_GRP = 'group';
let nav_to_group = false;

const Location = ({
  location,
  index,
}) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [stats, setStats] = React.useState([]);
  const [numberofTasks, setNumberofTasks] = React.useState([]);
  const [numberofMyTasks, setNumberofMyTasks] = React.useState([]);
  const [isAllTasksSelected, setIsAllTasksSelected] = React.useState(false);
  const getAggregateCounts = useActionDispatch(postConfidenceObject(OBJECT_AGGREGATES, undefined, undefined, '/aggregate'));

  const customTemplate = useActionDispatch(postConfidenceObject(OBJECT_AGGREGATES_GRP));
  const profile = useSelector(state => state.profile.data);

  const locRef = React.useRef(null);
  const [isVisible, setIsVisible] = React.useState(false);

  const {
    locationName = t('home'),
    active,
    address = {},
    locationId,
    locationDetails,
    locationType,
    newLocation,
  } = location;

  const handleWorkspaceCardClick = ({ createGroup, event }) => {
    if (createGroup) {
      nav_to_group = true;
      handleCreateGroupClick();
    } else if (!createGroup) {
      handleCreatedByYouClick(event);
    }
  };

  const handleCreatedByYouClick = (event, type) => {
    if (nav_to_group === true) {
      return;
    }
    if (event) {
      history.push({ pathname: URLS.LOCATION(locationId), data: { filterType: type } });
    }
  };

  const handleAssignedToYouClick = (event, type) => {
    if (event) {
      history.push({ pathname: URLS.LOCATION_ASSIGNED_TO_YOU(locationId), data: { filterType: type } });
    }
  };

  const isInViewport = (visible) => {
    if (visible) {
      setIsVisible(visible);
    }
  };

  const onBarClick = (event, type) => {
    if (event) {
      handleCreatedByYouClick(true, type);
    }
  };

  const handleCreateGroupClick = async () => {
    const dataUpdated = {
      jobManager: profile.username,
      locationId,
      templateName: 'New Group',
    };
    const { templateId } = await customTemplate(dataUpdated);
    if (templateId) {
      history.push({
        pathname: URLS.TASK_DETAILS(locationId, templateId), data: { isFirstTime: true, templateType: 'Custom' }
      });
    }
    address;
  };

  const onBarClickAssigned = (event, type) => {
    if (event) {
      handleAssignedToYouClick(true, type);
    }
  };

  const handleTasksBarClick = (value) => {
    if ((value === 'ALL_TASKS' && isAllTasksSelected) || (value === 'MY_TASKS' && !isAllTasksSelected)) {
      return;
    } else {
      setIsAllTasksSelected(!isAllTasksSelected);
    }
  };

  React.useEffect(() => {
    if (isVisible) {
      getAggregateCounts({ locationId, selfAssigned: !isAllTasksSelected }).then((data) => {
        const stats = [data.open, data.assigned, data.inprogress, data.review, data.accepted, data.declined, data.rework];
        setStats(stats);
        const total = stats.reduce((s, total) => total += s);
        if (isAllTasksSelected) {
          setNumberofTasks(total);
        } else {
          setNumberofMyTasks(total);
        }
      });
    }
  }, [isAllTasksSelected, isVisible]);

  React.useEffect(() => {
    if (!newLocation && !isAllTasksSelected && !numberofMyTasks) {
      handleTasksBarClick('ALL_TASKS');
    }
  }, [numberofMyTasks, newLocation]);

  return (
    <>
      <VisibilitySensor onChange={isInViewport} partialVisibility >
        <div
          className={classnames(['card location-card w-100', index && 'mt-3'])}
          data-target="location-container"
          ref={locRef}
          style={{ height: 'auto', overflowY: 'auto', overflowX: 'hidden' }}
        >
          <div className="d-flex align-items-center" onClick={event => handleWorkspaceCardClick({ createGroup: false, event })}>
            <div className="w-100 pl-2 pr-0 d-flex align-items-center py-3">
              <div className="space-icon small border text-primary rounded-circle text-center bg-light mr-2" style={{ background: 'url("")' }}>
                <span aria-hidden="true">
                  <i className={`fad ${typeIcon(locationType)} ${active && 'text-primary'}`} aria-hidden="true"></i>
                </span>
              </div>
              <div>
                <h6 className="mb-0 location-business-name cursor-pointer">{`${locationType === 'Home' ? t('home') : locationName}`}</h6>
                <p className="text-secondary mb-0 location-business-location-name"><small>{locationDetails}</small></p>
              </div>
            </div>
            <div className="d-flex w-auto p-3 text-right">
              <a onClick={() => handleWorkspaceCardClick({ createGroup: true })} href="#" role="button">
                <i className="fal fa-2x fa-file-plus" aria-hidden="true"></i>
                <span className="sr-only">Create List</span>
              </a>
            </div>
          </div>
          <div className="card-body p-0 text-center text-primary">
            {!newLocation && <p className="small text-with-line mb-0">
              <span className={`border border-primary rounded-left p-1 ${!isAllTasksSelected ? 'bg-primary text-white' : 'bg-white text-primary'}`} onClick={() => handleTasksBarClick('MY_TASKS')}>MY TASKS</span>
              <span className={`border border-primary rounded-right p-1 ${isAllTasksSelected ? 'bg-primary text-white' : 'bg-white text-primary'}`} onClick={() => handleTasksBarClick('ALL_TASKS')}>ALL TASKS</span>
            </p>}
            {newLocation &&
              <>
                <p className="small text-with-line mb-0">
                  <span className="border border-primary rounded p-1 bg-primary text-white">NEW WORKSPACE</span>
                </p>
                <div className="row">
                  <div className="col pt-4 pb-3">
                    <div className="px-3">
                      <a className="btn btn-block btn-outline-primary" onClick={handleCreatedByYouClick}>Start</a>
                    </div>
                  </div>
                </div>
              </>
            }
            {!isAllTasksSelected && !newLocation &&
              <div className="row">
                {numberofMyTasks ?
                  <div className="col" id="my-tasks-1">
                    <Bar data={ChartUtils.tasksChartData(stats)} options={ChartUtils.options(onBarClickAssigned)} width={100} height={50} />
                  </div> :
                  <div className="col pt-4 pb-3">
                    <img src="/assets/img/empty.png" alt={t('empty')} width="200" />
                    <p className="mb-0 mt-2 small text-secondary">
                      <em><Trans>You have no assigned tasks.</Trans></em>
                    </p>
                  </div>
                }
              </div>
            }
            {isAllTasksSelected && !newLocation &&
              <div className="row">
                {numberofTasks ?
                  <div className="col" id="my-tasks-1">
                    <Bar data={ChartUtils.tasksChartData(stats)} options={ChartUtils.options(onBarClick)} width={100} height={50} />
                  </div> :
                  <div className="col pt-4 pb-3">
                    <img src="/assets/img/empty.png" alt={t('empty')} width="200" />
                    <p className="mb-0 mt-2 small text-secondary">
                      <em><Trans>This workspace has no active tasks.</Trans></em>
                    </p>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </VisibilitySensor>
    </>
  );
};

Location.propTypes = {
  location: PropTypes.shape({
    address: PropTypes.object,
    active: PropTypes.bool,
    locationName: PropTypes.string,
    locationDetails: PropTypes.string,
    locationType: PropTypes.string.isRequired,
    locationId: PropTypes.string.isRequired,
    numberofTasks: PropTypes.number.isRequired,
    numberofMyTasks: PropTypes.number,
    newLocation: PropTypes.bool,
  }).isRequired,
  index: PropTypes.number.isRequired,
};
Location.displayName = 'Location';
export default Location;

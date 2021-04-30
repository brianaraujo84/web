import React from 'react';
import PropTypes from 'prop-types';
import { classnames } from 'react-form-dynamic';
import { useTranslation, Trans } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { Bar } from 'react-chartjs-2';
import { useActionDispatch } from '../../../hooks';
import { postConfidenceObject } from '../../../redux/actions/object';
import * as URLS from '../../../urls';
import { typeIcon, ChartUtils } from '../../../utils';

const OBJECT_AGGREGATES = 'task';

const LocationWorker = ({
  location,
  index,
  fetchMore,
}) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [stats, setStats] = React.useState([]);
  const getAggregateCounts = useActionDispatch(postConfidenceObject(OBJECT_AGGREGATES, undefined, undefined, '/aggregate'));

  const {
    locationName = t('home'),
    active,
    address = {},
    locationId,
    locationDetails,
    numberofMyTasks,
    locationType,
  } = location;

  const handleClick = (event, type) => {
    if (event) {
      history.push({pathname: URLS.LOCATION_ASSIGNED_TO_YOU(locationId), data:{filterType: type}});
    }
  };

  const onBarClick = (event, type) => {
    if (event) {
      handleClick(true, type);
    }
  };

  React.useEffect(() => {
    fetchMore();
  },[]);

  React.useEffect(() => {
    getAggregateCounts({locationId, selfAssigned: true}).then((data) => {
      setStats([data.open, data.assigned, data.inprogress, data.review, data.accepted, data.declined, data.rework]);
    });
  }, []);

  return (
    <>
      <div
        className={classnames(['card location-card w-100', index && 'mt-3'])}
        style={{ height: 'auto', overflowY: 'auto', overflowX: 'hidden'  }}
      >
        <div className="d-flex align-items-center" onClick={handleClick} data-target="location-container">
          <div className="w-100 pl-2 pr-0 d-flex align-items-center py-3">
            <div className="space-icon small border text-primary rounded-circle text-center bg-light mr-2" style={{background: 'url("")'}} >
              <span aria-hidden="true">
                <i className={`fad ${typeIcon(locationType)} ${active && 'text-primary'}`} aria-hidden="true"></i>
              </span>
            </div>
            <div>
              <h6 className="mb-0 location-business-name cursor-pointer">{`${locationType === 'Home' ? t('home') : locationName}`}</h6>
              <p className="text-secondary mb-0 location-business-location-name"><small>{locationDetails}</small></p>
            </div>
          </div>
          <div className="d-flex flex-column w-auto p-3 text-right">
            <small className="truncate-1">{address.addressLine1}{!!address.addressLine2 && `, ${address.addressLine2}`}</small>
            <small className="text-secondary d-block text-nowrap">{address.city}, {address.state}</small>
          </div>
        </div>
        <div className={classnames(['card-body p-0 text-center text-primary', numberofMyTasks === 0 ? 'text-muted' : 'text-primary'])}>
          <p className="small text-with-line mb-0">
            <span className="border border-primary rounded p-1 bg-primary text-white">MY TASKS</span>
          </p>
          <div className="row">
            {numberofMyTasks ?
              <div className="col" id="my-tasks-1">
                <Bar data={ChartUtils.tasksChartData(stats)} options={ChartUtils.options(onBarClick)} width={100} height={50} />
              </div> :
              <div className="col pt-4 pb-3">
                <img className="mb-3" src="/assets/img/empty.png" alt={t('empty')} width="200" />
                <p className="mb-0 text-secondary">
                  <em><Trans>You have no assigned tasks.</Trans></em>
                </p>
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
};

LocationWorker.propTypes = {
  location: PropTypes.shape({
    address: PropTypes.object,
    active: PropTypes.bool,
    locationName: PropTypes.string,
    locationDetails: PropTypes.string,
    locationType: PropTypes.string.isRequired,
    locationId: PropTypes.string,
    numberofMyTasks: PropTypes.number,
  }).isRequired,
  index: PropTypes.number.isRequired,
  fetchMore: PropTypes.func,
};
LocationWorker.displayName = 'LocationWorker';
export default LocationWorker;

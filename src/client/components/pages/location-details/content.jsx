import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link, useParams, useHistory } from 'react-router-dom';
import { Trans } from 'react-i18next';

import Tooltip from '../../shared/tooltip';
import { useActionDispatch, useRefreshLocations } from '../../../hooks';
import { getStandardObject, setObject } from '../../../redux/actions/object';
import { getStandardObjectsList } from '../../../redux/actions/objects';
import { setLocData } from '../../../redux/actions/tasks-actions';
import { typeIcon } from '../../../utils';
import EditLocationModal from './edit-location-modal';
import LocationManagersModal from './location-managers-modal';
import WorkspaceAddressModal from './workspace-address-modal';
import InviteToTeamModal from './invite-to-team-modal';
import AddManagerModal from './add-manager-modal';

import * as URLS from '../../../urls';

const styles = {
  address: {
    fontSize: '80%',
  },
  managerImg: {
    width: '35px',
  },
  multiple: {
    // marginLeft: '17px',
  },
  locationTypeIcon: {
    marginRight: '-25px',
  },
};

const OBJECT_LOСATION = 'location';
const OBJECT_MANAGERS = 'managers';
const OBJECT_CONTACTS = 'contacts';
const OBJECT_LOCATION_DETAILS_PREFERENCES = 'locationDetailsPreferences';

const Content = ({ isLoading, setShowZonePopup, numberofTasks, isNotifyPage }) => {
  const { locationId: id } = useParams();
  const history = useHistory();

  const [showEdit, setShowEdit] = React.useState(false);
  const [showManagersModal, setShowManagersModal] = React.useState(false);
  const [showWorkspaceAddressModal, setShowWorkspaceAddressModal] = React.useState(false);
  const [showAddModal, setShowAddModal] = React.useState(false);

  const {
    locationId,
    locationName,
    locationDetails,
    locationType,
    numberofZones,
    locationUserRole,
    address = {},
    hoursofOperation,
  } = useSelector(state => state.loc.data);

  const managers = useSelector(state => state.managers.items);

  const locationDetailsPreferences = useSelector(state => state.locationDetailsPreferences.data);
  const locationZonesItems = useSelector(state => state.locationZones.items);
  const locStatusData = useSelector(state => state.tasksActions?.data);

  const getLocation = useActionDispatch(getStandardObject(OBJECT_LOСATION, undefined, undefined, '/summary'));
  const getManagers = useActionDispatch(getStandardObjectsList(OBJECT_MANAGERS, 'contacts', undefined, 'location', '/reporter'));
  const getContacts = useActionDispatch(getStandardObjectsList(OBJECT_CONTACTS, 'contacts', undefined, 'location', '/contacts'));
  const addLocationDetailsPreferences = useActionDispatch(setObject(OBJECT_LOCATION_DETAILS_PREFERENCES));
  const refreshLocations = useRefreshLocations();
  const updateLocStatus = useActionDispatch(setLocData);

  const expandLocationDetails = React.useMemo(() => {
    if (locationDetailsPreferences && locationId && locationDetailsPreferences[locationId]) {
      return locationDetailsPreferences[locationId].detailsExpanded;
    }
    return false;
  }, [locationDetailsPreferences, locationId]);

  const handleManagerClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    getContacts(id);
    setShowManagersModal(true);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowEdit(true);
  };

  const handleEdit = () => {
    getLocation(id);
    setShowEdit(false);
  };

  const handleInviteTeam = (type) => {
    updateLocStatus({ [locationId]: false });
    if (type === 'yes') {
      getContacts(id);
      setShowAddModal(true);
    } else {
      if (!locStatusData.viewedTipsMap?.['add_your_team_msg']) {
        storePref(true);
        Tooltip.show('add_your_team_msg', 'down').then(() => {
          storePref(false);
        });
      }
    }
  };

  const onContactAdded = () => {
    storePref(true);
    setShowAddModal(false);
  };

  const handleDelete = () => {
    setShowEdit(false);
    history.push(URLS.LOCATIONS);
  };

  const storePref = (flag) => {
    const data = {
      ...locationDetailsPreferences,
      [locationId]: {
        detailsExpanded: flag !== undefined ? flag : !expandLocationDetails,
      }
    };
    addLocationDetailsPreferences(data);
  };

  const handleCloseManagerModal = () => {
    setShowManagersModal(false);
    getManagers(id);
  };

  const handleToggleWorkspaceAddressModal = React.useCallback(() => {
    setShowWorkspaceAddressModal(!showWorkspaceAddressModal);
  }, [showWorkspaceAddressModal]);

  const handleZoneClick = () => {
    if (locationZonesItems.length === 0) {
      setShowZonePopup(true);
    } else {
      getLocation(locationId);
      history.push({ pathname: URLS.LOCATION_CONFIGURE_ZONES(locationId) });
    }
  };

  const handleShowEditLocationModal = React.useCallback(() => {
    setShowEdit(true);
    setShowWorkspaceAddressModal(false);
  }, []);

  React.useMemo(() => {
    Tooltip.show('location_toggle_workspace_deta', 'left').then(() => {
      if (numberofTasks === 0) {
        Tooltip.show('location_tasks_newtask');
      }
    });
    getManagers(id);
  }, [id]);

  React.useEffect(() => {
    return () => {
      refreshLocations();
    };
  }, []);

  React.useMemo(() => {
    if (id && isNotifyPage) {
      getLocation(id);
    }
  }, [id]);

  if (isLoading || managers.length === 0) {
    return (
      <div className="container pb-2">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="d-flex align-items-center">
              <div className="ph-animate ph-icon-large d-inline-block rounded-circle mb-2 mr-2"></div>
              <div className="col px-0 w-100">
                <span className="ph-animate ph-text ph-title mb-2"></span>
                <span className="ph-animate ph-text ph-small mb-2"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container pb-2">
        <div>
          <div className="d-flex align-items-center">
            {(locationUserRole === 'Owner' || locationUserRole === 'Manager') && <a className="space-icon mr-2 border text-primary rounded-circle text-center bg-light" data-toggle="modal" onClick={handleEditClick} data-target="link-edit-location">
              {!!locationType && <span aria-hidden="true"><i className={`fad ${typeIcon(locationType)}`} aria-hidden="true"></i></span>}
            </a>}
            {locationUserRole !== 'Owner' && locationUserRole !== 'Manager' && <a className="space-icon mr-2 border text-primary rounded-circle text-center bg-light" data-toggle="modal" data-target="link-edit-location">
              {!!locationType && <span aria-hidden="true"><i className={`fad ${typeIcon(locationType)}`} aria-hidden="true"></i></span>}
            </a>}
            <div className="col px-0 w-100">
              <h3 className="mb-0">
                {locationName}
              </h3>
              {locationDetails && <p className="mb-1 text-secondary">{locationDetails}</p>}
            </div>
          </div>
          <div className={expandLocationDetails ? '' : 'collapsed'} id="location-extra-details">
            <div className='py-3 my-3 border-top border-bottom'>
              <div className='d-flex mb-2 align-items-center'>
                {(locationUserRole === 'Owner' || locationUserRole === 'Manager') && managers && managers.length > 0 && (
                  <div className='d-flex align-items-center w-100'>
                    <span className='mr-1'>
                      Team:
                    </span>
                    <span className='d-flex multiple-manager-thumbnails'>
                      {managers.slice(0, 4).map((manager, index) => (
                        <span key={index}>
                          <img className='rounded-circle border border-primary d-inline-block avatar-small' src={URLS.PROFILE_IMAGE_THUMB(manager.userName)} style={styles.managerImg} />
                        </span>
                      ))}
                      {managers.length > 4 &&
                        <span style={styles.multiple} className="extra-managers rounded-circle small text-center border border-primary bg-light" onClick={handleManagerClick}>{`+${managers.length - 4}`}</span>
                      }
                    </span>
                    <i className="far fa-pencil-alt text-primary ml-1 add_your_team_msg" onClick={handleManagerClick}></i>
                  </div>
                )}
                <i className="fad fa-2x fa-map-marked-alt px-2 text-primary" aria-hidden="true" onClick={handleToggleWorkspaceAddressModal}></i>
              </div>

              <div className="border-top mt-3 pt-3">
                <Link to={URLS.LOCATION_COMMENTS(locationId)}>
                  <i className="far fa-comment-alt mr-1" aria-hidden="true" />
                  <Trans i18nKey="comments" defaults="Comments" /> <span className="badge badge-danger badge-pill invisible">1</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className='text-right' >
            <a className='p-2 text-secondary location_toggle_workspace_deta' id='location-extra-details-toggle' data-toggle='collapse' role='button' onClick={() => { storePref(); }} >
              <i className={expandLocationDetails ? 'fas fa-chevron-up' : 'fas fa-chevron-down'} aria-hidden></i>
              <span className='sr-only'>Show Details</span>
            </a>
          </div>
        </div>
      </div>

      {locationType && showEdit && <EditLocationModal
        onClose={() => setShowEdit(false)}
        onUpdate={handleEdit}
        onDelete={handleDelete}
        show={showEdit}
        locationType={locationType}
        locationData={{ locationId, locationName, locationDetails, address }}
        hoursofOperation={hoursofOperation}
        locationUserRole={locationUserRole}
        numberofZones={numberofZones}
        locationZonesItems={locationZonesItems}
        handleZoneClick={handleZoneClick}
      />}

      <LocationManagersModal
        onClose={handleCloseManagerModal}
        show={showManagersModal}
      />

      {locStatusData[locationId] && <InviteToTeamModal
        onClose={() => handleInviteTeam('no')}
        onUpdate={() => handleInviteTeam('yes')}
        show={locStatusData[locationId]}
      />}

      <AddManagerModal
        onClose={() => setShowAddModal(false)}
        onUpdate={onContactAdded}
        show={showAddModal}
      />

      <WorkspaceAddressModal
        show={showWorkspaceAddressModal}
        onCancel={handleToggleWorkspaceAddressModal}
        address={address}
        onShowEditLocationModal={handleShowEditLocationModal}
      />
    </>
  );
};

Content.propTypes = {
  my: PropTypes.bool,
  isLoading: PropTypes.bool,
  setShowZonePopup: PropTypes.func,
  managers: PropTypes.array,
  numberofTasks: PropTypes.number,
  isNotifyPage: PropTypes.bool,
};

Content.defaultProps = {
  my: false,
  isLoading: false,
  isNotifyPage: false,
};

Content.displayName = 'LocationDetailsContent';
export default Content;

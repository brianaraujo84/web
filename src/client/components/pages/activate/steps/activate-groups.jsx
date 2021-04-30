import React from 'react';
import PropTypes from 'prop-types';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import InfiniteScroll from 'react-infinite-scroller';

import { useActionDispatch } from '../../../../hooks';
import { postIOTObject } from '../../../../redux/actions/object';
import { postConfidenceObject } from '../../../../redux/actions/object';
import Layout from '../../../shared/layout';
import { useTitle } from '../../../../hooks';
import * as URLS from '../../../../urls';
import { TextUtils } from '../../../../utils';

const OBJECT_LOCATIONS = 'cards';
const VALIDATE_IOT = 'validateIOT';
const state = { searchData: {device: true, searchTerm: '', start: 0, limit: 10,
  statuses: ['All Active','Open','Assigned','Rework','Accepted','Declined','In Progress','Review'],
  sortBy:'createdDate','sortByOrder':'desc',
  statusCategory:'Active'
}, locations: [], numberofTasks: 10000, page: 0};
let isLoading = false;

const ActivateGroups = ({ deviceId, locIdFromVD, setTemplateIdToVD }) => {
  const { t } = useTranslation();
  useTitle(t('ActivateGroups'));
  const history = useHistory();
  const { id } = useParams();
  const { search = '' } = useLocation();
  const { newtemplateId = '' } = TextUtils.getQueryParams(search);

  const [rePaint, setRePaint] = React.useState(false);
  const [locationId, setLocationId] = React.useState(false);
  const [error, setError] = React.useState(false);
  const getLocs = useActionDispatch(postConfidenceObject(OBJECT_LOCATIONS, 'v1', 'cards/jobs'));
  const activateHW = useActionDispatch(postIOTObject(VALIDATE_IOT, undefined, 'device/registration'));

  const updateLocations = () => {
    if (isLoading) {
      return;
    }

    isLoading = true;
    getLocs({...state.searchData, locationId: id || locIdFromVD}).then((data = {}) => {
      const locationsAdd = data.jobs || [];
      state.locations = [...state.locations, ...locationsAdd];
      state.numberofTasks = data.numberofTasks;
      state.page = state.page + 1;
      state.searchData.start = 10 * state.page;
      setRePaint(!rePaint);
    });
  };

  const activateDevice = async (templateId) => {
    await activateHW({ locationId: id, templateId: templateId || locationId, deviceId, virtualDevice: false}).then(data => {
      if (!data.errorCode) {
        history.push(URLS.ACTIVATE('gstep1'));
      }
    }, (error = {}) => {
      setError(error.data?.message);
    });
  };

  const isReadyToLoad = () => {
    return (state.numberofTasks > state.locations.length);
  };

  const onSelect = (loc) => {
    if (locIdFromVD) {
      setTemplateIdToVD(loc.templateId);
      return;
    }
    const l = locationId === loc.templateId ? false : loc.templateId;
    setLocationId(l);
    setError(false);
    setRePaint(!rePaint);
  };

  const moveToGroups = () => {
    activateDevice();
  };

  const onBrowseTemplates = () => {
    history.push({pathname: URLS.TASK_TEMPLATES(id), search: 'flow=devices'});
  };

  React.useEffect(() => {
    if (newtemplateId) {
      activateDevice(newtemplateId);
      return;
    }
    isLoading = true;
    updateLocations();
  },[]);

  React.useEffect(() => {
    isLoading = false;
  },[rePaint]);

  return (
    <Layout>
      <div className={`pb-4 ${!locIdFromVD && 'container content-wrapper'}`}>
        {!locIdFromVD && <div className="row justify-content-center">
          <div className="col-11 col-md-6">
            <h1 className="text-center mb-2 mt-4"><Trans i18nKey="select_group" defaults="Select Group"/></h1>
            <p className="lead text-center">Select the group and template in your Workspace, or create a new one.</p>
          </div>
        </div>}
        <div className="row mb-2">
          <div className="col">
            <label className="sr-only">Search</label>
            <div className="input-group mb-2">
              <div className="input-group-prepend">
                <div className="input-group-text"><i className="fas fa-search" aria-hidden="true"></i></div>
              </div>
              <input type="text" className="form-control" id="inlineFormInputGroup" placeholder="Search for group"/>
            </div>
          </div>
        </div>

        {error && <p className="error-message pt-1">{error}</p>}
        <div className="col-12 list-group pr-0">
          <InfiniteScroll pageStart={0} loadMore={updateLocations} hasMore={isReadyToLoad()}>
            {state.locations.map((loc, idx) => {
              return (<div onClick={() => onSelect(loc)} className={`list-group-item px-2 ${locationId === loc.templateId ? 'selected bg-primary text-white rounded' : locationId === false ? '' : 'd-none'}`} key={idx}>
                <div className="d-flex align-items-center">
                  <div className="space-icon small border text-primary rounded text-center bg-light mr-2" >
                  </div>
                  <div className="col d-flex align-items-center p-0">
                    <div>
                      <h6 className="mb-0 location-business-name">{loc.templateName}</h6>
                      <p className="mb-0 location-business-location-name"><small>{loc.referenceTemplateName}</small></p>
                    </div>
                  </div>
                </div>
              </div>);
            })}
          </InfiniteScroll>
        </div>
        {!locIdFromVD && <div>
          <a className="list-group-item px-2 border-top-0 text-primary" onClick={onBrowseTemplates}>
            <i className="far fa-file-plus fa-lg mx-1" aria-hidden="true"></i> <span>Browse Templates</span>
          </a>
        </div>}
        {!locIdFromVD && <div className="mt-4">
          {error && <p className="error-message pt-1">{error}</p>}
          <Button
            role="button"
            variant="primary"
            block
            className="text-white"
            disabled={!locationId}
            onClick={moveToGroups}>
              Continue
          </Button>
        </div>}

      </div>
    </Layout>
  );
};

ActivateGroups.propTypes = {
  deviceId: PropTypes.string,
  locIdFromVD: PropTypes.string,
  setTemplateIdToVD: PropTypes.func,
};

ActivateGroups.defaultProps = {
  deviceId: '',
  locIdFromVD: '',
  setTemplateIdToVD: () => {},
};

ActivateGroups.displayName = 'ActivateGroups';
export default ActivateGroups;

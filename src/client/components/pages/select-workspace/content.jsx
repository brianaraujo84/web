import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';

import Workspaces from './workspaces';
import { useActionDispatch } from '../../../hooks';
import { postConfidenceObject, resetObject } from '../../../redux/actions/object';
import { getPostStandardObjectsList } from '../../../redux/actions/objects';
import * as URLS from '../../../urls';
import { DateUtils } from '../../../utils';
import useDebounce from '../../../hooks/useDebounce';
import NoMatchingWorkspaces from '../../shared/no-matching-workspaces';

const OBJECT_DEVICE_LOCATIONS = 'deviceLocations';
const NEW_TEMPLATE = 'newTemplate';
const OBJECT_TEMPLATE = 'template';

const Content = () => {
  const { t } = useTranslation();
  const history = useHistory();
  
  const [location, setlocation] = React.useState(null);
  const [keyword, setKeyword] = React.useState(undefined);

  const {
    items: locations,
    total: locationsTotal,
    initialLoading
  } = useSelector(state => state.deviceLocations);
  const newTemplateData = useSelector(state => state.newTemplate?.data);
  const profile = useSelector(state => state.profile?.data);

  const getDeviceLocations = useActionDispatch(getPostStandardObjectsList(
    OBJECT_DEVICE_LOCATIONS,
    'locations',
    'v2',
    'locations',
    '',
    20,
    'numberOfLocations'
  ));

  const createTemplate = useActionDispatch(postConfidenceObject(OBJECT_TEMPLATE));
  const clearTemplateData = useActionDispatch(resetObject(NEW_TEMPLATE));

  const locationsNumber = locations.length;
  const hasMore = !Number.isInteger(locationsTotal) || locationsTotal > locationsNumber;

  const templateId = newTemplateData?.selectedTemplate?.templateDetails?.templateId;

  const debouncedKeyword = useDebounce(keyword, 500);

  const fetchLocations = (firstFetch = false) => {
    getDeviceLocations({ 
      device: true,
      searchTerm: debouncedKeyword, 
      locationType: newTemplateData?.selectedTemplate?.templateDetails?.locationType
    }, undefined, '', '', firstFetch);
  };

  const handleSearchChange = (e) => {
    setKeyword(e.target.value);
    // setlocation(null);
  };

  const handleClickLocation = (l) => async () => {
    if (templateId) {
      const date = new Date();
      const data = {
        templateId,
        templateName: newTemplateData?.selectedTemplate?.referenceTemplateName,
        locationId: l.locationId,
        createdBy: profile.username,
        taskRecurring: {
          timeZone: DateUtils.getCurrentTZName(),
          recurringType: 'OneTime',
          startDate: DateUtils.unicodeFormat(date, 'yyyy-MM-dd'),
          startTime: DateUtils.roundToNextMinutes(new Date()),
          endTime: DateUtils.roundToNextMinutes(DateUtils.addMinutes(new Date(), 30)),
        },
      };
      const { templateId: taskTemplateId } = await createTemplate(data);
      clearTemplateData();
      history.push(URLS.TASK_DETAILS(l.locationId, taskTemplateId, newTemplateData.tm));
    } else {
      if (!location) {
        setlocation(l);
      } else {
        setlocation(null);
      }
    }
  };

  const getDevices = React.useCallback(async () => {
    fetchLocations(true);
  }, []);

  React.useEffect(() => {
    getDevices();
  }, [getDevices]);

  React.useEffect(() => {
    if(debouncedKeyword) {
      fetchLocations(true);
    }
  },[debouncedKeyword]);

  React.useEffect(() => {
    if (keyword === ''){
      getDeviceLocations({ 
        device: true,
        locationType: newTemplateData?.selectedTemplate?.templateDetails?.locationType
      }, undefined, '', '', true);
    }
  },[keyword]);

  return (
    <div className='container'>
      <div className="row">
        <div className="col-12 pt-4">
          <h1 className="text-center mb-2">
            <Trans>Add Workspace</Trans>
          </h1>
          <p className="lead text-center">
            <Trans>Select on workspace for the template</Trans>
          </p>
        </div>
      </div>
      <div className="row">
        <div className='col-12'>
          <form>
            <label className="sr-only" htmlFor="inlineFormInputGroup"><Trans>Search</Trans></label>
            <div className="input-group mb-2">
              <div className="input-group-prepend">
                <div className="input-group-text"><i className="fas fa-search" aria-hidden="true"></i></div>
              </div>
              <input type="text" className="form-control" placeholder={t('Search for space')} onChange={handleSearchChange}/>
            </div>
          </form>
        </div>
      </div>
      <div className=''>
        {locations.length > 0 && !initialLoading && (
          <InfiniteScroll
            dataLength={locationsNumber}
            next={fetchLocations}
            hasMore={hasMore}
            // loader={<div style={{ textAlign: 'center', padding: 20 }}><i className="far fa-spinner fa-spin fa-3x" aria-hidden="true" /></div>}
          >
            <Workspaces handleClickLocation={handleClickLocation} />
          </InfiniteScroll>
        )}
      </div>
      {initialLoading && <div style={{ textAlign: 'center', padding: 20 }}><i className="far fa-spinner fa-spin fa-3x" aria-hidden="true" /></div>}
      {!initialLoading && locations.length === 0 && (
        <NoMatchingWorkspaces />
      )}
    </div>
  );
};

Content.displayName = 'DevicesContent';

export default Content;

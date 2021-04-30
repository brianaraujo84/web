import React from 'react';
import { Trans } from 'react-i18next';
import { useSelector } from 'react-redux';

import ButtonLabel from '../../shared/button-label';

import { useActionDispatch } from '../../../hooks';
import { getStandardObjectsList } from '../../../redux/actions/objects';
import { setObject, resetObject } from '../../../redux/actions/object';

import { typeIcon } from '../../../utils';
import { locationTypes } from '../../../constants';

import HomeForm from './home-form';
import BusinessForm from './business-form';
import SchoolForm from './school-form';
import RideshareForm from './rideshare-form';

const LOCATION_TYPE = 'locationType';
export const STATE_UNSELECTED = 0;
export const STATE_HOME = locationTypes.HOME;
export const STATE_BUSINESS = locationTypes.BUSINESS;
export const STATE_OFFICE = locationTypes.OFFICE;
export const STATE_HOTEL = locationTypes.HOTEL;
export const STATE_SCHOOL = locationTypes.SCHOOL;
export const STATE_RIDESHARE = locationTypes.RIDESHARE;
export const STATE_AIRBNB = locationTypes.AIRBNB;
export const STATE_GOVERNMENT = locationTypes.GOVERNMENT;
export const STATE_CONSTRUCTION = locationTypes.CONSTRUCTION;
export const STATE_GENERAL = locationTypes.GENERAL;
export const STATE_STUDENT_HOUSING = locationTypes.STATE_STUDENT_HOUSING;
// const STATE_COMMERCIAL_VEHICLE = 5;

const OBJECT_LOСATION_TYPES = 'locationTypes';
const actionGetLocationTypes = getStandardObjectsList(OBJECT_LOСATION_TYPES, OBJECT_LOСATION_TYPES, 'v1', 'locationtypes');

const Content = () => {

  const [state, setState] = React.useState(STATE_UNSELECTED);

  const getLocationTypes = useActionDispatch(actionGetLocationTypes);
  const saveLocationType = useActionDispatch(setObject(LOCATION_TYPE));
  const resetLocationType = useActionDispatch(resetObject(LOCATION_TYPE));

  const locationTypes = useSelector(state => state.locationTypes.items);

  const locationType = useSelector(state => state.locationType.data);
  const newTemplateData = useSelector(state => state.newTemplate?.data);

  const workspaceType = locationType || newTemplateData?.selectedTemplate?.templateDetails?.locationType;

  const handleSubmit = () => {
    setState(STATE_UNSELECTED);
  };

  const handleSelect = (locationType) => {
    setState(locationType);
    saveLocationType(locationType);
  };

  React.useEffect(() => {
    getLocationTypes();
  }, []);

  React.useEffect(() => {
    if (locationType.length === undefined && state !== STATE_UNSELECTED) {
      setState(STATE_UNSELECTED);
    }
  }, [locationType]);

  React.useEffect(() => {
    if (workspaceType) {
      if (workspaceType === 'Office') {
        setState(STATE_OFFICE);
      } else if (workspaceType === 'Home') {
        setState(STATE_HOME);
      } else if (workspaceType === 'Business') {
        setState(STATE_BUSINESS);
      } else if (workspaceType === 'School') {
        setState(STATE_SCHOOL);
      } else if (workspaceType === 'Hotel') {
        setState(STATE_HOTEL);
      } else if (workspaceType === 'Airbnb') {
        setState(STATE_AIRBNB);
      } else if (workspaceType === 'Government') {
        setState(STATE_GOVERNMENT);
      } else if (workspaceType === 'Construction') {
        setState(STATE_CONSTRUCTION);
      } else if (workspaceType === 'General') {
        setState(STATE_GENERAL);
      } else if (workspaceType === 'Student Housing') {
        setState(STATE_STUDENT_HOUSING);
      }
    }
  }, [workspaceType]);

  const sortLocationTypes = React.useMemo(() => {
    let data = locationTypes;
    data = data.filter(location => (location.locationType !== 'General' && location.locationType !== 'Student Housing'));
    const generalLocation = locationTypes.filter(location => location.locationType === 'General');
    const studentHousingLocation = locationTypes.filter(location => location.locationType === 'Student Housing');
    data.unshift(generalLocation[0]);
    data.push(studentHousingLocation[0]);
    return data;
  }, [locationTypes]);

  return (
    <>
      <h1 className='text-center'>
        <Trans i18nKey='add_workspace' />
      </h1>
      <div id='locationtypes' className='mt-3 row' data-toggle='buttons'>
        {sortLocationTypes.map((locationType) => (
          <div className={`col-12 btn-group-toggle ${state === STATE_UNSELECTED ? 'col-md-6' : ''}`} key={locationType?.locationType}>
            <ButtonLabel
              state={state}
              buttonState={locationType?.locationType}
              stateUnselected={STATE_UNSELECTED}
              handleClick={() => handleSelect(locationType?.locationType)}
            >
              <Trans i18nKey={locationType?.locationTypeText} />
              <span aria-hidden='true' className='d-block mb-1 mt-3'><i className={`fad fa-3x ${typeIcon(locationType?.locationType)}`} aria-hidden='true'></i></span>
              <span className='d-block'><small><Trans>{locationType?.description}</Trans></small></span>
            </ButtonLabel>
          </div>
        ))}
      </div>
      {state === STATE_GENERAL && <BusinessForm locationType={state} resetLocationType={resetLocationType} />}
      {state === STATE_STUDENT_HOUSING && <HomeForm locationType={state} resetLocationType={resetLocationType} />}
      {state === STATE_HOME && <HomeForm locationType={state} resetLocationType={resetLocationType} />}
      {state === STATE_BUSINESS && <BusinessForm locationType={state} resetLocationType={resetLocationType} />}
      {state === STATE_OFFICE && <BusinessForm locationType={state} resetLocationType={resetLocationType} />}
      {state === STATE_HOTEL && <BusinessForm locationType={state} resetLocationType={resetLocationType} />}
      {state === STATE_SCHOOL && <SchoolForm locationType={state} resetLocationType={resetLocationType} />}
      {state === STATE_RIDESHARE && <RideshareForm onSubmit={handleSubmit} resetLocationType={resetLocationType} locationType={state} />}
      {state === STATE_AIRBNB && <HomeForm locationType={state} resetLocationType={resetLocationType} />}
      {state === STATE_GOVERNMENT && <HomeForm locationType={state} resetLocationType={resetLocationType} />}
      {state === STATE_CONSTRUCTION && <BusinessForm locationType={state} resetLocationType={resetLocationType} />}
      {/* {state === STATE_COMMERCIAL_VEHICLE && <RideshareForm onSubmit={handleSubmit} locationType={state} />} */}
    </>
  );
};
Content.displayName = 'AddLocationContent';
export default Content;

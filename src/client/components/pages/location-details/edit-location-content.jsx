import React from 'react';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import { useForm, Input, ErrorMessage } from 'react-form-dynamic';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import OperationHoursModal from './operation-hours-modal';
import { Autocomplete } from '../../shared/geo';
import * as URLS from '../../../urls';
import { postConfidenceManageObject } from '../../../redux/actions/object';
import { useActionDispatch, useRefreshLocations } from '../../../hooks';
import { typeIcon } from '../../../utils';

export const STATE_UNSELECTED = 0;
export const STATE_HOME = 'Home';
export const STATE_BUSINESS = 'Business';
export const STATE_OFFICE = 'Office';
export const STATE_HOTEL = 'Hotel';
export const STATE_SCHOOL = 'School';

const EditLocationContent = ({ locationType, locationData, setFormik, setIsInitialValues, hoursofOperation, locationUserRole, numberofZones, locationZonesItems, handleZoneClick, }) => {
  const { t } = useTranslation();
  const { locationId } = useParams();
  const [showOperationHoursModal, setShowOperationHoursModal] = React.useState(false);
  const [address, setAddress] = React.useState({});

  const manageLocation = useActionDispatch(postConfidenceManageObject('location'));
  const refreshLocations = useRefreshLocations();

  const geolocation = useSelector(state => state.geolocation.location);
  const profile = useSelector(state => state.profile.data);

  const addressString = `${locationData?.address?.addressLine1}, ${locationData?.address?.city}, ${locationData?.address?.state}`;

  const fields = [
    {
      name: 'location_name',
      label: t('Nickname'),
      initialValue: locationData.locationName || '',
      validations: [
        {
          rule: 'required',
        },
      ],
    },
    {
      name: 'addressString',
      label: t('Address'),
      initialValue: addressString,
      validations: [
        {
          rule: 'required',
          params: [' '],
        },
        {
          rule: 'test',
          params: ['test-zip', t('Postal code is required'), () => {
            return !!address.zip;
          }]
        },
      ],
    },
  ];

  const handleAddressChange = (addressString, address) => {
    // setAddressString(addressString);
    setAddress(address);
    formik.setFieldTouched('addressString', true);
    formik.setFieldValue('addressString', addressString);
  };

  const handleSubmit = async (dt) => {
    const data = {
      userName: profile.username,
      // companyId: profile.companyId,
      locationName: dt.location_name,
      locationDetails: '',
      locationType,
      locationId: locationData ? locationData.locationId : undefined,
      contact: {
        name: `${profile.firstName} ${profile.lastName}`,
        email: profile.email,
        phone: profile.phone,
        phoneType: 'mobile',
      },
      address: {
        addressLine1: address.address,
        addressLine2: address.address2,
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: address.country,
      },
    };

    try {
      await manageLocation(data);
      refreshLocations();
    } catch (e) {
      history.push(URLS.PAGE_400);
    }
  };

  const formik = useForm({ fields, onSubmit: handleSubmit });

  React.useEffect(() => {
    const address = { ...locationData.address };
    address.address = address.addressLine1;
    setAddress(address);
    setFormik(formik);
    window.setTimeout(() => {
      formik.validateForm();
    });
  }, []);

  React.useEffect(() => {
    setFormik(formik);
  }, [formik.isValid]);

  const dateTimeFormater = (day) => {
    if ((day !== 'Saturday' && day !== 'Sunday') && (hoursofOperation.length === 0)) {
      return `${day}: 9:00 AM - 5:00 PM`;
    } 
    if ((day === 'Saturday' || day === 'Sunday') && hoursofOperation.length === 0) {
      return `${day}: Closed`;
    }
    const dayObject = hoursofOperation.filter(item => item.weekday === day)[0];
    if (!dayObject) {
      return;
    }
    if (dayObject.closed) {
      return `${day}: Closed`;
    }

    const openingHour = (dayObject.openingHour.slice(0,2) >= 12) ? dayObject.openingHour.slice(0,2) - 12 + dayObject.openingHour.slice(2,5) + ' PM' : dayObject.openingHour.slice(0,5) + ' AM';

    const closingHour = (dayObject.closingHour.slice(0,2) >= 12) ? dayObject.closingHour.slice(0,2) - 12 + dayObject.closingHour.slice(2,5) + ' PM' : dayObject.closingHour.slice(0,5) + ' AM';

    return `${dayObject.weekday}: ${openingHour} - ${closingHour}`;
  };

  React.useEffect(() => {
    setIsInitialValues(Object.keys(formik.values).every((key) => formik.values[key] === formik.initialValues[key]));
  }, [formik.values]);

  return (
    <>
      <form>
        <div className="form-group">
          <div className="d-flex align-items-center">
            <div className="space-icon border text-primary rounded-circle text-center bg-light">
              <span className="" aria-hidden="true"><i className={`fad ${typeIcon(locationType)}`}  aria-hidden="true"></i></span>
            </div>
            
            {/* THE BELLOW BUTTON IS COMMENTED OUT UNTIL WE WORK ON THE UPLOAD WORKSPACE LOGO TICKET */}

            {/* <div className="col">
              <button className="btn btn-sm btn-outline-primary mr-2">Upload Logo</button>
              <button className="d-none btn btn-sm btn-outline-primary mr-2">Edit</button>
              <button className="d-none btn btn-sm btn-outline-danger">Delete</button>
            </div> */}
          </div>
        </div>
        <div className="form-group">
          <label className="sr-only">Company Name</label>
          <Input
            name="location_name"
            formik={formik}
            showError={false}
            placeholder={t('Nickname')}
            classes={{ input: 'form-control' }}
            data-target="input-nickname"
            onChange={() => setFormik(formik)}
          />
        </div>
        <fieldset>
          <p className="mb-1 text-secondary">Address</p>
          <div className="form-group">
            <label className="sr-only">Space Address</label>
            <Autocomplete
              initialValue={formik.values.addressString}
              idPrefix="addr"
              placeholder={t('Your Address')}
              onSelect={handleAddressChange}
              geolocation={geolocation}
              className="form-control"
              isAddress
              showError={false}
              types={['address']}
              data-target="autocomplete-address"
            />
            <ErrorMessage
              formik={formik}
              name="addressString"
              className="error-message"
            />
          </div>
        </fieldset>

        <div className="pb-2">
          <p className='mb-1 text-secondary'>Zones</p>
          {(locationUserRole === 'Owner' || locationUserRole === 'Manager') && <a href='#' onClick={handleZoneClick}>
            <p className="mb-0">
              {locationZonesItems.length === 0 ? (
                <Trans i18nKey="enable_zones" >Enable Zones</Trans>
              ) : (
                <Trans
                  i18nKey="num_of_zones"
                  values={{ numberofZones }}
                />)}
            </p>
          </a>}
        </div>

        <fieldset>
          <p className='mb-1 text-secondary'>Hours of Operation
            <a href='#' data-toggle='modal' data-target='#hours-of-operation' className='ml-1' onClick={() => setShowOperationHoursModal(!showOperationHoursModal)}>
              <i className='far fa-pencil-alt' aria-hidden='true'></i>
              <span className='sr-only'>Edit Hours</span>
            </a>
          </p>
          <div className='border rounded p-1 small mb-2'>
            <span className='d-block p-1 border-bottom'>Please click the pencil to update your hours</span>
            {hoursofOperation.filter(item => item.weekday === 'Monday').length !== 0 ? <span className='d-block p-1 border-bottom'>{dateTimeFormater('Monday')}</span> : undefined}
            {hoursofOperation.filter(item => item.weekday === 'Tuesday').length !== 0 ? <span className='d-block p-1 border-bottom'>{dateTimeFormater('Tuesday')}</span> : undefined}
            {hoursofOperation.filter(item => item.weekday === 'Wednesday').length !== 0 ? <span className='d-block p-1 border-bottom'>{dateTimeFormater('Wednesday')}</span> : undefined}
            {hoursofOperation.filter(item => item.weekday === 'Thursday').length !== 0 ? <span className='d-block p-1 border-bottom'>{dateTimeFormater('Thursday')}</span> : undefined}
            {hoursofOperation.filter(item => item.weekday === 'Friday').length !== 0 ? <span className='d-block p-1 border-bottom'>{dateTimeFormater('Friday')}</span> : undefined}
            {hoursofOperation.filter(item => item.weekday === 'Saturday').length !== 0 ? <span className='d-block p-1 border-bottom'>{dateTimeFormater('Saturday')}</span> : undefined}
            {hoursofOperation.filter(item => item.weekday === 'Sunday').length !== 0 ? <span className='d-block p-1 border-bottom'>{dateTimeFormater('Sunday')}</span> : undefined}
          </div>
        </fieldset>
      </form>
      {showOperationHoursModal && <OperationHoursModal
        show={showOperationHoursModal}
        onCancel={() => setShowOperationHoursModal(false)}
        locationId={locationId}
        hoursofOperation={hoursofOperation}
      />}
    </>
  );
};

EditLocationContent.propTypes = {
  locationType: PropTypes.string.isRequired,
  hoursofOperation: PropTypes.array,
  locationData: PropTypes.shape({
    locationId: PropTypes.any.isRequired,
    address: PropTypes.object,
    locationName: PropTypes.string,
  }).isRequired,
  setFormik: PropTypes.func.isRequired,
  setIsInitialValues: PropTypes.func.isRequired,
  locationUserRole: PropTypes.string,
  numberofZones: PropTypes.number,
  locationZonesItems: PropTypes.array,
  handleZoneClick: PropTypes.func,
};

EditLocationContent.defaultProps = {
  locationUserRole: '',
  numberofZones: '',
  locationZonesItems: [],
  handleZoneClick: () => {},
};

EditLocationContent.displayName = 'EditLocationEditLocationContent';
export default EditLocationContent;

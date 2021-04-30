import React from 'react';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useForm, Input, classnames, ErrorMessage } from 'react-form-dynamic';
import { useHistory } from 'react-router-dom';

import { Autocomplete } from '../../shared/geo';
import { useActionDispatch, useRefreshLocations } from '../../../hooks';
import { postConfidenceManageObject } from '../../../redux/actions/object';

import * as URLS from '../../../urls';

const BusinessForm = ({
  locationType,
  locationData,
  setFormik,
  setIsInitialValues,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [address, setAddress] = React.useState({});
  const profile = useSelector(state => state.profile.data);
  const manageLocation = useActionDispatch(postConfidenceManageObject('location'));
  const refreshLocations = useRefreshLocations();

  const addressString = `${locationData?.address?.addressLine1}, ${locationData?.address?.city}, ${locationData?.address?.state}`;
  const fields = [
    {
      name: 'business_name',
      label: t('Business Name'),
      initialValue: locationData.locationName || '',
      validations: [
        {
          rule: 'required',
        }
      ],
    },
    {
      name: 'location_name',
      label: t('Space Name'),
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

  const geolocation = useSelector(state => state.geolocation.location);

  const handleSubmit = async (dt) => {

    const data = {
      userName: profile.username,
      // companyId: profile.companyId,
      locationName: dt.business_name,
      locationDetails: dt.location_name,
      locationId: locationData ? locationData.locationId : undefined,
      locationType,
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
      const res = await manageLocation(data);
      refreshLocations();
      if (!locationData) {
        history.push({ pathname: URLS.LOCATION_CONFIGURE_ZONES(res.locationId), data: { isFirstTime: !locationData } });
      }
    } catch (e) {
      history.push(URLS.PAGE_400);
    }
  };
  const formik = useForm({ fields, onSubmit: handleSubmit });

  const handleAddressChange = (addressString, address) => {
    setAddress(address);
    formik.setFieldTouched('addressString', true);
    formik.setFieldValue('addressString', addressString);
  };

  // React.useEffect(() => {
  //   if (locationData) {
  //     if (locationData.address) {
  //       locationData.address.address = locationData.address.addressLine1;
  //       handleAddressChange(`${locationData.address.addressLine1}, ${locationData.address.city}, ${locationData.address.state}`, locationData.address);
  //     }
  //     formik.setFieldValue('business_name', locationData.locationDetails);
  //     formik.setFieldValue('location_name', locationData.locationName);
  //     locationData.setFormik && locationData.setFormik(formik);
  //   }
  //   // formik.validateForm();
  // }, []);


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

  React.useEffect(() => {
    setIsInitialValues(Object.keys(formik.values).every((key) => formik.values[key] === formik.initialValues[key]));
  }, [formik.values]);

  return (
    <>
      <div className="mt-4">
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label className="sr-only"><Trans>Business/Space Address</Trans></label>
            <Autocomplete
              initialValue={formik.values.addressString}
              idPrefix="addr"
              placeholder={t('Business/Space Address')}
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
          <div className="form-group">
            <Input
              name="business_name"
              formik={formik}
              showError={false}
              placeholder={t('Business Name')}
              classes={{ input: 'form-control' }}
              data-target="input-business-name"
            />
          </div>
          <div className="form-group">
            <Input
              name="location_name"
              formik={formik}
              showError={false}
              placeholder={t('Space Name (optional)')}
              classes={{ input: 'form-control' }}
              data-target="input-location-name"
            />
            {formik && formik.values && formik.values?.location_name?.length === 0 ? (
              <small id="inputBusinessHelper" className="text-muted"><Trans>Add a label to provide more specificity to the location</Trans></small>
            ) : <small />}
          </div>
          {!locationData && <button
            type="submit"
            className={classnames(['mt-4 btn btn-primary btn-block', (!formik.isValid || formik.isSubmitting) && 'disabled'])}
          >
            <Trans>Continue</Trans>
          </button>}
        </form>
      </div>
    </>
  );
};

BusinessForm.propTypes = {
  locationType: PropTypes.any.isRequired,
  locationData: PropTypes.shape({
    locationId: PropTypes.any.isRequired,
    locationDetails: PropTypes.string,
    locationName: PropTypes.string,
    address: PropTypes.object.isRequired,
  }),
  setFormik: PropTypes.func.isRequired,
  setIsInitialValues: PropTypes.func.isRequired,
};

BusinessForm.displayName = 'BusinessForm';
export default BusinessForm;

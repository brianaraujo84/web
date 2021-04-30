import React from 'react';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Input, useForm, ErrorMessage } from 'react-form-dynamic';
import { useHistory } from 'react-router-dom';

import { useActionDispatch, useRefreshLocations } from '../../../hooks';
import { postConfidenceManageObject } from '../../../redux/actions/object';
import { Autocomplete } from '../../shared/geo';
import * as URLS from '../../../urls';

const HomeForm = ({
  locationType,
  locationData,
  setFormik,
  setIsInitialValues,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [address, setAddress] = React.useState({});

  const geolocation = useSelector(state => state.geolocation.location);
  const profile = useSelector(state => state.profile.data);
  const manageLocation = useActionDispatch(postConfidenceManageObject('location'));
  const refreshLocations = useRefreshLocations();

  const addressString = `${locationData?.address?.addressLine1}, ${locationData?.address?.city}, ${locationData?.address?.state}`;
  const fields = [
    {
      name: 'location_name',
      label: t('Nickname'),
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

  const handleAddressChange = (addressString, address) => {
    // setAddressString(addressString);
    setAddress(address);
    formik.setFieldTouched('addressString', true);
    formik.setFieldValue('addressString', addressString);
  };

  // const isValid = React.useMemo(() => {
  //   return !!addressString && address.zip;
  // }, [address]);

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

  React.useEffect(() => {
    setIsInitialValues(Object.keys(formik.values).every((key) => formik.values[key] === formik.initialValues[key]));
  }, [formik.values]);

  return (
    <>
      <div className="mt-4">
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label className="sr-only"><Trans>Company Address</Trans></label>
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
          <div className="form-group">
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
        </form>
      </div>
    </>
  );
};

HomeForm.propTypes = {
  locationType: PropTypes.any.isRequired,
  locationData: PropTypes.shape({
    locationId: PropTypes.any.isRequired,
    address: PropTypes.object.isRequired,
    locationName: PropTypes.string,
  }),
  setFormik: PropTypes.func.isRequired,
  setIsInitialValues: PropTypes.func.isRequired,
};

HomeForm.displayName = 'HomeForm';
export default HomeForm;

import React from 'react';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Input, useForm, ErrorMessage } from 'react-form-dynamic';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import { useActionDispatch, useRefreshLocations } from '../../../hooks';
import { postConfidenceManageObject, postConfidenceObject, resetObject } from '../../../redux/actions/object';
import { Autocomplete } from '../../shared/geo';
import * as URLS from '../../../urls';
import { DateUtils } from '../../../utils';

const OBJECT_TEMPLATE = 'template';
const NEW_TEMPLATE = 'newTemplate';
const LOCATION_TYPE = 'locationType';

const HomeForm = ({
  locationType,
  resetLocationType,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [address, setAddress] = React.useState({});

  const geolocation = useSelector(state => state.geolocation.location);
  const newTemplateData = useSelector(state => state.newTemplate?.data);
  const profile = useSelector(state => state.profile.data);
  const manageLocation = useActionDispatch(postConfidenceManageObject('location'));
  const refreshLocations = useRefreshLocations();
  const createTemplate = useActionDispatch(postConfidenceObject(OBJECT_TEMPLATE));
  const clearTemplateData = useActionDispatch(resetObject(NEW_TEMPLATE));
  const clearLocationType = useActionDispatch(resetObject(LOCATION_TYPE));

  const fields = [
    {
      name: 'business_name',
      label: t('Workspace Name'),
      validations: [
        {
          rule: 'required',
        }
      ],
    },
    {
      name: 'addressString',
      label: t('address'),
      validations: [
        {
          rule: 'required',
          params: [' '],
        },
        {
          rule: 'test',
          params: ['test-zip', t('postal_code_reqd'), () => {
            return !!address.zip;
          }]
        },
      ],
    },
    {
      name: 'location_name',
      label: t('workspace_nickname'),
    },
  ];


  const handleSubmit = async (dt) => {
    resetLocationType('locationType');
    const data = {
      userName: profile.username,
      // companyId: profile.companyId,
      locationName: dt.business_name,
      locationDetails: dt.location_name,
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
      if (newTemplateData && newTemplateData.selectedTemplate) {
        const date = new Date();
        const data = {
          templateId: newTemplateData?.selectedTemplate?.templateDetails?.templateId,
          templateName: newTemplateData?.selectedTemplate?.referenceTemplateName,
          locationId: res.locationId,
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
        clearLocationType();
        history.push(URLS.TASK_DETAILS(res.locationId, taskTemplateId));
      } else {
        history.push({ pathname: URLS.LOCATION(res.locationId), data: { isFirstTime: true, locationType } });
      }
    } catch (e) {
      history.push(URLS.PAGE_400);
    }
  };

  const handleAddressChange = (addressString, address) => {
    setAddress(address);
    formik.setFieldTouched('addressString', true);
    formik.setFieldValue('addressString', addressString);
  };

  const formik = useForm({ fields, onSubmit: handleSubmit });

  return (
    <>
      <div className="mt-4">
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <Input
              showError={false}
              name="business_name"
              formik={formik}
              placeholder={t('Workspace Name')}
              classes={{ input: 'form-control' }}
              data-target="input-business-name"
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <label className="sr-only"><Trans i18nKey="comp_addr" /></label>
            <Autocomplete
              initialValue={formik.values.addressString}
              idPrefix="addr"
              placeholder={t('your_address')}
              onSelect={handleAddressChange}
              geolocation={geolocation}
              className="form-control"
              isAddress
              types={['address']}
              showError={false}
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
              showError={false}
              name="location_name"
              formik={formik}
              placeholder={t('workspace_opt')}
              classes={{ input: 'form-control' }}
              data-target="input-nickname"
              autoComplete="off"
            />
          </div>
          <Button
            variant="primary"
            type="submit"
            block
            className="mt-4"
            disabled={!formik.isValid || formik.isSubmitting || !formik.values.addressString || !formik.values.business_name}
          // onClick={handleSubmit}
          >
            <Trans 
              i18nKey="add_workspace" 
              defaults="Add Workspace"
            />
          </Button>
        </form>
      </div>
    </>
  );
};

HomeForm.propTypes = {
  locationType: PropTypes.any.isRequired,
  resetLocationType: PropTypes.func
};

HomeForm.displayName = 'HomeForm';
export default HomeForm;

import React from 'react';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useForm, Input, ErrorMessage } from 'react-form-dynamic';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { Autocomplete } from '../../shared/geo';
import { useActionDispatch, useRefreshLocations } from '../../../hooks';
import { postConfidenceManageObject, postConfidenceObject, resetObject } from '../../../redux/actions/object';
import { getProfileData } from '../../../redux/actions/profile';

import * as URLS from '../../../urls';
import { DateUtils } from '../../../utils';

const OBJECT_TEMPLATE = 'template';
const NEW_TEMPLATE = 'newTemplate';
const LOCATION_TYPE = 'locationType';

const SchoolForm = ({
  locationType,
  resetLocationType,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [address, setAddress] = React.useState({});
  const profile = useSelector(state => state.profile.data);
  const newTemplateData = useSelector(state => state.newTemplate?.data);
  const manageLocation = useActionDispatch(postConfidenceManageObject('location'));
  const refreshLocations = useRefreshLocations();
  const createTemplate = useActionDispatch(postConfidenceObject(OBJECT_TEMPLATE));
  const clearTemplateData = useActionDispatch(resetObject(NEW_TEMPLATE));
  const loadUser = useActionDispatch(getProfileData);
  const locationsTotal = useSelector(state => state.locations.total);

  const clearLocationType = useActionDispatch(resetObject(LOCATION_TYPE));
  const { company } = profile;

  const companyMode = !locationsTotal || !company || !company.address;

  const fields = [
    {
      name: 'companyName',
      label: t('Company Name'),
      validations: [
        ...(companyMode ? [{
          rule: 'required',
        }] : [])
      ],
    },
    {
      name: 'school_name',
      label: t('school_name'),
      validations: [
        {
          rule: 'required',
        },
      ],
    },
    {
      name: 'location_name',
      label: t('loc_name'),
    },
    {
      name: 'addressLine2',
      label: t('Unit'),
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
  ];

  const geolocation = useSelector(state => state.geolocation.location);

  const handleSubmit = async (dt) => {
    resetLocationType('locationType');
    const data = {
      userName: profile.username,
      ...(dt.school_name ? { locationName: dt.school_name, } : {}),
      ...(dt.companyName ? { companyName: dt.companyName, } : {}),
      ...(dt.location_name ? { locationDetails: dt.location_name, } : {}),
      locationType,
      contact: {
        name: `${profile.firstName} ${profile.lastName}`,
        email: profile.email,
        phone: profile.phone,
        phoneType: 'mobile',
      },
      address: {
        addressLine1: address.address,
        addressLine2: dt.addressLine2,
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: address.country,
      },
    };

    try {
      const res = await manageLocation(data);
      loadUser();
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
  const formik = useForm({ fields, onSubmit: handleSubmit });

  const handleAddressChange = (addressString, address) => {
    setAddress(address);
    formik.setFieldTouched('addressString', true);
    formik.setFieldValue('addressString', addressString);
    if (address.address2) {
      formik.setFieldValue('addressLine2', address.address2);
    }
  };

  React.useEffect(() => {
    if (company && company.address) {
      const {
        addressLine1 = '',
        addressLine2 = '',
        city = '',
        state = '',
        zip = '',
        country = '',
      } = company.address;
      const addressString = `${addressLine1}, ${city}, ${state}, ${country}`;
      formik.setFieldValue('addressString', addressString);
      formik.setFieldValue('addressLine2', addressLine2);
      const addr = {
        address: addressLine1,
        address2: addressLine2,
        city,
        state,
        zip,
        country,
      };
      setAddress(addr);
    }
  }, company);

  return (
    <>
      <div className="mt-4">
        <form onSubmit={formik.handleSubmit}>
          {
            !companyMode ? (
              <div className="form-group">
                <Input
                  name="school_name"
                  formik={formik}
                  placeholder={t('Workspace Name')}
                  classes={{ input: 'form-control' }}
                  showError={false}
                  data-target="input-business-name"
                  autoComplete="off"
                />
              </div>
            ) :
              (
                <div className="form-group">
                  <Input
                    showError={false}
                    name="companyName"
                    formik={formik}
                    placeholder={t('Company Name')}
                    classes={{ input: 'form-control' }}
                    data-target="input-business-name"
                    autoComplete="off"
                  />
                </div>
              )
          }
          <Row>
            <Col className='col-9'>
              <div className="form-group">
                <label className="sr-only"><Trans i18nKey="school_space_address" /></label>
                <Autocomplete
                  initialValue={formik.values.addressString}
                  idPrefix="addr"
                  placeholder={!companyMode ? t('Address') : t('Company Address')}
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
            </Col>
            <Col className="col-3 pl-0">
              <div className="form-group">
                <Input
                  showError={false}
                  name="addressLine2"
                  formik={formik}
                  placeholder={t('Unit')}
                  classes={{ input: 'form-control' }}
                  data-target="input-address-2"
                />
              </div>
            </Col>
          </Row>

          {
            !companyMode ? (
              <div className="form-group">
                <Input
                  name="location_name"
                  formik={formik}
                  placeholder={t('workspace_opt')}
                  classes={{ input: 'form-control' }}
                  showError={false}
                  data-target="input-location-name"
                  autoComplete="off"
                />
              </div>
            ) :
              (
                <div className="form-group">
                  <Input
                    name="school_name"
                    formik={formik}
                    placeholder={t('Workspace Name')}
                    classes={{ input: 'form-control' }}
                    showError={false}
                    data-target="input-business-name"
                    autoComplete="off"
                  />
                </div>
              )
          }

          <Button
            type="submit"
            className="mt-4 btn btn-primary btn-block"
            disabled={!formik.isValid || formik.isSubmitting || !formik.values.addressString}
          >
            <Trans i18nKey="continue" />
          </Button>
        </form>
      </div>
    </>
  );
};

SchoolForm.propTypes = {
  locationType: PropTypes.any.isRequired,
  resetLocationType: PropTypes.func
};

SchoolForm.displayName = 'SchoolForm';
export default SchoolForm;

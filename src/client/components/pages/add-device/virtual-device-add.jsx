import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { useForm, Input, Select } from 'react-form-dynamic';
import Button from 'react-bootstrap/Button';

import Layout from '../../shared/layout';
import { DeviceSetupSteps, StorageKeys } from '../../../constants';
import { useActionDispatch } from '../../../hooks';
import { getStandardObjectsList } from '../../../redux/actions/objects';
import { postObject } from '../../../redux/actions/object';
import { _postObject } from '../../../services/services';
import * as URLS from '../../../urls';
import { setItem } from '../../../utils/storage-utils';

const OBJECT_LOCATION_ZONES = 'locationZones';
const OBJECT_TEMPLATES = 'templates';
const OBJECT_DEVICE = 'device';

const classes = {
  input: {
    input: 'form-control',
    label: 'text-muted',
    error: 'invalid-feedback',
    inputError: 'error is-invalid',
    container: 'form-group',
  },
};

const VirtualDeviceAdd = ({ locationId: locationIdData }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const { locationId } = useParams();

  const useLocationId = locationIdData ? locationIdData : locationId;

  const fields = [
    {
      name: 'placement',
      label: t('Placement'),
    },
    {
      name: 'locationZoneId',
      label: t('Location Zone'),
    },
    {
      name: 'templateId',
      label: t('Template'),
      validations: [
        {
          rule: 'required',
        },
      ],
    },
  ];

  const [showHelperText, setShowHelperText] = React.useState(false);
  const [state, setState] = React.useState(DeviceSetupSteps.STATE_PLACEMENT);
  const [error, setError] = React.useState('');

  const locations = useSelector(state => state.locations.items);
  const locationZones = useSelector(state => state.locationZones.items);
  const templatesList = useSelector(state => state.templates.items);

  const getLocationZones = useActionDispatch(getStandardObjectsList(OBJECT_LOCATION_ZONES, 'zones', undefined, 'location', '/configuration'));
  const getTemplates = useActionDispatch(getStandardObjectsList(OBJECT_TEMPLATES, 'templates', undefined, 'location', '/jobsbasedontemplate'));
  const getDevices = useActionDispatch(postObject(OBJECT_DEVICE, 'confidenceiot/v1/locations/devices'));

  const handleSubmit = async (values) => {
    try {
      const data = {
        locationId: useLocationId,
        placement: values.placement,
        templateId: values.templateId,
        virtualDevice: true,
      };
      const { deviceId, passcode } = await _postObject('confidenceiot/v1/device/registration', data);

      setItem(StorageKeys.DEVICE_PASSCODE_KEY, passcode);
      getDevices({ locationId: useLocationId });
  
      history.push(URLS.DEVICE_ACTIVATE(deviceId));
    } catch (err) {
      setError(t('Can\'t register the device'));
      setState(DeviceSetupSteps.STATE_PLACEMENT);
    }
  };

  const handleLocationZoneChange = (e) => {
    formik.setFieldValue('locationZoneId', e.target.value);
  };

  const handleTemplateChange = (e) => {
    formik.setFieldValue('templateId', e.target.value);
  };

  const handleGoToPrev = () => {
    if (state === DeviceSetupSteps.STATE_PLACEMENT) {
      history.push(URLS.ADD_DEVICE);
    } else {
      setState(state - 1);
    }
  };

  const handleGoToNext = () => {
    setState(state + 1);
  };

  const toggleHelperText = (e) => {
    e.preventDefault();
    setShowHelperText(!showHelperText);
  };

  const formik = useForm({ fields, onSubmit: handleSubmit });

  const location = React.useMemo(() => {
    return locations && locations.find(item => item.locationId === useLocationId);
  }, [locations, locationId]);
  
  React.useEffect(() => {
    if (state === DeviceSetupSteps.STATE_PLACEMENT) {
      getLocationZones(useLocationId);
      getTemplates(useLocationId);
    }
  }, [state]);

  return (
    <Layout>
      <div className="container pb-4">
        <div className="row justify-content-center">
          <div className="col-11 col-md-6">
            <h1 className="text-center mb-4 mt-5">
              <Trans>Add Virtual Smart Display</Trans>
            </h1>
            <p className="mb-2 mt-4">
              <Trans>Space this virtual smart display will be in </Trans>
              <i className="far fa-pencil-alt text-primary" aria-hidden="true"></i> <span className="sr-only"><Trans>Edit Space</Trans></span>
            </p>
            <div className="card rounded px-2 py-3">
              <div className="d-flex align-items-center">
                <div className="col col-auto p-0 text-center">
                  <i className="fad fa-store mr-2 fa-3x text-primary location-type-icon" aria-hidden="true"></i>
                </div>
                <div className="col d-flex align-items-center p-0">
                  <div>
                    <h6 className="mb-0 location-business-name truncate-1">{location?.locationName}</h6>
                    <small className="d-block">{location?.address.addressLine1}</small>
                    <small className="text-secondary d-block">{`${location?.address.city}, ${location?.address.state}`}</small>
                  </div>
                </div>
              </div>
            </div>

            <form className="mt-5" onSubmit={formik.handleSubmit} autoComplete="off">
              {state === DeviceSetupSteps.STATE_PLACEMENT && (
                <div className="form-group">
                  <label htmlFor="placement">
                    <Trans>Where will the device be placed?</Trans>
                    <span className="small d-block text-secondary">
                      <Trans>i.e. behind front desk, on bathroom door, etc.</Trans>
                    </span>
                  </label>
                  <Input
                    name="placement"
                    classes={classes.input}
                    formik={formik}
                    placeholder={t('Enter placement (optional)')}
                    showError={false}
                  />
                  {error && <p className="error text-danger"><small>{error}</small></p>}
                </div>
              )}

              {state === DeviceSetupSteps.STATE_SELECT_ZONE && (
                <div className="form-group">
                  <label htmlFor="zone">
                    <Trans>Associate a Zone with the device.</Trans>
                  </label>
                  <Select
                    name="locationZoneId"
                    placeholder={t('- Select Zone (optional) -')}
                    options={locationZones.map((locationZone) => ({
                      value: locationZone.id,
                      label: locationZone.type,
                    }))}
                    classes={{ select: 'form-control' }}
                    formik={formik}
                    showError={false}
                    onChange={handleLocationZoneChange}
                    data-target="select-location-zone"
                  />
                </div>
              )}

              {state === DeviceSetupSteps.STATE_SELECT_TEMPLATE && (
                <>
                  <label htmlFor="template">
                    <Trans>Associate a Template with the device.</Trans>
                    <a
                      data-toggle="collapse"
                      data-target="toggle-helper-text"
                      role="button"
                      aria-expanded="false"
                      aria-controls="job-helpertext"
                      onClick={toggleHelperText}
                    >
                      <i className="far fa-question-circle text-primary" aria-hidden="true" />
                    </a>
                  </label>
                  {showHelperText && (
                    <div id="job-helpertext">
                      <p className="text-secondary text">
                        <Trans>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Trans>
                      </p>
                    </div>
                  )}
                  <div className="form-group">
                    <Select
                      name="templateId"
                      placeholder={t('- Select Template -')}
                      options={templatesList.map((template) => ({
                        value: template.id,
                        label: template.displayName,
                      }))}
                      classes={{ select: 'form-control' }}
                      formik={formik}
                      showError={false}
                      onChange={handleTemplateChange}
                      data-target="select-template"
                    />
                  </div>
                </>
              )}

              <div className="row mt-4">
                <div className="col pr-0">
                  <Button
                    className="m-0"
                    data-target="back-btn"
                    variant="outline-secondary"
                    onClick={handleGoToPrev}
                    block
                  >
                    <Trans>Back</Trans>
                  </Button>
                </div>
                <div className="col">
                  {state === DeviceSetupSteps.STATE_SELECT_TEMPLATE ? (
                    <Button
                      type="submit"
                      className="m-0"
                      variant="primary"
                      disabled={!formik.isValid || formik.isSubmitting}
                      block
                    >
                      <Trans>Finish Setup</Trans>
                    </Button>
                  ) : (
                    <Button
                      className="m-0"
                      variant="primary"
                      data-target="next-btn"
                      onClick={handleGoToNext}
                      block
                    >
                      <Trans>Next</Trans>
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

VirtualDeviceAdd.propTypes = {
  locationId: PropTypes.string,
};

VirtualDeviceAdd.displayName = 'VirtualDeviceAdd';

export default VirtualDeviceAdd;

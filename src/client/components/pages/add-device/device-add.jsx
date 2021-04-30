import React from 'react';
import { useHistory } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { useForm, Input } from 'react-form-dynamic';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';

import { _postObject } from '../../../services/services';
import * as URLS from '../../../urls';
import { setItem } from '../../../utils/storage-utils';
import { StorageKeys } from '../../../constants';

const classes = {
  input: {
    input: 'form-control',
    label: 'text-muted',
    error: 'invalid-feedback',
    inputError: 'error is-invalid',
    container: 'form-group',
  },
};

const DeviceAdd = ({ locationId, templateId }) => {
  const { t } = useTranslation();

  const fields = [
    {
      name: 'serialNumber',
      validations: [
        {
          rule: 'required',
        },
      ],
    }
  ];

  const [error, setError] = React.useState('');

  const history = useHistory();

  const handleSubmit = () => {};

  const handleAddVirtualDisplay = async () => {
    // history.replace(URLS.ADD_VIRTUAL_DEVICE(location.locationId));
    try {
      const data = {
        locationId: locationId,
        // placement: values.placement,
        templateId: templateId,
        virtualDevice: true,
      };
      const { deviceId, passcode } = await _postObject('confidenceiot/v1/device/registration', data);

      setItem(StorageKeys.DEVICE_PASSCODE_KEY, passcode);
      // getDevices({ locationId: locationId });
      history.push(URLS.DEVICE_ACTIVATE(deviceId));
    } catch (err) {
      setError(t('Can\'t register the device'));
    }
  };

  React.useEffect(() => {
    handleAddVirtualDisplay();
  }, []);

  const formik = useForm({ fields, onSubmit: handleSubmit });

  return (
    <>
      <div className="container d-none">
        <div className="row justify-content-center">
          <div className="col-11 col-md-6">
            <h1 className="text-center mb-4 mt-5">
              <Trans>Add Device</Trans>
            </h1>
            <div className="text-center">
              <img src="/assets/img/device-outline.png" className="w-100 mb-2" alt="device" />
            </div>
            <p className="lead text-center">
              <Trans>Find the QR code on the back of your device and scan it.</Trans>
            </p>
            <div className="text-center">
              <Button variant="primary" size="lg" disabled>
                <i className="far fa-lg fa-camera mr-2" aria-hidden="true" />
                <Trans> Scan QR Code</Trans>
              </Button>
            </div>
            <div className="text-center mt-4">
              <p className="mb-2">
                <Trans>Scanner now working or can't find your code?</Trans>
              </p>
              <a
                data-toggle="collapse"
                href="#serial-manual"
                role="button"
                aria-expanded="false"
                aria-controls="serial-manual"
                className="collapsed"
              >
                <Trans>Enter Serial Number manually</Trans>
              </a>
              <form id="serial-manual" className="mt-2 collapse" autoComplete="off" onSubmit={formik.handleSubmit}>
                <div className="form-group">
                  <small className="form-text text-muted mb-2">
                    <Trans>The Serial Number can be found in on the back of your device and looks like 20 010001 0920.</Trans>
                  </small>
                  <Input
                    name="serialNumber"
                    classes={classes.input}
                    formik={formik}
                    aria-describedby="serialHelp"
                    placeholder={t('Serial Number')}
                  />
                </div>
                <div className="row">
                  <div className="col pr-0">
                    <Button
                      variant="outline-secondary"
                      data-toggle="collapse"
                      href="#serial-manual"
                      role="button"
                      aria-expanded="true"
                      aria-controls="serial-manual"
                      block
                    >
                      <Trans>Cancel</Trans>
                    </Button>
                  </div>
                  <div className="col">
                    <Button type="submit" variant="primary" disabled={!formik.isValid || formik.isSubmitting}>
                      <Trans>Continue</Trans>
                    </Button>
                  </div>
                </div>
              </form>
            </div>

            <hr className="my-4" />

            <div className="text-center mb-4">
              <p><Trans>No device?</Trans></p>
              <Button variant="outline-primary" data-target="add-virtual-display-btn" onClick={handleAddVirtualDisplay}>
                <Trans>Add Virtual Smart Display</Trans>
              </Button>
              <p className="mt-3 text-danger">{error}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

DeviceAdd.displayName = 'DeviceAdd';

DeviceAdd.propTypes = {
  location: PropTypes.object,
  templateId: PropTypes.number,
  locationId: PropTypes.string,
};

export default DeviceAdd;

import React from 'react';
import PropTypes from 'prop-types';
import { useForm, Input } from 'react-form-dynamic';
import { Trans, useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';

const ActivateManual = ({ activateDevice, hideText }) => {
  const [toggleManual, setToggleManual] = React.useState(false);
  const { t } = useTranslation();
  const fields = [
    {
      name: 'deviceId',
      initialValue: '',
      validations: [
        {
          rule: 'required',
        }
      ],
    },
  ];

  const toggle = () => {
    setToggleManual(!toggleManual);
  };
  const onSubmit = async (values = {}, {setSubmitting}) => {
    activateDevice(values.deviceId).then((data) => {
      if (data.errorCode) {
        formik.setFieldError('deviceId', data.message);
      }
      setSubmitting(false);
    });
  };
  const formik = useForm({ fields, onSubmit });

  React.useEffect(() => {
    formik.validateForm();
  }, []);

  return (
    <>
      <div className={`text-center ${!hideText && 'border-top pt-3 mt-3'}`}>
        {!hideText && <p className="mb-2"><Trans i18nKey="can_not_find_code" defaults="Can't find the code or it is damaged?"/></p>}
        <a data-toggle="collapse" className="text-primary" role="button" aria-expanded="false" aria-controls="serial-manual" onClick={toggle}>Enter Serial Number manually</a>
        <form id="serial-manual" className={`mt-2 collapse ${toggleManual && 'show'}`} onSubmit={formik.handleSubmit} autoComplete="off">
          <div className="form-group">
            <small id="serialHelp" className="form-text text-muted mb-2">The Serial Number can be found in on the back of your device and looks like 20 010001 0920.</small>
            <Input
              name="deviceId"
              className="form-control"
              formik={formik}
              placeholder={t('Serial Number')}
              aria-describedby="serialHelp"
            />
          </div>
          <div className="row">
            <div className="col pr-0">
              <Button
                variant="outline"
                block
                className="btn-outline-secondary"
                role="button"
                onClick={toggle}
                aria-expanded="true"
                aria-controls="serial-manual">
                  Cancel
              </Button>
            </div>
            <div className="col">
              <Button
                role="button"
                variant="primary"
                block
                className="text-white"
                disabled={!formik.isValid || formik.isSubmitting}
                type="submit">
                Continue
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};


ActivateManual.propTypes = {
  activateDevice: PropTypes.func,
  hideText: PropTypes.bool,
};
ActivateManual.defaultProps = {
  activateDevice: () => {},
  hideText: false,
};
ActivateManual.displayName = 'ActivateManual';
export default ActivateManual;

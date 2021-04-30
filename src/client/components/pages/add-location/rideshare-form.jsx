import React from 'react';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import { useForm, Input, classnames } from 'react-form-dynamic';

const RideshareForm = ({
  // eslint-disable-next-line no-unused-vars
  locationType,
  resetLocationType
}) => {
  const { t } = useTranslation();
  const fields = [
    {
      name: 'make',
      label: t('Vehicle Make'),
      validations: [
        {
          rule: 'required',
        }
      ],
    },
    {
      name: 'model',
      label: t('Vehicle Model'),
      validations: [
        {
          rule: 'required',
        }
      ],
    },
    {
      name: 'year',
      label: t('Vehicle Year'),
      validations: [
        {
          rule: 'required',
        },
        {
          rule: 'matches',
          params: [/^[0-9]{4}$/, t('Incorrect year')],
        },
      ],
    },
    {
      name: 'plate',
      label: t('License Plate'),
      validations: [
        {
          rule: 'required',
        }
      ],
    },

  ];

  const handleSubmit = () => {
    resetLocationType('locationType');
    // onSubmit(data);
  };
  const formik = useForm({ fields, onSubmit: handleSubmit });

  return (
    <>
      <form onSubmit={formik.handleSubmit} className="mt-4">
        <div className="form-group">
          <label><Trans>Vehicle Make</Trans></label>
          <Input
            name="make"
            formik={formik}
            classes={{ input: 'form-control' }}
            data-target="input-business-name"
          />
        </div>
        <div className="form-group">
          <label><Trans>Vehicle Model</Trans></label>
          <Input
            name="model"
            formik={formik}
            classes={{ input: 'form-control' }}
            data-target="input-business-name"
          />
        </div>
        <div className="form-group">
          <label><Trans>Vehicle Year</Trans></label>
          <Input
            name="year"
            formik={formik}
            classes={{ input: 'form-control' }}
            data-target="input-business-name"
          />
        </div>
        <div className="form-group">
          <label><Trans>License Plate</Trans></label>
          <Input
            name="plate"
            formik={formik}
            classes={{ input: 'form-control' }}
            data-target="input-business-name"
          />
        </div>
        <button
          type="submit"
          className={classnames(['mt-4 btn btn-primary btn-block', (!formik.isValid || formik.isSubmitting) && 'disabled'])}
        >
          <Trans>Add Workspace</Trans>
        </button>
      </form>
    </>
  );
};

RideshareForm.propTypes = {
  locationType: PropTypes.any.isRequired,
  resetLocationType: PropTypes.func
};

RideshareForm.displayName = 'RideshareForm';
export default RideshareForm;

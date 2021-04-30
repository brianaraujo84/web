import React from 'react';
import PropTypes from 'prop-types';
import { Input, Select } from 'react-form-dynamic';

const countryCodes = [
  { value: '+1', label: '+ 1' },
  { value: '+39', label: '+ 39' },
  { value: '+385', label: '+ 385' },
  { value: '+91', label: '+ 91' },
  { value: '+52', label: '+ 52' },
];


const styles = {
  clearButton: {
    marginLeft: '-40px',
    zIndex: '100',
  },
};

export const PhoneInput = ({
  formik,
  classes,
  placeholder,
  name,
  phoneonly,
  showError,
  onClear,
  inputRef,
  ...rest
}) => {
  formik.values._inputPhoneName = formik.values._inputPhoneName || '';
  formik.values._countryCode = formik.values._countryCode || countryCodes[0].value;

  const {
    isPhone = false,
    _inputPhoneName = '',
    _countryCode = '',
  } = formik.values;

  React.useEffect(() => {
    const strippedPhone = _inputPhoneName.replace(/(\s|\u002E|\u002d|\u0028|\u0029)/ig, '');
    if (phoneonly || /^(\d|\u002E|\u002d)+$/.test(strippedPhone) || /^\+(\d|\u002E|\u002d)+$/.test(strippedPhone)) {
      formik.setFieldValue('isPhone', true);
      if (strippedPhone.length > 0) {
        if (/^\+\d+$/.test(strippedPhone)) {
          countryCodes.forEach((countryCode) => {
            if (strippedPhone.startsWith(countryCode.value)) {
              formik.setFieldValue('_countryCode', countryCode.value);
              formik.setFieldValue('_inputPhoneName', strippedPhone.slice(countryCode.value.length));
            }
          });
        } else {
          formik.setFieldValue(name, `${_countryCode}${strippedPhone}`);
        }
      } else {
        formik.setFieldValue(name, '');
      }
    } else {
      formik.setFieldValue('isPhone', false);
      formik.setFieldValue(name, _inputPhoneName);
    }
  }, [_inputPhoneName, _countryCode]);

  const handleClear = () => {
    formik.setFieldValue('_inputPhoneName', '');
    formik.setFieldValue('_countryCode', countryCodes[0].value);
    onClear && onClear();
  };

  const invalid = React.useMemo(() => {
    return !!formik.errors[name] && !!formik.touched._inputPhoneName;
  }, [formik.errors[name], formik.touched._inputPhoneName]);

  React.useEffect(() => {
    formik.setFieldValue('_inputPhoneName', formik.values[name]);
  }, []);

  const usernamePrepend = (
    <div className="input-group-prepend">
      <Select
        name="_countryCode"
        inline
        formik={formik}
        options={countryCodes}
        classes={classes.select}
        showError={false}
        data-target="select-country-code"
      />
    </div>
  );

  const usernameAppend = (
    <>
      {
        !!formik.values._inputPhoneName && (
          <button
            className="btn bg-transparent text-secondary"
            style={styles.clearButton}
            type="button"
            onClick={handleClear}
          >
            <i className="fa fa-times-circle" aria-hidden="true" />
          </button>
        )
      }
    </>
  );

  return (
    <>
      <Input
        ref={inputRef}
        showError={true}
        prepend={isPhone && usernamePrepend}
        append={showError && usernameAppend}
        classes={isPhone ? classes.inputPhone : classes.inputEmail}
        invalid={invalid}
        name="_inputPhoneName"
        formik={formik}
        placeholder={placeholder}
        type={phoneonly ? 'tel' : 'text'}
        maxLength={phoneonly ? (rest.maxLength || 15) : 100}
        {...rest}
      />
    </>
  );
};

PhoneInput.propTypes = {
  formik: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  phoneonly: PropTypes.bool.isRequired,
  placeholder: PropTypes.string,
  showError: PropTypes.bool,
  classes: PropTypes.shape({
    select: PropTypes.object,
    inputPhone: PropTypes.object,
    inputEmail: PropTypes.object,
  }).isRequired,
  onClear: PropTypes.func,
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any })
  ]),
};
PhoneInput.defaultProps = {
  classes: {
    select: {
      select: 'text-secondary form-control custom-select rounded-left',
    },
    inputPhone: {
      input: 'form-control',
      container: 'input-group mb-0',
      error: 'invalid-feedback',
      inputError: 'error is-invalid',
    },
    inputEmail: {
      input: 'form-control rounded',
      container: 'input-group mb-0',
      error: 'invalid-feedback',
      inputError: 'error is-invalid',
    },
  },
  placeholder: '',
  phoneonly: false,
  showError: true,
  inputRef: null,
};
PhoneInput.displayName = 'PhoneInput';

export default React.forwardRef((props, ref) => (
  <PhoneInput inputRef={ref} {...props} />
));

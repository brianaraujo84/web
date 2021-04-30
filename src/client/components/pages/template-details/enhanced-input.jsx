import React from 'react';
import { Trans } from 'react-i18next';
import PropTypes from 'prop-types';
import { Input } from 'react-form-dynamic';

const classes = {
  input: {
    input: 'form-control',
    error: 'invalid-feedback',
    inputError: 'error is-invalid',
    container: '',
  },
};

const EnhancedInput = ({ formik, name, onSave, maxLength, ...rest }) => {
  const [isEdit, setIsEdit] = React.useState(false);
  const prev = React.useRef(formik.values[name]);

  const handleDiscard = () => {
    setIsEdit(false);
    formik.setFieldValue(name, prev.current);
  };

  const handleSave = () => {
    setIsEdit(false);
    onSave && onSave();
    prev.current = formik.values[name];
  };

  return isEdit ? (
    <div className="template-detail-edit">
      <Input
        classes={classes.input}
        name={name}
        formik={formik}
        maxLength={maxLength}
        {...rest}
      />
      <div className="d-flex">
        <div className={`${formik.values[name].length === +maxLength ? 'text-danger' : 'text-secondary'} small pt-1`}>
          <span>{formik.values[name].length}</span>/{maxLength}
        </div>
        <div className="w-100 buttons text-right mt-2">
          <button className="btn btn-sm btn-outline-secondary discard mr-1" data-target="discard-btn" onClick={handleDiscard}>Discard</button>
          <button className="btn btn-sm btn-primary text-white save" data-target="save-btn" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  ) : (
    <p className="template-detail-text p-2 d-inline-block rounded border bg-light mb-0" onClick={() => setIsEdit(true)}><Trans>{formik.values[name]}</Trans></p>
  );
};

EnhancedInput.propTypes = {
  formik: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  onSave: PropTypes.func,
  maxLength: PropTypes.string
};

EnhancedInput.defaultProps = {
  onSave: () => {},
};

EnhancedInput.displayName = 'EnhancedInput';

export default EnhancedInput;

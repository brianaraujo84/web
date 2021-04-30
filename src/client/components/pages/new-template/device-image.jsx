import React from 'react';
import { Trans } from 'react-i18next';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';

const DeviceImage = ({ formik, field, onChange }) => {
  const handleOpen = (event) => {
    event.preventDefault();
    formik.ref.current.click();
  };

  return (
    <div className="d-inline-block mr-5">
      <p className="text-secondary font-weight-normal">{field.label}</p>
      <a href="#">
        <img 
          className="rounded border mr-2 image-fluid" 
          src={formik.values[field.name] ? formik.values[field.name] : '/assets/img/placeholder-square.png'}
          // src={formik.values[field.name]} 
          width="110" 
        />
      </a>
      <a href="#" data-target="edit-image" onClick={handleOpen}><i className="far fa-pencil-alt" aria-hidden="true"></i> <span className="sr-only"><Trans>Edit</Trans></span></a>
      <div className="mt-2">
        <Button variant="outline-primary" onClick={() => field.ref.current.click()}><i className="far fa-plus" aria-hidden="true"></i> <Trans>Upload</Trans></Button>
      </div>
      <input
        type="file"
        accept="image/*"
        capture="user"
        style={{ display: 'none' }}
        ref={field.ref}
        onChange={onChange(field.name)}
      />
    </div>
  );
};

DeviceImage.propTypes = {
  formik: PropTypes.any.isRequired,
  field: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

DeviceImage.displayName = 'DeviceImage';

export default DeviceImage;

import React from 'react';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useForm, Input, Select } from 'react-form-dynamic';

const EditZoneModal = ({
  onClose,
  onUpdate,
  show,
  zone,
  zoneTypes,
}) => {

  const { t } = useTranslation();
  const fields = React.useMemo(() => [
    {
      name: 'type',
      label: t('zone_type'),

      initialValue: zone.type,
      validations: [
        {
          rule: 'required',
        }
      ],
    },
    {
      name: 'label',
      label: t('label_optional'),
      initialValue: zone.label,
    },
  ], []);

  const onSubmit = (values) => {
    onUpdate(values);
  };

  const formik = useForm({ fields, onSubmit });

  return (
    <>
      <Modal show={show} onHide={onClose} centered>
        <form onSubmit={formik.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title as="h5">
              {zone.id 
                ? <span>
                  <i className="text-info far fa-pencil-alt mr-1" aria-hidden="true"></i> 
                  <Trans i18nKey="edit_zone" />
                </span> 
                : <span>
                  <i className="text-info fas fa-plus mr-1" aria-hidden="true"></i> 
                  <Trans i18nKey="add_zone" />
                </span>
              }
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <Select
                name="type"
                placeholder={t('zone_type')}
                formik={formik}
                options={zoneTypes}
                classes={{ select: 'form-control' }}
                data-target="input-zone-type"
              />
            </div>
            <div className="form-group">
              <Input
                name="label"
                placeholder={t('label_optional')}
                formik={formik}
                classes={{ input: 'form-control' }}
                data-target="input-zone-label"
              />
            </div>
            <p className="mb-0">
              <small className="text-secondary">
                <i className="fas fa-info-circle mr-1" aria-hidden="true" />
                <Trans i18nKey="zone_optional_label_info">Labels allow you to be more specific on naming a zone. i.e "Ladies" Bathroom.</Trans>
              </small>
            </p>
          </Modal.Body>
          <Modal.Footer>

            <Button
              variant="outline-secondary"
              onClick={onClose}
            >
              <Trans i18nKey="cancel" />
            </Button>

            <Button
              variant="primary"
              type="submit"
              disabled={!formik.isValid || formik.isSubmitting}
            >
              <Trans i18nKey={zone.id ? 'save' : 'add_zone'} />
            </Button>

          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};


EditZoneModal.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  zoneTypes: PropTypes.array.isRequired,
  zone: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string,
    label: PropTypes.string,
  }),
};

EditZoneModal.defaultProps = {
  show: false,
};

EditZoneModal.displayName = 'LocationDetailsEditZoneModal';
export default EditZoneModal;

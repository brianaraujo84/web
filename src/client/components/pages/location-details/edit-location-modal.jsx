import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useParams } from 'react-router-dom';

import { useActionDispatch } from '../../../hooks';
import { postConfidenceManageObject } from '../../../redux/actions/object';


import ConfirmDeleteModal from './confirm-delete-modal';
import EditLocationContent from './edit-location-content';

const EditLocationModal = ({
  onClose,
  onUpdate,
  onDelete,
  show,
  locationType,
  locationData,
  hoursofOperation,
  locationUserRole,
  numberofZones,
  locationZonesItems,
  handleZoneClick,
}) => {
  const { locationId } = useParams();
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [formik, setFormik] = React.useState({});
  const [isInitialValues, setIsInitialValues] = React.useState(true);

  const manageLocation = useActionDispatch(postConfidenceManageObject('location'));

  const handleDelete = async () => {
    const data = {
      locationId,
      action: 'delete',
    };
    await manageLocation(data);
    onDelete();
    setShowDeleteModal(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleLocationSave = () => {
    formik.submitForm().then(onUpdate);
  };

  return (
    <>
      <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title as="h5">
            <Trans 
              i18nKey="edit_workspace" 
              defaults="Edit Workspace Details"
            />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditLocationContent
            locationType={locationType}
            locationData={locationData}
            setFormik={setFormik}
            setIsInitialValues={setIsInitialValues}
            hoursofOperation={hoursofOperation}
            locationUserRole={locationUserRole}
            numberofZones={numberofZones}
            locationZonesItems={locationZonesItems}
            handleZoneClick={handleZoneClick}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" data-target="button-cancel" onClick={onClose}>
            <Trans i18nKey="cancel" />
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteClick}
            data-target="button-delete"
          >
            <Trans 
              i18nKey="delete"
              defaults="Delete"
            />
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={!formik.isValid || formik.isSubmitting || isInitialValues}
            data-target="button-update"
            onClick={handleLocationSave}
          >
            <Trans i18nKey="update" />
          </Button>
        </Modal.Footer>
      </Modal>

      <ConfirmDeleteModal
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        show={showDeleteModal}
      />
    </>
  );
};


EditLocationModal.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  show: PropTypes.bool,
  locationType: PropTypes.string.isRequired,
  locationData: PropTypes.object,
  hoursofOperation: PropTypes.array,
  locationUserRole: PropTypes.string,
  numberofZones: PropTypes.number,
  locationZonesItems: PropTypes.array,
  handleZoneClick: PropTypes.func,
};

EditLocationModal.defaultProps = {
  show: false,
  locationUserRole: '',
  numberofZones: '',
  locationZonesItems: [],
  handleZoneClick: () => {},
};

EditLocationModal.displayName = 'LocationDetailsEditLocationModal';
export default EditLocationModal;

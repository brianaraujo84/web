import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const RemoveModal = ({
  onCancel,
  onConfirm,
  show,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Modal show={show} onHide={onCancel} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title as="h5">
            <i className="fa-lg mr-1 far fa-exclamation-circle" aria-hidden="true" /> {t('Remove Assignee')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">
            {t('Are you sure you want to remove the assignee?')}
          </p>
        </Modal.Body>
        <Modal.Footer className='d-flex'>
          <Button variant="outline-secondary" className='col btn btn-outline-secondary' onClick={onCancel}>
            {t('No')}
          </Button>
          <Button variant="danger" className='col ml-2 btn btn-danger' onClick={onConfirm}>
            {t('Yes')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};


RemoveModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  show: PropTypes.bool,
};

RemoveModal.defaultProps = {
  show: false,
};

RemoveModal.displayName = 'RemoveModal';
export default RemoveModal;

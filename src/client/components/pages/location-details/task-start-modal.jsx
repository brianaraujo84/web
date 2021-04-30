import React from 'react';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  Form,
  Modal
} from 'react-bootstrap';

import { setItem } from '../../../utils/storage-utils';
import { StorageKeys } from '../../../constants';

const TaskStartModal = ({ show, onClose, onConfirm }) => {
  const { t } = useTranslation();

  const [showAgain, setShowAgain] = React.useState(false);

  const handleChange = (event) => {
    setShowAgain(event.target.checked);
  };

  const handleClick = () => {
    if (showAgain) {
      setItem(StorageKeys.TASK_START_SHOW_KEY, true);
    }
    onConfirm();
  };

  return (
    <>
      <Modal show={show} onHide={onClose} centered>
        <Modal.Body>
          <h5 className="text-primary">
            <Trans i18nKey="task_started" />
          </h5>
          <p className="mb-0">
            <Trans i18nKey="when_done" />
            <strong> <Trans i18nKey="complete" /> </strong>
            <Trans i18nKey="button" />. 
          </p>
        </Modal.Body>
        <Modal.Footer>
          <div className="text-left w-100 mb-3">
            <Form.Check
              type="checkbox"
              label={t('dont_show_again')}
              value={showAgain}
              onChange={handleChange}
            />
          </div>
          <Button variant="primary" block onClick={handleClick}>
            <Trans i18nKey="ok" />
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

TaskStartModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  show: PropTypes.bool,
};

TaskStartModal.defaultProps = {
  show: false,
};

TaskStartModal.displayName = 'TaskStartModal';

export default TaskStartModal;

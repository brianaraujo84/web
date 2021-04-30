import React from 'react';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import InfiniteScroll from 'react-infinite-scroll-component';

const MoveToGroupModal = ({
  onClose,
  onUpdate,
  show,
  createTasksToGroup,
  fetchCustomGroups
}) => {
  const { t } = useTranslation();
  const [selectedTemplateId, setSelectedTemplateId] = React.useState('');

  const {
    items: taskGroups,
    total: numberofTasks,
    inprogress,
  } = useSelector(state => state.taskGroups);
  const taskGroupsNumber = taskGroups.length;
  const hasMore = !Number.isInteger(numberofTasks) || numberofTasks > taskGroupsNumber;

  const handleSelect = (templateId) => {
    setSelectedTemplateId(templateId);
  };

  const handleOnClose = () => {
    onClose();
  };

  return (
    <>
      <Modal show={show} onHide={handleOnClose} centered scrollable={true}>
        <Modal.Header closeButton>
          <Modal.Title as="h5">
            <i className="text-primary far fa-folder" /> {t('Move Tasks to a Group')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {taskGroups.length === 0 && !inprogress &&
            (
              <div className="error text-danger mb-3" role="alert">
                <small className="mb-0">
                  <i className="fas fa-exclamation-triangle mr-2" aria-hidden="true" /> {t('No Task Groups Found')}
                </small>
              </div>
            )
          }
          <div className="form-group">


            <p className="mb-0">
              <small className="form-text text-muted">
                {t('Choose a group to move the selected tasks to or create a new one.')}
              </small>
            </p>

          </div>
          <div id='secondary'>
            {taskGroups.length > 0 && <h6 className="text-secondary mt-4">{t('Available Groups')}</h6>}
            {taskGroups.length > 0 && <div className="list-group">
              <InfiniteScroll
                height={numberofTasks >= 4 ? 300 : numberofTasks * 75}
                dataLength={taskGroups.length}
                next={fetchCustomGroups}
                scrollThreshold="100px"
                hasMore={hasMore}
                loader={<div style={{ textAlign: 'center', padding: 20 }}><i className="far fa-spinner fa-spin fa-2x" aria-hidden="true" /></div>}
              >
                {taskGroups && taskGroups.map((task, index) => (
                  <div className={selectedTemplateId === task.templateId ? 'list-group-item suggestion list-group-item-action px-2 d-flex justify-content-between align-items-center active' : 'list-group-item suggestion list-group-item-action px-2 d-flex justify-content-between align-items-center'} key={index} onClick={() => handleSelect(task.templateId)}>
                    <div className="w-100">
                      <h6 className="mb-0 name">{task.templateName}</h6>
                      <p className="mb-0 phone-number"><small>{t(`${task.numberofTasks} Task${task.numberofTasks === 1 ? '' : 's'}`)}</small></p>
                    </div>
                  </div>
                ))}
              </InfiniteScroll>
            </div>}
            <div>
              <a className="d-block mt-3" href="#" onClick={createTasksToGroup}>{t('Create New Group')}</a>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleOnClose}>
            <Trans i18nKey="cancel" />
          </Button>
          <Button variant="primary" onClick={() => onUpdate(selectedTemplateId)} disabled={!selectedTemplateId} style={{ minWidth: 72 }}>
            <Trans i18nKey="Move" />
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

MoveToGroupModal.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  locationId: PropTypes.string,
  createTasksToGroup: PropTypes.func,
  fetchCustomGroups: PropTypes.func,
};

MoveToGroupModal.defaultProps = {

};

MoveToGroupModal.displayName = 'MoveToGroupModal';
export default MoveToGroupModal;

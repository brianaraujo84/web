import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Trans } from 'react-i18next';
import { classnames } from 'react-form-dynamic';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const TemplatesModal = ({
  onClose,
  onUpdate,
  show,
}) => {

  const [selectedTemplateId, setSelectedTemplateId] = React.useState(-1);

  const templatesList = useSelector(state => state.templates.items);

  const handleTemplateSelection = (idx) => {
    setSelectedTemplateId(idx);
  };

  const updateSelection = () => {
    if (selectedTemplateId === -1) {
      return;
    }
    onUpdate(templatesList[selectedTemplateId]);
  };

  return (
    <>

      <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title as="h5">
            <i className="text-info far fa-file-spreadsheet" /> <Trans>Select Template{selectedTemplateId}</Trans>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="list-group">
              {templatesList.map((tpl, idx) =>
                <div key={idx}
                  className={classnames(
                    [
                      'template d-flex p-0 list-group-item list-group-item-action align-items-stretch',
                      selectedTemplateId === idx ? 'selected' : ''
                    ]
                  )}
                  onClick={() => handleTemplateSelection(idx)}
                  data-target={`template-container-${idx}`}
                >
                  <div className="p-2 bg-light border-right d-flex align-items-center" style={{ borderTopLeftRadius: '0.25rem !important' }}>
                    <img src="/assets/img/logo-gray.png" width="70" />
                  </div>
                  <div className="p-2">
                    <h5 className="mb-1">{tpl.templateName}</h5>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onClose}>
            <Trans>Cancel</Trans>
          </Button>
          <Button variant="primary" onClick={updateSelection} data-target="update-selection">
            <Trans>Use Template</Trans>
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};


TemplatesModal.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
};

TemplatesModal.defaultProps = {
  show: false,
};

TemplatesModal.displayName = 'LocationDetailsTemplatesModal';
export default TemplatesModal;

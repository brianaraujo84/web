import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-form-dynamic';

const priorityList = [1,2,3,4,5,0];

const PriorityModal = ({
  onClose,
  onUpdate,
  show,
  selectedPriority,
}) => {
  const fields = [
    {
      name: 'selectedPriority',
      initialValue: selectedPriority,
      validations: [
        {
          rule: 'required',
        }
      ],
    },
  ];


  const handleSelect = async (item) => {
    formik.setFieldValue('selectedPriority', item);
    onUpdate({ selectedPriority: item });
  };

  const handleOnClose = () => {
    onClose();
  };

  const formik = useForm({ fields });

  React.useEffect(() => {
    formik.validateForm();
  }, []);

  return (
    <>
      <Modal show={show} onHide={handleOnClose} centered scrollable={true}>
        <form>
          <Modal.Header closeButton>
            <Modal.Title as='h5'>
              <i className='text-danger fas fa-flag-alt' /> <Trans i18nKey='task_priority' defaults='Task Priority'/>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <div >
              <div className='list-group'>
                {
                  priorityList.map((item, idx) => {
                    return (
                      <div className={idx + 1 === formik.values.selectedPriority ? 'list-group-item suggestion list-group-item-action px-2 active' : 'list-group-item suggestion list-group-item-action px-2'} key={item} onClick={() => handleSelect(item)}>
                        {item > 0 && <span><i className='text-secondary fas fa-flag-alt mr-1' aria-hidden='true'></i> P{item} </span>}
                        {item === 1 && <span className='small text-danger'>(Highest)</span>}
                        {item === 0 && <span><i className='text-secondary far fa-times-circle mr-1' aria-hidden='true'></i> No priority</span>}
                      </div>
                    );
                  })
                }
              </div>
            </div>
          </Modal.Body>
        </form>
      </Modal>
    </>
  );
};

PriorityModal.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  selectedPriority: PropTypes.number,
};

PriorityModal.defaultProps = {
  onUpdate: () => {},
  onClose: () => {},
};

PriorityModal.displayName = 'LocationDetailsPriorityModal';
export default PriorityModal;

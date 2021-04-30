import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-form-dynamic';

import DatePicker from 'react-datepicker';
import { DateUtils } from '../../../utils';

const DueDateModal = ({
  onClose,
  onUpdate,
  show,
  dueDate,
  minDate,
  task,
}) => {

  const tzLessDate = (dateStr) => {
    const dateArr = dateStr.split('-');
    return DateUtils.transFormDate({ year: dateArr[0], month: dateArr[1] - 1, date: dateArr[2] });
  };
  const dd = dueDate ? tzLessDate(dueDate) : new Date();

  const fields = [
    {
      name: 'dueDate',
      initialValue: dd,
      validations: [
        {
          rule: 'required',
        }
      ],
    },
  ];
  const datePickerRef = React.useRef(null);

  const onSubmit = (values, { resetForm }) => {
    onUpdate({ ...values });
    resetForm();
  };

  const handleSelect = (date) => {
    formik.setFieldValue('dueDate', date).then(() => {
      formik.handleSubmit();
    });
  };

  const handleOnClose = () => {
    onClose();
  };

  const formik = useForm({ fields, onSubmit });

  React.useEffect(() => {
    formik.validateForm();
  }, []);

  React.useEffect(() => {
    if (datePickerRef.current !== null) {
      //datePickerRef.current.input.readOnly = true;
    }
  }, [show]);

  const latestStartDate = minDate ? new Date(minDate.replace(/-/g, '/',)) : task?.taskRecurring?.startDate ? new Date(task?.taskRecurring?.startDate?.slice(0, -9).replace(/-/g, '/',)) : new Date();

  return (
    <>
      <Modal show={show} onHide={handleOnClose} centered scrollable={true}>
        <form onSubmit={formik.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title as="h5">
              <i className="text-primary ci ci-due-f mr-1" /> <Trans i18nKey="due_date" defaults="Due Date"/>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Select the date this task is due by.</p>
            <div >
              <div className="list-group">
                <DatePicker
                  className="form-control"
                  onChange={handleSelect}
                  selected={formik.values.dueDate}
                  minDate={latestStartDate < new Date() ? new Date() : latestStartDate}
                  data-target="date-picker-date"
                  customInput={<input style={{backgroundColor: '#ffffff'}}></input>}
                  ref={datePickerRef}
                  inline
                />
              </div>
            </div>
          </Modal.Body>
          {/*<Modal.Footer>
            <Button variant="outline-secondary" onClick={handleOnClose}>
              <Trans i18nKey="cancel" />
            </Button>
            <Button variant="primary" type="submit" disabled={!formik.isValid || formik.isSubmitting || !formik.values.dueDate} style={{ minWidth: 72 }}>
              <Trans i18nKey="save" />
            </Button>
          </Modal.Footer>*/}
        </form>
      </Modal>
    </>
  );
};

DueDateModal.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  dueDate: PropTypes.string,
  minDate: PropTypes.any,
  task: PropTypes.object,
};

DueDateModal.defaultProps = {
  onUpdate: () => {},
  onClose: () => {},
};

DueDateModal.displayName = 'LocationDetailsDueDateModal';
export default DueDateModal;

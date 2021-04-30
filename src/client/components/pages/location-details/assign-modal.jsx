import React from 'react';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useForm, classnames } from 'react-form-dynamic';

import * as URLS from '../../../urls';
import { phoneFormat } from '../../../utils';
import PhoneInput from '../../shared/phone-input';
import ScrollableList from '../../shared/scrollable-list';


const styles = {
  img: {
    width: '35px',
  },
  clearButton: {
    marginLeft: '-40px',
    zIndex: '100',
  },
};

const AssignModal = ({
  isJob,
  onClose,
  assigneeUserName,
  onUpdate,
  show,
}) => {
  const { t } = useTranslation();
  const inputRef = React.useRef(null);
  const [error, setError] = React.useState('');

  const contacts = useSelector(state => state.contacts.items);

  const [filteredContacts, setFilteredContacts] = React.useState(contacts);
  const [currentAssigneeUserName, setCurrentAssigneeUserName] = React.useState(assigneeUserName || '');

  const fields = [
    {
      name: 'assigneeMobile',
      validations: [
        {
          rule: 'required',
        },
        {
          rule: 'test',
          params: [
            'isValid',
            t('Incorrect Contact Format'),
            function (userName) {
              return isValidContact(userName);
            }
          ]
        }
      ],
    },
    {
      name: 'assigneeName',
    },
    {
      name: 'userName',
    },
    {
      name: 'search',
    },
  ];

  const onSubmit = (values, { resetForm }) => {
    onUpdate({ ...values });
    resetForm();
    setFilteredContacts(contacts);
  };

  const handleSelectAssignee = (mobilePhone, userName, firstName, lastName) => () => {
    formik.setFieldValue('assigneeName', `${firstName} ${lastName}`);
    formik.setFieldValue('userName', userName);
    formik.setFieldValue('assigneeMobile', mobilePhone);
    setCurrentAssigneeUserName(userName);
  };

  const isValidContact = (contact) => {
    return /^\+{1}(\d|\u002E|\u002d){11,19}$/.test(contact)
      ? contact
      : /^(\d|\u002E|\u002d){10,19}$/.test(contact)
        ? `${formik.values._countryCode}${contact}`
        : '';
  };

  const isManager = (contactTypeLabel) => {
    return contactTypeLabel.toLowerCase().includes('manager') || contactTypeLabel.toLowerCase().includes('owner');
  };

  const handleClear = () => {
    formik.setFieldValue('assigneeMobile', '');
    setFilteredContacts(contacts);
    window.setTimeout(() => {
      formik.validateForm();
    });
  };

  const handleChangeName = (event) => {
    const { value } = event.target;
    setError('');
    const filtered = contacts.filter(({ firstName, lastName }) => {
      return (
        `${firstName} ${lastName}`.toLowerCase().includes(value.toLowerCase())
      );
    });
    if (!filtered.length) {
      if (/(\+){0,1}(\d)+/.test(value) === false) {
        setError(t('User not found, please use phone number to invite user'));
      }
      if (isValidContact(value)) {
        formik.setFieldValue('assigneeMobile', `${formik.values._countryCode}${value}`);
      } else {
        formik.setFieldValue('assigneeMobile', '');
      }
    } else {
      setFilteredContacts(filtered);
    }
  };

  const handleOnClose = () => {
    handleClear();
    onClose();
  };

  const formik = useForm({ fields, onSubmit });

  React.useEffect(() => {
    formik.validateForm();
  }, []);

  React.useEffect(() => {
    setFilteredContacts(contacts);
  },[contacts]);

  React.useEffect(() => {
    formik.setFieldValue('assigneeMobile', '');
    setError('');
  }, [show]);

  return (
    <>
      <Modal show={show} onHide={handleOnClose} centered scrollable={true}>
        <form onSubmit={formik.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title as="h5">
              <i className="text-info fad fa-user-plus" /> <Trans i18nKey={isJob ? 'assign_group' : 'assign_task'} />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {!!error &&
              (
                <div className="error text-danger mb-3" role="alert">
                  <small className="mb-0">
                    <i className="fas fa-exclamation-triangle mr-2" aria-hidden="true" /> {error}
                  </small>
                </div>
              )
            }
            <div className="form-group">
              <PhoneInput
                name="assigneeMobile"
                formik={formik}
                placeholder={t('add_search_name')}
                data-target="phone-input"
                autoComplete="off"
                ref={inputRef}
                onChange={handleChangeName}
                onClear={() => setFilteredContacts(contacts)}
              />

              <p className="mb-0">
                <small className="form-text text-muted">
                  <Trans i18nKey={isJob ? 'assign_group_text' : 'assign_task_text'} />
                </small>
              </p>

            </div>
            <div >
              <h6 className="text-secondary mt-4"><Trans i18nKey="available_team" /></h6>
              <div className="list-group">
                <ScrollableList>
                  {
                    filteredContacts.map(({
                      contactId,
                      userName,
                      mobilePhone,
                      firstName,
                      lastName,
                      contactTypeLabel,
                    }) => {
                      const isSelected = currentAssigneeUserName === userName || (mobilePhone && formik.values.mobilePhone === mobilePhone);
                      return (
                        <div
                          className={classnames([
                            'list-group-item list-group-item-action px-2 d-flex justify-content-between align-items-center suggestion',
                            isSelected && 'selected'
                          ])}
                          key={contactId}
                          onClick={handleSelectAssignee(mobilePhone, userName, firstName, lastName)}
                        >
                          <img className="rounded-circle avatar-small border border-secondary mr-3" src={URLS.PROFILE_IMAGE_THUMB(userName)} style={styles.img} />
                          <div className={classnames(['w-100'])}>
                            <h6 className="mb-0">
                              {(firstName || lastName) ? `${firstName} ${lastName.charAt(0)}.` : 'Invited'}
                              {contactTypeLabel ? (
                                <>
                                  <small className="text-secondary mx-1">|</small>
                                  <small className={isManager(contactTypeLabel) ? 'text-danger' : 'text-info'}>{contactTypeLabel}</small>
                                </>
                              ) : <small />}
                            </h6>
                            <p className="mb-0"><small>{phoneFormat(mobilePhone || userName)}</small></p>
                          </div>
                          <i className="selected fas fa-check text-success mr-2" aria-hidden="true"></i>
                        </div>
                      );
                    })
                  }
                </ScrollableList>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleOnClose}>
              <Trans i18nKey="cancel" />
            </Button>
            <Button variant="primary" type="submit" disabled={!formik.isValid || formik.isSubmitting} style={{ minWidth: 72 }}>
              <Trans i18nKey="assign" />
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

AssignModal.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  assignee: PropTypes.string,
  assigneeUserName: PropTypes.string,
  show: PropTypes.bool,
  isJob: PropTypes.bool,
  isEdit: PropTypes.bool,
};

AssignModal.defaultProps = {
  isJob: false,
  show: false,
  assignee: '',
  assigneeUserName: '',
};

AssignModal.displayName = 'LocationDetailsAssignModal';
export default AssignModal;

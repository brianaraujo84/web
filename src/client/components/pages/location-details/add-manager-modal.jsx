import React from 'react';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useParams } from 'react-router-dom';
import { useForm, classnames } from 'react-form-dynamic';

import PhoneInput from '../../shared/phone-input';
import ScrollableList from '../../shared/scrollable-list';

import * as URLS from '../../../urls';

import { phoneFormat } from '../../../utils';
import { useActionDispatch } from '../../../hooks';
import { getStandardObjectsList } from '../../../redux/actions/objects';
import { postConfidenceObject } from '../../../redux/actions/object';

const styles = {
  img: {
    width: '35px',
  },
  clearButton: {
    marginLeft: '-40px',
    zIndex: '100',
  },
};

const OBJECT_MANAGERS = 'managers';
const OBJECT_CONTACTS = 'contacts';

const AddManagerModal = ({
  onClose,
  onUpdate,
  show,
}) => {
  const { t } = useTranslation();
  const inputRef = React.useRef(null);
  const { locationId } = useParams();

  const contacts = useSelector(state => state.contacts.items);

  const [filteredContacts, setFilteredContacts] = React.useState(contacts);
  const [error, setError] = React.useState('');

  const addManagers = useActionDispatch(postConfidenceObject(OBJECT_CONTACTS));
  const getManagers = useActionDispatch(getStandardObjectsList(OBJECT_MANAGERS, 'contacts', undefined, 'location', '/reporter'));
  const getContacts = useActionDispatch(getStandardObjectsList(OBJECT_CONTACTS, 'contacts', undefined, 'location', '/contacts'));

  const fields = [
    {
      name: 'selectedUsers',
      initialValue: {},
      validations: [
        {
          rule: 'required',
        },
        {
          rule: 'test',
          params: [
            'isValid',
            t('Incorrect Contact Format'),
            function () {
              return isValid();
            }
          ]
        }
      ],
    },
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
      name: 'search',
    },
    {
      name: 'newInvites',
      initialValue: {},
    },
  ];

  const isManager = (contactTypeLabel) => {
    return contactTypeLabel.toLowerCase().includes('manager') || contactTypeLabel.toLowerCase().includes('owner');
  };

  const onSubmit = async () => {
    const values = formik.values;
    const resetForm = formik.resetForm;
    const users = Object.keys(values.selectedUsers);
    const invites = Object.keys(values.newInvites);
    const data = {
      contactRole: 'Manager',
      contactUsers: [...users, ...invites],
      locationId,
    };
    onClose();
    await addManagers(data);
    getManagers(locationId);
    getContacts(locationId);
    onUpdate({ ...values });
    resetForm();
  };

  const handleSelectAssignee = (mobilePhone, userName) => () => {
    const selectedValues = formik.values.selectedUsers || {};
    const id = mobilePhone || userName;
    if (selectedValues[id]) {
      delete selectedValues[id];
    } else {
      selectedValues[id] = true;
    }
    formik.setFieldValue('selectedUsers', {...selectedValues});
  };

  const isValidContact = (contact) => {
    return /^\+{1}(\d|\u002E|\u002d){11,19}$/.test(contact)
      ? contact
      : /^(\d|\u002E|\u002d){10,19}$/.test(contact)
        ? `${formik.values._countryCode}${contact}`
        : '';
  };

  const isValid = () => {
    const users = formik.values.selectedUsers || {};
    return Object.keys(users).length > 0;
  };

  const removeNewInvite = (user) => {
    const users = formik.values.newInvites || {};
    delete users[user];
    formik.setFieldValue('newInvites', {...users});
  };

  const addNewInvite = () => {
    const user = formik.values.assigneeMobile;
    const users = formik.values.newInvites || {};
    users[user] = true;
    formik.setFieldValue('newInvites', {...users});
    formik.setFieldValue('_inputPhoneName', '');
    formik.setFieldValue('assigneeMobile', '');
    formik.setTouched({ assigneeMobile: false });
  };

  const isValidToSubmit = () => {
    const isValidData =  Object.keys(formik.values.selectedUsers).length > 0 || Object.keys(formik.values.newInvites).length > 0;
    return isValidData;
  };

  const handleChangeName = (event) => {
    const { value } = event.target;
    const filtered = contacts.filter(({ firstName, lastName }) => {
      return (
        `${firstName} ${lastName}`?.toLowerCase().includes(value.toLowerCase())
      );
    });
    if (!filtered.length) {
      if (/\D/.test(value)) {
        setError(t('User not found, please use phone number to invite user'));
      }
      if (isValidContact(value)) {
        formik.setFieldValue('assigneeMobile', `${formik.values._countryCode}${value}`);
      } else {
        formik.setFieldValue('assigneeMobile', '');
      }
    } else {
      setFilteredContacts(filtered);
      setError('');
    }
  };


  React.useEffect(() => {
    setFilteredContacts(contacts);
  },[contacts]);

  React.useEffect(() => {
    formik.validateForm();
  }, []);

  const formik = useForm({ fields, onSubmit });

  return (
    <>
      <Modal show={show} onHide={onClose} centered>
        <form onSubmit={formik.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title as="h5">
              <i className="text-primary fad fa-users" /> <Trans i18nKey="invite_to_team" defaults="Invite to Team"/>
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
              <div className="d-flex align-items-center mb-2">
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
                <Button
                  className="btn btn-primary ml-2"
                  onClick={addNewInvite}
                  disabled={formik.errors && formik.errors.assigneeMobile}
                >
                  <i className="fas fa-plus" aria-hidden="true"></i>
                </Button>
              </div>
            </div>

            {Object.keys(formik.values.newInvites).length > 0 && <div id="new-invites">
              <h6 className="text-secondary mt-4">Invite</h6>
              <div className="list-group">
                {Object.keys(formik.values.newInvites).map((u, idx) => (
                  <div key={idx} className="list-group-item list-group-item-action px-2 d-flex justify-content-between align-items-center">
                    <div className="w-100">
                      <h6 className="mb-0">{phoneFormat(u)}</h6>
                      <select className="form-control form-control-sm w-auto mt-2 d-none">
                        <option selected="">Team Member</option>
                        <option>Manager</option>
                      </select>
                    </div>
                    <div className="text-right">
                      <i className="fas fa-times-circle text-danger mr-2" aria-hidden="true" onClick={() => removeNewInvite(u)}></i>
                    </div>
                  </div>))}
              </div>
            </div>}
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
                      return (
                        <div
                          className={classnames([
                            'list-group-item list-group-item-action px-2 d-flex justify-content-between align-items-center suggestion'
                          ])}
                          key={contactId}
                          onClick={handleSelectAssignee(mobilePhone, userName)}
                        >
                          <img className="rounded-circle border border-secondary mr-3 avatar-small" src={URLS.PROFILE_IMAGE_THUMB(userName)} style={styles.img} />
                          <div className={classnames(['w-100'])}>
                            <h6 className="mb-0">
                              {(firstName || lastName) ? `${firstName} ${lastName.charAt(0)}.` : 'Invitation Sent'}
                              {contactTypeLabel ? (
                                <>
                                  <small className="text-secondary mx-1">|</small>
                                  <small className={isManager(contactTypeLabel) ? 'text-danger' : 'text-info'}>{contactTypeLabel}</small>
                                </>
                              ) : <small />}
                            </h6>
                            <p className="mb-0"><small>{phoneFormat(mobilePhone || userName)}</small></p>
                          </div>
                          {(formik.values.selectedUsers[mobilePhone] || formik.values.selectedUsers[userName]) ? <i className="fas fa-check text-success"></i> : undefined}
                        </div>
                      );
                    })
                  }
                </ScrollableList>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={onClose}>
              <Trans i18nKey="cancel" />
            </Button>
            <Button variant="primary" onClick={onSubmit} disabled={!isValidToSubmit()}>
              <Trans i18nKey="invite" defaults="Invite"/>
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};
AddManagerModal.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  manager: PropTypes.string,
  show: PropTypes.bool,
};

AddManagerModal.defaultProps = {
  show: false,
  manager: '',
};

AddManagerModal.displayName = 'AddManagerModal';
export default AddManagerModal;

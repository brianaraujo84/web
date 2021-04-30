import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { useParams, useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { useActionDispatch } from '../../../hooks';
import { removeFromList } from '../../../redux/actions/objects';
import { postConfidenceObject } from '../../../redux/actions/object';
import { phoneFormat } from '../../../utils';

import * as URLS from '../../../urls';

import AddManagerModal from './add-manager-modal';

const styles = {
  userpic: {
    width: '35px',
  },
};

const OBJECT_MANAGERS = 'managers';
const OBJECT_CONTACTS = 'contacts';

const LocationManagersModal = ({
  onClose,
  show,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { locationId } = useParams();
  const [showAddModal, setShowAddModal] = React.useState(false);
  const managers = useSelector(state => state.managers.items);
  const profile = useSelector(state => state.profile.data);

  const deleteManager = useActionDispatch(postConfidenceObject(OBJECT_CONTACTS));
  const removeManagerFromList = useActionDispatch(removeFromList(OBJECT_MANAGERS));

  const handleAddClick = () => {
    setShowAddModal(true);
    onClose();
  };

  const isManager = (contactTypeLabel) => {
    return contactTypeLabel.toLowerCase().includes('manager') || contactTypeLabel.toLowerCase().includes('owner');
  };

  const handleRemove = async (contactUser, index) => {
    const data = {
      locationId,
      contactUsers: [contactUser],
      action: 'delete',
      contactRole: 'Manager',
    };
    try {
      await deleteManager(data);
      removeManagerFromList(index);
    } catch (e) {
      history.push(URLS.PAGE_400);
    }
  };

  return (
    <>
      <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title as="h5">
            <i className="text-primary fad fa-users" aria-hidden="true" /> <Trans i18nKey="workspace_mgrs" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="list-group">
              {
                managers.filter(manager => !!manager?.mobilePhone).map(({
                  contactId,
                  firstName,
                  lastName,
                  userName,
                  mobilePhone,
                  contactTypeLabel,
                }, index) =>
                  (
                    <div
                      className="list-group-item list-group-item-action px-2 d-flex justify-content-between align-items-center"
                      key={contactId}
                    >
                      <img className="rounded-circle border border-secondary mr-3 avatar-small" src={URLS.PROFILE_IMAGE_THUMB(userName)} style={styles.userpic} />
                      <div className="w-100">
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
                      {
                        managers.length > 1 && profile.username !== userName &&
                        (
                          <button
                            className="text-danger btn p-0 mb-0"
                            role="button"
                            title={t('Remove')}
                            onClick={() => handleRemove(userName, index)}
                            data-target="remove-manager-btn"
                          >
                            <i className="fas fa-times-circle" aria-hidden="true"></i> <span className="sr-only"><Trans>Remove Manager</Trans></span>
                          </button>
                        )
                      }

                    </div>
                  ))
              }

            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handleAddClick}
            data-target="button-add"
          >
            <Trans i18nKey="add_users_to" defaults="Add Users to Team" />
          </Button>
        </Modal.Footer>
      </Modal>

      <AddManagerModal
        onClose={() => setShowAddModal(false)}
        onUpdate={() => setShowAddModal(false)}
        show={showAddModal}
        currentManagerMobilePhone={managers[0]?.mobilePhone}
      />
    </>
  );
};


LocationManagersModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
};

LocationManagersModal.defaultProps = {
  show: false,
};

LocationManagersModal.displayName = 'LocationManagersModal';
export default LocationManagersModal;

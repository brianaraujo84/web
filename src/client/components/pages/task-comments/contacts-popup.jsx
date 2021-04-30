import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { useTitle } from '../../../hooks';
import * as URLS from '../../../urls';
import { useDetectOutsideClick } from '../../../hooks/useDetectOutsideClick';

const ContactsPopup = ({contacts, showContactsPopup, handleContactSelect, contactFilter, setcontactFilter, removedAtSymbolFromComment }) => {
  const { t } = useTranslation();
  useTitle(t('Task Comments'));
  const dropdownRef = React.useRef(null);

  const handleClose = () => {
    removedAtSymbolFromComment();
    setcontactFilter('');
  };

  useDetectOutsideClick(dropdownRef, () => handleClose());

  return (
    <div
      className={showContactsPopup ? 'dropdown-menu show' : 'dropdown-menu'}
      x-placement='top-start'
      style={{
        position: 'absolute',
        bottom: '55px',
        left: '1rem',
        top: 'auto',
      }}
      aria-expanded='true'
    >
      <h6 className='dropdown-header' ref={dropdownRef}>Mention Teammate</h6>
      <a
        className='dropdown-item px-3 py-2'
        href='#'
        onClick={() => handleContactSelect({ firstName: 'All', lastName: '' })}
      >
        <i className='fad fa-lg fa-users' aria-hidden='true'></i> All Teammates
      </a>
      {contacts
        .filter(contact => contact.firstName && contact)
        .filter((contact) =>
          contactFilter
            ? contact.firstName?.toLowerCase().includes(contactFilter.toLowerCase()) ||
              contact.lastName?.toLowerCase().includes(contactFilter.toLowerCase()) ||
              contact.userName?.toLowerCase().includes(contactFilter.toLowerCase()) ||
              contact.mobilePhone?.toLowerCase().includes(contactFilter.toLowerCase())
            : contact
        )
        .map((contact, index) => (
          <a
            key={index}
            className='dropdown-item px-3 py-2'
            href='#'
            onClick={() => handleContactSelect(contact)}
          >
            <img
              className='rounded-circle border border-secondary'
              src={URLS.PROFILE_IMAGE_THUMB(contact.userName)}
              style={{ width: '25px' }}
            />
            {(contact.firstName && contact.lastName) ? t(` ${contact.firstName} ${contact.lastName?.slice(0, 1)}  `) : t(` ${contact.firstName} `)}
            <small className='text-secondary'>
              {t(contact.contactTypeLabel)}
            </small>
          </a>
        ))}
    </div>
  );
};

ContactsPopup.propTypes = {
  contacts: PropTypes.array,
  showContactsPopup: PropTypes.bool,
  handleContactSelect: PropTypes.func,
  setShowContactsPopup: PropTypes.func,
  contactFilter: PropTypes.string,
  setcontactFilter: PropTypes.func,
  removedAtSymbolFromComment: PropTypes.func,
};
ContactsPopup.displayName = 'ContactsPopup';
export default ContactsPopup;

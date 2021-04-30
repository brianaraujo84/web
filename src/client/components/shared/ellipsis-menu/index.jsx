import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Trans } from 'react-i18next';
import { useDetectOutsideClick } from '../../../hooks/useDetectOutsideClick';

function  EllipsisMenu({
  isConvertGroupActive,
  isDescriptionActive,
  isCopyActive,
  isAssociateActive,
  isAddImagesActive,
  isAddScreenshotsActive,
  handleConvertGroup,
  handleShowEditDescription,
  handleAddImageButtonClick,
  handleAddScreenshotButtonClick,
  handleAddZoneClick,
  handleCopy,
  handler,
  isJob,
  addDevice,
  isAddDeviceActive,
  setPriority,
  isSetPriorityActive,
  setDueDate,
  isSetDueDateActive,
  addFile,
  isAddFileActive,
  handleRequireVerificationClick,
  isRequireVerificationActive,
}) {
  const dropdownRef = React.useRef(null);
  const onClick = () => handler(false);
  useDetectOutsideClick(dropdownRef, () => handler(false));

  return (
    <EllipsisMenuContainer className='menu-container d-inline-block'>
      <nav
        ref={dropdownRef}
        className="menu active"
      >
        <ul>
          {isConvertGroupActive && (
            <li>
              <p data-target="convertgroup-menu-item" onClick={() => {
                handleConvertGroup();
                onClick();
              }}>
                <Trans>Convert To Group</Trans>
              </p>
            </li>  
          )}
          {isAddImagesActive && (
            <li>
              <p data-target="photo-menu-item" onClick={() => {
                handleAddImageButtonClick();
                onClick();
              }}>
                <Trans i18nKey="add_photo" />
              </p>
            </li>  
          )}
          {isAddScreenshotsActive && (
            <li>
              <p data-target="screenshot-menu-item" onClick={() => {
                handleAddScreenshotButtonClick();
                onClick();
              }}>
                <Trans i18nKey="add_screenshot" />
              </p>
            </li>  
          )}
          {isDescriptionActive ? (
            <li>
              <p className="text-truncate" data-target="description-menu-item" onClick={() => {
                handleShowEditDescription();
                onClick();
              }}>
                <Trans i18nKey="add_desc" />
              </p>
            </li>
          ) : undefined}
          {isCopyActive ? (
            <li>
              <p data-target="copy-menu-item" onClick={() => {
                handleCopy();
                onClick();
              }}>
                <Trans i18nKey={isJob ? 'copy_job' : 'copy_task'} />
              </p>
            </li>
          ) : undefined}
          {isAssociateActive ? (
            <li>
              <p data-target="associate-menu-item" onClick={() => {
                handleAddZoneClick();
                onClick();
              }}>
                <Trans i18nKey="associate_zone" />
              </p>
            </li>
          ) : undefined}
          {isAddDeviceActive ? (
            <li>
              <p data-target="add-device-item" onClick={() => {
                addDevice();
                onClick();
              }}>
                <Trans i18nKey="add_device" />
              </p>
            </li>
          ) : undefined}
          {isSetPriorityActive ? (
            <li>
              <p data-target="add-device-item" onClick={() => {
                setPriority();
                onClick();
              }}>
                <Trans i18nKey="set_priority" defaults="Set Priority"/>
              </p>
            </li>
          ) : undefined}
          {isSetDueDateActive ? (
            <li>
              <p data-target="add-device-item" onClick={() => {
                setDueDate();
                onClick();
              }}>
                <Trans i18nKey="set_due_date" defaults="Set Due Date"/>
              </p>
            </li>
          ) : undefined}
          {isAddFileActive ? (
            <li>
              <p data-target="add-device-item" onClick={() => {
                addFile();
                onClick();
              }}>
                <Trans i18nKey="add_file" defaults="Add File"/>
              </p>
            </li>
          ) : undefined}
          {isRequireVerificationActive ? (
            <li>
              <p data-target="require-verification" onClick={() => {
                handleRequireVerificationClick();
                onClick();
              }}>
                <Trans i18nKey="require_verification" defaults="Require Verification"/>
              </p>
            </li>
          ) : undefined}
          <li>
            <p className="close-button" data-target="close-menu-item" onClick={onClick}>
              <Trans i18nKey="close" />
            </p>
          </li>
        </ul>
      </nav>
    </EllipsisMenuContainer>
  );
}

export const EllipsisMenuContainer = styled.div`
.menu {
  background: #ffffff;
  border-radius: 4px;
  position: absolute;
  bottom: 0px;
  right: 0px;
  width: 180px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  opacity: 0;
  visibility: hidden;
  transform: translateY(100px);
  transition: opacity 0.4s ease, transform 0.4s ease, visibility 0.4s;
  z-index: 99;
}
.menu.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
.menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.menu li p {
  text-align:left;
  text-decoration: none;
  padding: 0 15px;
  margin: 0;
  display: block;
  width: 100%;
  cursor: pointer;
  line-height: 50px;
  height: 50px;
}
.close-button {
  border-top: thin solid #dee2e6;
  color: #6c757d;
}
@media (min-width: 0px) and (max-width: 567px) {
}
@media (min-width: 568px) and (max-width: 767px) {
}
@media (min-width: 768px) and (max-width: 1023px) {
}
@media (min-width: 1024px) and (max-width: 1365px) {
}
@media (min-width: 1366px) {
}
`;

EllipsisMenu.propTypes = {
  isConvertGroupActive: PropTypes.bool.isRequired,
  isDescriptionActive: PropTypes.bool.isRequired,
  isCopyActive: PropTypes.bool.isRequired,
  isAssociateActive: PropTypes.bool.isRequired,
  isAddImagesActive: PropTypes.bool,
  isAddScreenshotsActive: PropTypes.bool,
  descriptionFunction: PropTypes.func,
  copyFunction: PropTypes.func,
  associateFunction: PropTypes.func,
  isJob: PropTypes.bool,
  handleConvertGroup: PropTypes.func,
  handleShowEditDescription: PropTypes.func,
  handleAddImageButtonClick: PropTypes.func,
  handleAddScreenshotButtonClick: PropTypes.func,
  showMenu: PropTypes.bool,
  setShowMenu: PropTypes.func,
  handleAddZoneClick: PropTypes.func,
  handler: PropTypes.func,
  handleCopy: PropTypes.func,
  addDevice: PropTypes.func,
  isAddDeviceActive: PropTypes.bool,
  setPriority: PropTypes.func,
  isSetPriorityActive: PropTypes.bool,
  setDueDate: PropTypes.func,
  isSetDueDateActive: PropTypes.bool,
  addFile: PropTypes.func,
  isAddFileActive: PropTypes.bool,
  handleRequireVerificationClick: PropTypes.func,
  isRequireVerificationActive: PropTypes.bool,
};

EllipsisMenu.defaultProps = {
  isConvertGroupActive: false,
  isDescriptionActive: true,
  isCopyActive: true,
  isAssociateActive: true,
  handler: () => {},
  isSetPriorityActive: false,
  isSetDueDateActive: false,
  isAddFileActive: false,
  isRequireVerificationActive: false,
};

EllipsisMenu.displayName = 'EllipsisMenu';
export default EllipsisMenu;

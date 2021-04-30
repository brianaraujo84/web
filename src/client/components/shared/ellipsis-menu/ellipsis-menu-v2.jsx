import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useDetectOutsideClick } from '../../../hooks/useDetectOutsideClick';

function  EllipsisMenuV2({
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
  setStartDate,
  isSetStartDateActive,
  setTaskLink,
  isSetTaskLinkActive,
}) {
  const dropdownRef = React.useRef(null);
  const onClick = () => handler(false);
  useDetectOutsideClick(dropdownRef, () => handler(false));
  const { t } = useTranslation();

  const menuSelected = (fn) => {
    if (fn) {
      fn();
      onClick();
    }
  };

  const prepareMenu = () => {
    const cells = [];
    if (isConvertGroupActive) {
      cells.push({ label: t('Convert To Group'), icon: 'fa-file-plus', fn: handleConvertGroup });
    }
    if (isCopyActive) {
      cells.push({ label: t(isJob ? 'copy_job' : 'copy_task'), icon: 'fa-clone', fn: handleCopy });
    }
    if (isAssociateActive) {
      cells.push({ label: t('associate_zone'), icon: 'fa-border-none', fn: handleAddZoneClick });
    }

    if (isAddImagesActive) {
      cells.push({ label: t('add_photo'),icon: 'fa-camera', fn: handleAddImageButtonClick });
    }
    if (isAddScreenshotsActive) {
      cells.push({ label: t('add_screenshot'),icon: 'fa-image', fn: handleAddScreenshotButtonClick });
    }
    if (isDescriptionActive) {
      cells.push({ label: t('add_desc'), icon: 'fa-align-left', fn: handleShowEditDescription });
    }
    if (isAddFileActive) {
      cells.push({ label: t('Add File'), icon: 'fa-file', fn: addFile });
    }

    if (isSetStartDateActive) {
      cells.push({ label: t('Set Start Date'), icon: 'fa-hourglass-start', fn: setStartDate });
    }
    if (isAddDeviceActive) {
      cells.push({ label: t('add_device'), icon: 'fa-tablet-android-alt', fn: addDevice });
    }
    if (isSetPriorityActive) {
      cells.push({ label: t('Set Priority'), icon: 'fa-flag-alt', fn: setPriority });
    }
    if (isSetDueDateActive) {
      cells.push({ label: t('Set Due Date'), icon: 'ci ci-due', fn: setDueDate });
    }
    if (isSetTaskLinkActive) {
      cells.push({ label: t('Set Task Link'), icon: 'far fa-link', fn: setTaskLink });
    }

    const perRowCount = 3;
    const itemsCount = cells ? cells.length : 0;
    const rows = [...Array(Math.ceil(itemsCount / perRowCount))];
    const groupedCells = rows.map((row, idx) => {
      const chunk = cells.slice(idx * perRowCount, (idx + 1) * perRowCount);
      const fillItems = perRowCount - chunk.length;
      if (fillItems !== 0) {
        for (let i = 0; i < fillItems; i++) {
          chunk.push({});
        }
      }
      return chunk;
    });
    return { menuItems: groupedCells, totalItems: cells.length };
  };
  const { menuItems, totalItems } = React.useMemo(prepareMenu, []);

  return (
    <EllipsisMenuV2Container className='menu-container d-inline-block'>
      <div className="bg-white rounded border shadow position-absolute" style={{ right: `${totalItems > 1 ? '0px' : '40px'}`, zIndex: 1000, bottom: '0px' }} ref={dropdownRef}>
        {menuItems && menuItems.map((row, rowIdx) => (
          <div className="d-flex small w-100 text-center" key={rowIdx}>
            {row.map((item, idx) => (
              <>
                {item.label && <a className={`col ${idx !== 3 && 'border-right'} border-bottom pb-2 pt-3`} key={idx} onClick={() => menuSelected(item.fn)} style={{color: '#007bff', minWidth: '88.5px'}}>
                  <i className={`far ${item.icon} fa-2x mb-1`} aria-hidden="true"></i>
                  <span className="d-block" style={{lineHeight: 1.15}}>{item.label}</span>
                </a>}
                {!item.label && rowIdx !== 0 && <a className={`col ${idx !== 3 && 'border-right'} border-bottom pb-2 pt-3`} style={{color: '#007bff'}}></a>}
              </>))}
          </div>))}
      </div>
    </EllipsisMenuV2Container>
  );
}

export const EllipsisMenuV2Container = styled.div`
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

EllipsisMenuV2.propTypes = {
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
  setStartDate: PropTypes.func,
  isSetStartDateActive: PropTypes.bool,
  setTaskLink: PropTypes.func,
  isSetTaskLinkActive: PropTypes.bool,
};

EllipsisMenuV2.defaultProps = {
  isConvertGroupActive: false,
  isDescriptionActive: true,
  isCopyActive: true,
  isAssociateActive: true,
  handler: () => {},
  isSetPriorityActive: false,
  isSetDueDateActive: false,
  isAddFileActive: false,
  isSetStartDateActive: false,
  isSetTaskLinkActive: false,
};

EllipsisMenuV2.displayName = 'EllipsisMenuV2';
export default EllipsisMenuV2;

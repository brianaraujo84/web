import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useSwipeable } from 'react-swipeable';
import { useDetectOutsideClick } from '../../../hooks/useDetectOutsideClick';
import { useIsMobile } from '../../../hooks';


function  EllipsisMenuV2({
  isConvertGroupActive,
  isDescriptionActive,
  isCopyActive,
  isAssociateActive,
  isAddImagesActive,
  handleConvertGroup,
  handleShowEditDescription,
  handleAddImageButtonClick,
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
  handleRequireVerificationClick,
  isRequireVerificationActive,
  handleCopyGroupClick,
  isCopyGroupActive,
  isAssignActive,
  handleAssignClick,
  isAddScreenshotsActive,
  handleAddScreenshotButtonClick,
  cardSkin,
  hideEmptyRows,
  isMoveToGroupActive,
  handleMoveToGroup,
  isCreateGroupActive,
  handleCreateGroup,
  isGroupCard,
  isMember,
  task,
  isBulkSelectMenu,
}) {
  const dropdownRef = React.useRef(null);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const onClick = () => handler(false);
  useDetectOutsideClick(dropdownRef, () => handler(false));
  const { t } = useTranslation();

  const isMobile = useIsMobile();

  const handlers = useSwipeable({
    onSwipedLeft: () => slideTo('left'),
    onSwipedRight: () => slideTo('right'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  const slideTo = (type) => {
    if (slidesCount <= 1) {
      return;
    }
    let cs = currentSlide;
    if (type === 'left') {
      cs = currentSlide === 0 ? 1 : 0;
    } else if (type === 'right') {
      cs = currentSlide === 1 ? 0 : 1;
    }
    setCurrentSlide(cs);
  };

  const menuSelected = (item) => {
    if (!item.disabled) {
      item.fn?.();
      onClick();
    }
  };

  const prepareMenu = () => {
    const cells = [];
    if (isAddScreenshotsActive && window.electron && !isGroupCard &&!isBulkSelectMenu) {
      cells.push({ label: t('Add Screenshot'), icon: 'far fa-image', fn: handleAddScreenshotButtonClick, disabled: isMobile });
    } else if (isAddScreenshotsActive && !isGroupCard && !isMember && !isBulkSelectMenu) {
      cells.push({ label: t('Add Screenshot'), icon: 'far fa-image', fn: handleAddScreenshotButtonClick, disabled: isMobile });
    }
    if (isAddImagesActive && !isGroupCard) {
      cells.push({ label: t('add_photo'),icon: 'far fa-camera', fn: handleAddImageButtonClick });
    }
    if (isRequireVerificationActive) {
      cells.push({ label: t('Require Verification'), icon: 'far fa-check-square', fn: handleRequireVerificationClick });
    }
    if (isDescriptionActive) {
      cells.push({ label: t('add_desc'), icon: 'far fa-align-left', fn: handleShowEditDescription });
    }
    if (isSetTaskLinkActive) {
      cells.push({ label: t('Add Link'), icon: 'far far fa-link', fn: setTaskLink });
    }
    if (isAddFileActive) {
      cells.push({ label: t('Add File'), icon: 'far fa-file', fn: addFile });
    }
    if (isSetPriorityActive) {
      cells.push({ label: t('Set Priority'), icon: 'far fa-flag-alt', fn: setPriority });
    }
    if (isSetDueDateActive) {
      cells.push({ label: t('Set Due Date'), icon: 'ci ci-due', fn: setDueDate });
    }
    if (isSetStartDateActive || task.taskType === 'Adhoc') {
      cells.push({ label: t('Set Start Date'), icon: 'far fa-calendar-alt fa-2x mb-1', fn: setStartDate, disabled: !isSetStartDateActive });
    }
    if (isCopyActive) {
      cells.push({ label: t(isJob ? 'copy_job' : 'copy_task'), icon: 'far fa-clone', fn: handleCopy });
    } 
    if (isConvertGroupActive || task.taskType === 'Adhoc') {
      cells.push({ label: t('Convert To Group'), icon: 'far fa-file-plus', fn: handleConvertGroup, disabled: !isConvertGroupActive });
    }
    if (isAssociateActive || task.taskType === 'Adhoc') {
      cells.push({ label: t('associate_zone'), icon: 'far fa-border-none', fn: handleAddZoneClick, disabled: !isAssociateActive });
    } 
    if (isMoveToGroupActive) {
      cells.push({ label: t('Move To Group'), icon: 'far fa-folder', fn: handleMoveToGroup });
    }
    if (isAddDeviceActive) {
      cells.push({ label: t('add_device'), icon: 'far fa-tablet-android-alt', fn: addDevice });
    }
    if (isAssignActive) {
      cells.push({ label: t('Assign Tasks'), icon: 'far fa-user-plus', fn: handleAssignClick });
    } 
    if (isCreateGroupActive) {
      cells.push({ label: t('Create Group'), icon: 'far fa-folder-plus', fn: handleCreateGroup });
    }
    if (isCopyGroupActive) {
      cells.push({ label: t('Copy Group'), icon: 'far fa-file-plus', fn: handleCopyGroupClick });
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

    const perSlideTilesCount = 3;
    const slidesCount = Math.ceil(groupedCells.length/perSlideTilesCount);
    const slidesData = {};
    for(let i = 0; i < slidesCount; i++){
      slidesData[i] = groupedCells.splice(0, perSlideTilesCount);

      const fillGroups = perSlideTilesCount - slidesData[i].length;
      if (!isGroupCard && fillGroups !== 0 && (!hideEmptyRows || slidesCount > 1)) {
        for (let fg = 0; fg < fillGroups; fg++) {
          slidesData[i].push([{}, {}, {}]);
        }
      } else if (isGroupCard && fillGroups !== 0 && !(hideEmptyRows || slidesCount > 1)) {
        for (let fg = 0; fg < fillGroups; fg++) {
          slidesData[i].push([{}, {}, {}]);
        }
      }
    }

    return { menuItems: slidesData, totalItems: cells.length, slidesCount };
  };
  const { menuItems, totalItems, slidesCount } = React.useMemo(prepareMenu, []);

  return (
    <EllipsisMenuV2Container className={`card-menu ${cardSkin ? '' : 'd-inline-block'}`}>
      <div {...handlers}>
        <div className="bg-white rounded border shadow position-absolute carousel slide" style={{ right: `${totalItems > 1 ? '0px' : '40px'}`, zIndex: 10000, bottom: `${!isBulkSelectMenu ? '0px' : ''}`, top: `${isBulkSelectMenu ? '0px' : ''}` }} ref={dropdownRef}>
          <div className="carousel-inner">
            {menuItems[currentSlide] && menuItems[currentSlide].map((row, rowIdx) => (
              <div className="d-flex small w-100 text-center" key={rowIdx}>
                {row.map((item, idx) => (
                  <React.Fragment key={idx}>
                    {item.label && <a className={`col ${idx !== 3 && 'border-right'} border-bottom pb-2 pt-3 ${item.disabled ? 'disabled' : ''}`} key={idx} onClick={() => menuSelected(item)} style={{minWidth: '88.5px'}}>
                      <i className={`${item.icon} fa-2x mb-1`} aria-hidden="true"></i>
                      <span className="d-block" style={{lineHeight: 1.15}}>{item.label}</span>
                    </a>}
                    {!item.label && <a className={`col ${idx !== 3 && 'border-right'} border-bottom pb-2 pt-3`}></a>}
                  </React.Fragment>))}
              </div>))}
          </div>
          {slidesCount > 1 && <ol className="w-100 carousel-indicators position-static bg-light m-0 rounded-bottom border-top">
            <li className={`rounded-circle bg-secondary ${currentSlide === 0 ? 'active' : ''}`} onClick={() => slideTo('left')}></li>
            <li className={`rounded-circle bg-secondary ${currentSlide === 1 ? 'active' : ''}`} onClick={() => slideTo('right')}></li>
          </ol>}
        </div>
      </div>
      <div className="fade modal-backdrop show" style={{backgroundColor: 'transparent'}}></div>
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
  descriptionFunction: PropTypes.func,
  copyFunction: PropTypes.func,
  associateFunction: PropTypes.func,
  isJob: PropTypes.bool,
  handleConvertGroup: PropTypes.func,
  handleShowEditDescription: PropTypes.func,
  handleAddImageButtonClick: PropTypes.func,
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
  handleRequireVerificationClick: PropTypes.func,
  isRequireVerificationActive: PropTypes.bool,
  isCopyGroupActive: PropTypes.bool,
  handleCopyGroupClick: PropTypes.func,
  handleAssignClick: PropTypes.func,
  isAssignActive: PropTypes.bool,
  handleAddScreenshotButtonClick: PropTypes.func,
  isAddScreenshotsActive: PropTypes.bool,
  cardSkin: PropTypes.string,
  hideEmptyRows: PropTypes.bool,
  isMoveToGroupActive: PropTypes.bool,
  handleMoveToGroup: PropTypes.func,
  isCreateGroupActive: PropTypes.bool,
  handleCreateGroup: PropTypes.func,
  isGroupCard: PropTypes.bool,
  isMember: PropTypes.bool,
  task: PropTypes.object,
  isBulkSelectMenu: PropTypes.bool,
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
  handleRequireVerificationClick: () => {},
  isRequireVerificationActive: false,
  handleAddScreenshotButtonClick: () => {},
  isAddScreenshotsActive: false,
  cardSkin: '',
  hideEmptyRows: true,
  task: {},
};

EllipsisMenuV2.displayName = 'EllipsisMenuV2';
export default EllipsisMenuV2;

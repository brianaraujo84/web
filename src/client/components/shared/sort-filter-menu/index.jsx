import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useTranslation, Trans } from 'react-i18next';
import { useSwipeable } from 'react-swipeable';
import { useDetectOutsideClick } from '../../../hooks/useDetectOutsideClick';


const SortFilterMenu = ({
  isPriority,
  isDueDate,
  isStartDate,
  isOverdue,
  isCompleted,
  isAllActive,
  isInReview,
  isTaskOrder,
  handlePriority,
  handleDueDate,
  handleStartDate,
  handleOverdue,
  handleCompleted,
  handleInReview,
  handleTaskOrder,
  handleAllActive,
  handler,
  cardSkin,
  hideEmptyRows,
}) => {
  const dropdownRef = React.useRef(null);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  useDetectOutsideClick(dropdownRef, handler);
  const { t } = useTranslation();

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

  const menuSelected = (fn) => {
    if (fn) {
      fn();
      handler();
    }
  };

  const prepareMenu = () => {
    const cells = [];

    if (isPriority) {
      cells.push({ label: t('Priority'), sublabel: t('Highest first'), icon: 'far fa-flag fa-2x', fn: handlePriority });
    }
    if (isDueDate) {
      cells.push({ label: t('Due Date'), sublabel: t('Nearest first'), icon: 'ci ci-due fa-2x', fn: handleDueDate });
    }
    if (isStartDate) {
      cells.push({ label: t('Start Date'), sublabel: t('Nearest first'), icon: 'far fa-calendar-alt fa-2x', fn: handleStartDate });
    }
    if (isOverdue) {
      cells.push({ label: t('Overdue'), sublabel: t('Longest first'), icon: 'ci ci-due-f fa-2x', fn: handleOverdue });
    }
    if (isCompleted) {
      cells.push({
        label: t('Completed'), sublabel: t('Newest first'), icon: 'far fa-calendar-check fa-2x', fn: handleCompleted
      });
    }
    if (isInReview) {
      cells.push({ label: t('In Review'), sublabel: t('Oldest first'), icon: 'far fa-file-check fa-2x', fn: handleInReview });
    }
    if (isTaskOrder) {
      cells.push({ label: t('Task Order'), sublabel: t('Oldest first'), icon: 'fas fa-grip-vertical fa-2x mb-1', fn: handleTaskOrder });
    } else {
      cells.push({ label: t('Task Order'), sublabel: t('Oldest first'), icon: 'fas fa-grip-vertical fa-2x mb-1', disabled: true });
    }
    if (isAllActive) {
      cells.push({ label: t('All Active'), sublabel: t('Oldest first'), icon: 'far fa-check fa-2x', fn: handleAllActive });
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
    const slidesCount = Math.ceil(groupedCells.length / perSlideTilesCount);
    const slidesData = {};
    for (let i = 0; i < slidesCount; i++) {
      slidesData[i] = groupedCells.splice(0, perSlideTilesCount);

      const fillGroups = perSlideTilesCount - slidesData[i].length;
      if (fillGroups !== 0 && !(hideEmptyRows || slidesCount > 1)) {
        for (let fg = 0; fg < fillGroups; fg++) {
          slidesData[i].push([{}, {}, {}]);
        }
      }
    }

    return { menuItems: slidesData, slidesCount };
  };
  const { menuItems, slidesCount } = React.useMemo(prepareMenu, []);

  return (
    <EllipsisMenuV2Container className={`card-menu ${cardSkin ? '' : 'd-inline-block'}`}>
      <div {...handlers}>
        <div className="bg-white rounded border shadow position-absolute carousel slide" style={{ right: '0px', zIndex: 10000, top: '0px' }} ref={dropdownRef}>
          <div className="border-bottom text-center">
            <small className="text-secondary text-uppercase p-2"><Trans>Show Items</Trans></small>
          </div>
          <div className="carousel-inner">
            {menuItems[currentSlide] && menuItems[currentSlide].map((row, rowIdx) => (
              <div className="d-flex small w-100 text-center" key={rowIdx}>
                {row.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <a className={`col ${item.disabled ? 'disabled' : ''} ${idx !== 3 && 'border-right'} short border-bottom pb-2 pt-3`} key={idx} onClick={() => menuSelected(item.fn)} style={{ minWidth: '88.5px' }}>
                      <i className={`${item.icon} fa-2x mb-1`} aria-hidden="true"></i>
                      {' '}
                      <span className="d-block">{item.label}</span>
                    </a>

                  </React.Fragment>))}
              </div>))}
          </div>
          {slidesCount > 1 && <ol className="w-100 carousel-indicators position-static bg-light m-0 rounded-bottom border-top">
            <li className={`rounded-circle bg-secondary ${currentSlide === 0 ? 'active' : ''}`} onClick={() => slideTo('left')}></li>
            <li className={`rounded-circle bg-secondary ${currentSlide === 1 ? 'active' : ''}`} onClick={() => slideTo('right')}></li>
          </ol>}
        </div>
      </div>
      <div className="fade modal-backdrop show" style={{ backgroundColor: 'transparent' }}></div>
    </EllipsisMenuV2Container>
  );
};

export const EllipsisMenuV2Container = styled.div`
.menu {
  background: #ffffff;
  border-radius: 4px;
  position: absolute;
  top: 0;
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

SortFilterMenu.propTypes = {
  isPriority: PropTypes.bool.isRequired,
  isDueDate: PropTypes.bool.isRequired,
  isStartDate: PropTypes.bool.isRequired,
  isOverdue: PropTypes.bool.isRequired,
  isCompleted: PropTypes.bool.isRequired,
  isInReview: PropTypes.bool.isRequired,
  isTaskOrder: PropTypes.bool.isRequired,
  isAllActive: PropTypes.bool.isRequired,
  handlePriority: PropTypes.func,
  handleDueDate: PropTypes.func,
  handleStartDate: PropTypes.func,
  handleOverdue: PropTypes.func,
  handleCompleted: PropTypes.func,
  handleInReview: PropTypes.func,
  handleTaskOrder: PropTypes.func,
  handleAllActive: PropTypes.func,
  handler: PropTypes.func,
  cardSkin: PropTypes.string,
  hideEmptyRows: PropTypes.bool,
};

SortFilterMenu.defaultProps = {
  isPriority: true,
  isDueDate: true,
  isStartDate: true,
  isOverdue: true,
  isCompleted: true,
  isInReview: true,
  isTaskOrder: false,
  isAllActive: true,
  handler: () => { },
  handleAddScreenshotButtonClick: () => { },
  isAddScreenshotsActive: false,
  cardSkin: '',
  hideEmptyRows: true,
};

SortFilterMenu.displayName = 'SortFilterMenu';
export default SortFilterMenu;

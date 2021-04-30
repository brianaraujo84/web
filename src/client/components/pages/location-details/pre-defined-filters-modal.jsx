import React from 'react';
import PropTypes from 'prop-types';
import SortFilterMenu from '../../shared/sort-filter-menu';

const PreDefinedFiltersModal = ({
  onClose,
  onUpdate,
  show,
  isTaskOrder
}) => {

  const handleOnClose = () => {
    onClose();
  };

  const onQuickSelect = (filter) => {
    onUpdate(filter);
    onClose();
  };

  return (
    <>
      {
        show && (
          <SortFilterMenu
            handler={handleOnClose}
            handlePriority={() => onQuickSelect({ type: 'priority' })}
            handleDueDate={() => onQuickSelect({ type: 'dueDate' })}
            handleStartDate={() => onQuickSelect({ type: 'scheduledDesc' })}
            handleOverdue={() => onQuickSelect({ type: 'overdue' })}
            handleCompleted={() => onQuickSelect({ type: 'completed' })}
            handleInReview={() => onQuickSelect({ type: 'review' })}
            handleTaskOrder={() => onQuickSelect({ type: 'taskOrder' })}
            isTaskOrder={isTaskOrder}
            handleAllActive={() => onQuickSelect({ type: 'active' })}
          />
        )
      }
    </>
  );
};

PreDefinedFiltersModal.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  isTaskOrder: PropTypes.bool,
};

PreDefinedFiltersModal.defaultProps = {
  onUpdate: () => { },
  onClose: () => { },
};

PreDefinedFiltersModal.displayName = 'LocationDetailsPreDefinedFiltersModal';
export default PreDefinedFiltersModal;

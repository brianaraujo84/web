import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useSelector } from 'react-redux';

import TaskCardDragable from './task-card-dragable';
import WorkerTaskCardDragable from './worker-task-card-dragable';

const DragableTaskList = ({
  nonGrpJobTasks,
  onTaskCardDragEnd,
  taskTemplateId,
  taskSummary,
  getTaskTemplateInfo,
  getLocation,
  handleRemove,
  setAllCustomeJobReviewsInListCompleted,
  setNumberofCustomTasksReviewed,
  numberofCustomTasksReviewed,
  numberofCustomTasksToReview,
  customJobCompleted,
  locationUserRole,
  simplifiedMode,
  bulkSelectTaskArray,
  setBulkSelectTaskArray,
  updateTaskInNonGrpJobTasks,
  sortingMode,
  isOnTaskDetailsPage,
  insertCopiedTask,
  updateFilters,
  setShowCreateBtn,
}) => {
  const profile = useSelector(state => state.profile.data);

  return (
    <div className='container'>
      <div className='row'>
        {<div className='col-12 px-0'>
          <DragDropContext onDragEnd={onTaskCardDragEnd}>
            <Droppable droppableId={'1'} index={1} zoneId={1} direction='vertical' type='column'>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className='zone-task-list'
                  key={1}
                >
                  {nonGrpJobTasks.map((task, taskIdx) => (<div key={taskIdx}>
                    {(locationUserRole === 'Owner' || locationUserRole === 'Manager') && (task.stage === 'Copy' || task.stage === 'Assigned' || task.stage === 'Declined' || task.stage === 'Accepted' || task.stage === 'Review' || task.stage === 'Rework' || task.stage === 'Open') ?
                      <TaskCardDragable
                        key={task.taskId || task.templateId}
                        task={{ ...task, taskType: 'CustomGroupTask', templateId: taskTemplateId }}
                        index={taskIdx}
                        isCustom={taskSummary?.templateType === 'Custom'}
                        updateTaskGroup={getTaskTemplateInfo}
                        getLocation={getLocation}
                        onRemove={handleRemove}
                        taskSummary={taskSummary}
                        setAllCustomeJobReviewsInListCompleted={setAllCustomeJobReviewsInListCompleted}
                        setNumberofCustomTasksReviewed={setNumberofCustomTasksReviewed}
                        numberofCustomTasksReviewed={numberofCustomTasksReviewed}
                        numberofCustomTasksToReview={numberofCustomTasksToReview}
                        customJobCompleted={customJobCompleted}
                        disableWorkerActions={profile.username !== task.assigneeUserName}
                        locationUserRole={locationUserRole}
                        cardSkin={simplifiedMode ? 'simple' : ''}
                        bulkSelectTaskArray={bulkSelectTaskArray}
                        setBulkSelectTaskArray={setBulkSelectTaskArray}
                        updateTaskInNonGrpJobTasks={updateTaskInNonGrpJobTasks}
                        provided={provided}
                        sortingMode={sortingMode}
                        isOnTaskDetailsPage={isOnTaskDetailsPage}
                        insertCopiedTask={insertCopiedTask}
                        updateFilters={updateFilters}
                        setShowCreateBtn={setShowCreateBtn}
                      />
                      : profile.username === task.assigneeUserName ?
                        <WorkerTaskCardDragable
                          key={task.taskId || task.templateId}
                          task={{ ...task, taskType: 'CustomGroupTask', templateId: taskTemplateId }}
                          index={taskIdx}
                          isCustom={taskSummary?.templateType === 'Custom'}
                          updateTaskGroup={getTaskTemplateInfo}
                          getLocation={getLocation}
                          onRemove={handleRemove}
                          taskSummary={taskSummary}
                          locationUserRole={locationUserRole}
                          setAllCustomeJobReviewsInListCompleted={setAllCustomeJobReviewsInListCompleted}
                          setNumberofCustomTasksReviewed={setNumberofCustomTasksReviewed}
                          numberofCustomTasksReviewed={numberofCustomTasksReviewed}
                          numberofCustomTasksToReview={numberofCustomTasksToReview}
                          customJobCompleted={customJobCompleted}
                          cardSkin={simplifiedMode ? 'simple' : ''}
                          updateTaskInNonGrpJobTasks={updateTaskInNonGrpJobTasks}
                          provided={provided}
                          sortingMode={sortingMode}
                          isOnTaskDetailsPage={isOnTaskDetailsPage}
                          updateFilters={updateFilters}
                          setShowCreateBtn={setShowCreateBtn}
                        />
                        :
                        <WorkerTaskCardDragable
                          key={task.taskId || task.templateId}
                          task={{ ...task, taskType: 'CustomGroupTask', templateId: taskTemplateId }}
                          index={taskIdx}
                          isCustom={taskSummary?.templateType === 'Custom'}
                          updateTaskGroup={getTaskTemplateInfo}
                          getLocation={getLocation}
                          onRemove={handleRemove}
                          taskSummary={taskSummary}
                          locationUserRole={locationUserRole}
                          setAllCustomeJobReviewsInListCompleted={setAllCustomeJobReviewsInListCompleted}
                          setNumberofCustomTasksReviewed={setNumberofCustomTasksReviewed}
                          numberofCustomTasksReviewed={numberofCustomTasksReviewed}
                          numberofCustomTasksToReview={numberofCustomTasksToReview}
                          customJobCompleted={customJobCompleted}
                          isReadOnly
                          cardSkin={simplifiedMode ? 'simple' : ''}
                          provided={provided}
                          sortingMode={sortingMode}
                          isOnTaskDetailsPage={isOnTaskDetailsPage}
                          updateFilters={updateFilters}
                          setShowCreateBtn={setShowCreateBtn}
                        />
                    }
                  </div>))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>}
      </div>
    </div>
  );
};

DragableTaskList.propTypes = {
  template: PropTypes.object,
  templateId: PropTypes.string,
  data: PropTypes.array,
  updateTasks: PropTypes.func,
  zoneTypes: PropTypes.array,
  shouldScrollToNewTask: PropTypes.bool,
  setShouldScrollToNewTask: PropTypes.func,
  nonGrpJobTasks: PropTypes.array,
  onTaskCardDragEnd: PropTypes.func,
  taskTemplateId: PropTypes.string,
  taskSummary: PropTypes.object,
  getTaskTemplateInfo: PropTypes.func,
  getLocation: PropTypes.func,
  handleRemove: PropTypes.func,
  setAllCustomeJobReviewsInListCompleted: PropTypes.func,
  setNumberofCustomTasksReviewed: PropTypes.func,
  numberofCustomTasksReviewed: PropTypes.number,
  numberofCustomTasksToReview: PropTypes.number,
  customJobCompleted: PropTypes.bool,
  locationUserRole: PropTypes.string,
  simplifiedMode: PropTypes.bool,
  bulkSelectTaskArray: PropTypes.array,
  setBulkSelectTaskArray: PropTypes.func,
  updateTaskInNonGrpJobTasks: PropTypes.func,
  sortingMode: PropTypes.bool,
  isOnTaskDetailsPage: PropTypes.bool,
  insertCopiedTask: PropTypes.func,
  updateFilters: PropTypes.func,
  setShowCreateBtn: PropTypes.func
};

DragableTaskList.defaultProps = {
  insertCopiedTask: () => { },
  updateFilters: () => { },
};

DragableTaskList.displayName = 'DragableTaskList';

export default DragableTaskList;

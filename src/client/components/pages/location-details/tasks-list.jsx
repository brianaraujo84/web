import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import TaskCard from './task-card';
import WorkerTaskCard from './worker-task-card';
import JobTaskCard from '../task-details/job-task-card';

const duration = 500;
const templateNumberStore = {};

export const TaskCardWrapper = styled.div`
  &.task-card-wrapper-enter {
    max-height: 0;
  }
  &.task-card-wrapper-enter-active {
    max-height: 300px;
    transition: max-height ${duration}ms ease-in;
  }
  &.task-card-wrapper-exit {
    max-height: 300px;
  }
  &.task-card-wrapper-exit-active {
    max-height: 0;
    transition: max-height ${duration}ms ease-in;
  }
`;

const TasksList = ({
  tasks,
  handleRemove,
  getLocation,
  setAllCustomeJobReviewsInListCompleted,
  setNumberofCustomTasksReviewed,
  numberofCustomTasksReviewed,
  setFilter,
  locationUserRole,
  updateTaskInNonGrpJobTasks,
  tab,
  isNotifyPage,
  insertCopiedTask,
  updateFilters,
  getJobsAndTask,
  getGroups,
  bulkSelectTaskArray,
  setBulkSelectTaskArray,
  setShowCreateBtn,
}) => {
  const profile = useSelector(state => state.profile.data);

  return (
    <>
      {tasks && tasks.map((t, idx) => (
        <div key={`${t.taskId}_${t.templateId}_${t.taskType}`}>
          {t.taskType === 'TemplateGroupTask' && tab !== 'groups' ? (
            <JobTaskCard
              taskIdx={idx}
              task={t}
              showFirstTask={false}
              isOnLocationDetailsPage={true}
              locationUserRole={locationUserRole}
              index={idx}
              templateNumberStore={templateNumberStore}
            />
          ) : (locationUserRole === 'Owner' || locationUserRole === 'Manager') && (t.stage === 'Copy' || t.stage === 'Assigned' || t.stage === 'Accepted' || t.stage === 'Review' || t.stage === 'Rework' || t.stage === 'Open' || (profile.username !== t.assigneeUserName && t.stage === 'In Progress')) ? (
            <TaskCard
              task={t}
              index={idx}
              getLocation={getLocation}
              onRemove={() => handleRemove(idx)}
              setAllCustomeJobReviewsInListCompleted={setAllCustomeJobReviewsInListCompleted}
              setNumberofCustomTasksReviewed={setNumberofCustomTasksReviewed}
              numberofCustomTasksReviewed={numberofCustomTasksReviewed}
              totalTasks={tasks.length}
              isCustom={t.templateType === 'Custom'}
              updateTaskInNonGrpJobTasks={updateTaskInNonGrpJobTasks}
              locationUserRole={locationUserRole}
              isNotifyPage={isNotifyPage}
              insertCopiedTask={insertCopiedTask}
              updateFilters={updateFilters}
              getJobsAndTask={getJobsAndTask}
              getGroups={getGroups}
              bulkSelectTaskArray={bulkSelectTaskArray}
              setBulkSelectTaskArray={setBulkSelectTaskArray}
              setShowCreateBtn={setShowCreateBtn}
            />
          ) : (
            <WorkerTaskCard
              getLocation={getLocation}
              task={t}
              index={idx}
              setFilter={setFilter}
              updateTaskInNonGrpJobTasks={updateTaskInNonGrpJobTasks}
              locationUserRole={locationUserRole}
              isNotifyPage={isNotifyPage}
              isOnLocationDetailsPage={true}
              isReadOnly={profile.username !== t.assigneeUserName}
              updateFilters={updateFilters}
              insertCopiedTask={insertCopiedTask}
              setShowCreateBtn={setShowCreateBtn}
            />
          )}
        </div>
      ))}
    </>
  );
};

TasksList.propTypes = {
  getLocation: PropTypes.func.isRequired,
  tasks: PropTypes.array.isRequired,
  handleRemove: PropTypes.func.isRequired,
  setShowNewTask: PropTypes.func,
  setAllCustomeJobReviewsInListCompleted: PropTypes.func,
  setNumberofCustomTasksReviewed: PropTypes.func,
  numberofCustomTasksReviewed: PropTypes.number,
  setFilter: PropTypes.func,
  locationUserRole: PropTypes.string,
  updateTaskInNonGrpJobTasks: PropTypes.func,
  tab: PropTypes.string,
  isNotifyPage: PropTypes.bool,
  insertCopiedTask: PropTypes.func,
  updateFilters: PropTypes.func,
  getJobsAndTask: PropTypes.func,
  getGroups: PropTypes.func,
  bulkSelectTaskArray: PropTypes.array,
  setBulkSelectTaskArray: PropTypes.func,
  setShowCreateBtn: PropTypes.func,
};


TasksList.defaultProps = {
  insertCopiedTask: () => { },
  updateFilters: () => { },
};


TasksList.displayName = 'LocationDetailsTasksList';
export default TasksList;

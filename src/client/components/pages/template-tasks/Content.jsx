import React from 'react';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { useActionDispatch } from '../../../hooks';
import { postConfidenceObject } from '../../../redux/actions/object';
import { uploadTemplateTaskImages } from '../../../redux/actions/files';
import { addToast } from '../../../redux/actions/toasts';

import TemplateTaskCard from './template-task-card';
import NewTask from './new-task';
import { smoothScrollToRef } from '../../../utils';

const styles = {
  marketplaceIcon: {
    width: '60px'
  },
  createTask: {
    display: 'inline-block',
  },
  isDraggingOver: {
    backgroundColor: 'red'
  }
};

const OBJECT_TEMPLATE = 'template';

const Content = ({
  template, templateId, data, zoneTypes, updateTasks,
  shouldScrollToNewTask, setShouldScrollToNewTask,
}) => {
  const { t } = useTranslation();

  const newTaskPositionRef = React.useRef();

  const [showNewTask, setShowNewTask] = React.useState(false);
  const [draggingTaskId, setDraggingTaskId] = React.useState(null);
  const [displayMode, setDisplayMode] = React.useState(null);
  const [zones, setZones] = React.useState(null);

  const uploadTemplateImages = useActionDispatch(uploadTemplateTaskImages);
  const manageReferenceTemplate = useActionDispatch(postConfidenceObject(OBJECT_TEMPLATE, undefined, 'reference/template/tasks'));
  const toast = useActionDispatch(addToast);

  const isDragDisabled = React.useMemo(()=>{return !displayMode || showNewTask; }, [displayMode, showNewTask]);
  const isIncludeGeneralZone = React.useMemo(()=>{return zones && zones.find(zone=>zone.zoneType==='General');}, [zones]);

  React.useEffect(() => {
    setZones(data || []);
  },[data]);

  React.useEffect(() => {
    if (shouldScrollToNewTask) {
      smoothScrollToRef(newTaskPositionRef, 72);
      setShouldScrollToNewTask(false);
    }
  },[zones, shouldScrollToNewTask, setShouldScrollToNewTask, newTaskPositionRef]);

  const handlePlusClick = () => {
    setShowNewTask(true);
  };
  
  const onTaskCardDragStart = (start) => {
    const {draggableId} = start;
    setDraggingTaskId(draggableId);
  };

  const onTaskCardDragEnd = async (result) => {

    setDraggingTaskId(null);
    const {destination, source} = result;
    if(!destination) { return; }
    if(destination.droppableId === source.droppableId && destination.index === source.index) { return; }

    const sourceZoneIndex = zones.findIndex((item)=>item.zoneTypeId.toString()===source.droppableId);
    const destinationZoneIndex = zones.findIndex((item)=>item.zoneTypeId.toString()===destination.droppableId);

    if (sourceZoneIndex !== destinationZoneIndex) {
      const [task] = zones[sourceZoneIndex].jobTask.splice(source.index, 1);
      zones[destinationZoneIndex].jobTask.splice(destination.index, 0, task);
    } else {   
      const [task] = zones[sourceZoneIndex].jobTask.splice(source.index, 1);
      zones[sourceZoneIndex].jobTask.splice(destination.index, 0, task);
    }
    setZones(zones);
  };

  const onZoneCardDragEnd = async (result) => {
    const {destination, source} = result;
    if (destination.index === source.index) {return;}
    const [zone] = zones.splice(source.index, 1);
    zones.splice(destination.index, 0, zone);
    setZones(zones);
  };

  const handleAddTask = async (task) => {
    const zoneIndex = zones.findIndex((item)=>item.zoneTypeId.toString()===task.zoneTypeId.toString());
    if (zoneIndex > -1) {
      zones[zoneIndex].jobTask.push({...task, sequeceOrder: zones[zoneIndex].jobTask.length + 1});
    } else {
      zones.push({
        zoneTypeId: task.zoneTypeId,
        jobTask: [{...task}]
      });
    }
    setZones(zones);
    handleReorder();
    return;
  };

  const handleUpdateTask = async (task) => {
    const sourceZoneIndex = zones.findIndex((zone)=>zone.jobTask.find(item=>item.taskId.toString()===task.taskId.toString()));
    const taskIndex = zones[sourceZoneIndex].jobTask.findIndex(item=>item.taskId.toString()===task.taskId.toString());
    const destinationZoneIndex = zones.findIndex((zone)=>zone.zoneTypeId.toString()===task.zoneTypeId.toString());  
    
    if (sourceZoneIndex===destinationZoneIndex) {
      zones[sourceZoneIndex].jobTask[taskIndex] = task; // update the task
    } else {
      zones[sourceZoneIndex].jobTask.splice(taskIndex, 1); //remove task from the source zone
      if (destinationZoneIndex>-1) {
        zones[destinationZoneIndex].jobTask.push(task); // add task to the destination zone
      } else {
        zones.push({
          zoneTypeId: task.zoneTypeId,
          jobTask: [{...task}]
        });
      }
    }
    setZones(zones);
    handleReorder();
    return;
  };

  const handleRemoveTask = async(task) => {
    const data = {
      referenceTemplateId: templateId,
      tasks: [{...task, action: 'Delete'}]
    };
    await manageReferenceTemplate(data);
    updateTasks();
    toast(t('Task Removed'));
    return;
  };

  const handleUploadImages = async({taskId, images}) => {
    await uploadTemplateImages(images, templateId, taskId);
    toast(t('Image Uploaded'));
    return;
  };

  const handleCancel = () => {
    setDisplayMode(null);
  };

  const handleReorder = async() => {
    const reordered_tasks = [];
    for(var i = 0; i < zones.length; i++) {
      for(var j = 0; j < zones[i].jobTask.length; j++) {
        const task = zones[i].jobTask[j];
        reordered_tasks.push({
          ...task,
          zoneTypeId: zones[i].zoneTypeId,
          sequeceOrder: getTaskIndex(i, j) + 1
        });
      }
    }
    const data = {
      referenceTemplateId: templateId,
      tasks: reordered_tasks
    };
    await manageReferenceTemplate(data);
    updateTasks(true);
    return;
  };

  const zoneTypeNameIdFinder = (zoneTypeName) => {
    const zone = zoneTypes.filter(zone => zone.zoneType === zoneTypeName);
    return zone[0]?.zoneTypeId;
  };

  const getTaskIndex = (zoneIndex, extra) => {
    let s = 0;
    for (var i = 0; i<zoneIndex; i++) {
      s += zones[i].jobTask.length;
    }
    return s+extra;
  };

  return (
    <div className='pt-3'>
      {template && template.taskCount > 0 && displayMode !== 'zones_view' &&
      <button id="create-task" className="btn btn-primary rounded-circle text-white position-fixed" role="button" title="Add New Task" hidden={showNewTask} onClick={handlePlusClick} data-target="add-new-task">
        <i className="far fa-plus"></i>
        <span className="sr-only">Add New Task</span>
      </button>}
      <div className='container'>
        <div className='row'>
          <div className='d-flex align-items-center pb-3'>
            <img className='rounded border mr-2' src={`/api/files/template/${template.templateDetails.templateId}/logo/thumbnail.png`} style={styles.marketplaceIcon} />
            <div className='pl-2'>
              <h1 className='mb-0'>
                {template.referenceTemplateName}
              </h1>
            </div>
          </div>
        </div>
        <div className='row'>
          { template && template.taskCount && <div className='d-flex col-12 mb-3 px-0'>
            <div className='px-0'>
              <h3 className='mt-1 mb-0'>
                <Trans i18nKey="tasks" />{' '}
                <small className='text-muted'>
                  ({template.taskCount})
                </small>
              </h3>
            </div>
            <div className='col px-0 text-right'>
              {!displayMode && <button id='reorder-tasks' className='btn btn-outline-primary ml-2' title='Reorder Tasks' onClick={()=>setDisplayMode('zones_view')}>
                <i className='fad fa-sort-alt mr-1' aria-hidden></i><Trans i18nKey='Reorder Zones' />
              </button>}
              {!displayMode && <button id='reorder-tasks' className='btn btn-outline-primary ml-2' title='Reorder Tasks' onClick={()=>setDisplayMode('tasks_view')}>
                <i className='fad fa-sort-alt mr-1' aria-hidden></i><Trans i18nKey='Reorder Tasks' />
              </button>}
              {displayMode && <button id='discard-reorder-tasks' className='btn btn-outline-secondary ml-2' onClick={handleCancel}>
                <Trans i18nKey='Discard Changes' />
              </button>}
              {displayMode && <button id='save-reorder-tasks' className='btn btn-primary ml-2' onClick={handleReorder}>
                <Trans i18nKey='Save Order' />
              </button>}
            </div>
          </div>}
          {template && !template.taskCount && !showNewTask && <div className='col-12 p-0 text-center' id='zero-tasks'>
            <img src="/assets/img/empty.png" width="200" />
            <em className="d-block text-secondary my-4">
              <Trans>You don't have any tasks in this template. Create your first task using the button below.</Trans>
            </em>
            <button className="btn-primary btn" id="create-task-first" onClick={handlePlusClick}><i className="fas fa-plus mr-1" aria-hidden="true"></i>
              <Trans i18nKey='create_task' />
            </button>
          </div>}
          {displayMode !== 'zones_view' 
            ? <div className='col-12 px-0'>
              <DragDropContext onDragStart={onTaskCardDragStart} onDragEnd={onTaskCardDragEnd}>
                {zones && zones.map((zone, index) => (
                  <>
                    <Droppable droppableId={zone.zoneTypeId.toString()} key={zone.zoneTypeId} index={index} zoneId={zone.zoneTypeId} direction='vertical' type='column'>
                      {(provided) => (
                        <div 
                          ref={provided.innerRef} 
                          { ...provided.droppableProps}
                          className='zone-task-list' 
                          key={index} 
                        >
                          <h6><Trans>{zone.zoneType}</Trans></h6>
                          {zone.jobTask.map((task, i) => (
                            <TemplateTaskCard
                              key={task.taskId.toString()}
                              order={i}
                              templateId={templateId}
                              task={task} 
                              isDragDisabled={isDragDisabled}
                              index={getTaskIndex(index, i)} 
                              zoneTypes={zoneTypes}
                              onUpdate={handleUpdateTask}
                              onRemove={handleRemoveTask}
                              onUploadImages={handleUploadImages}
                              isDragging={draggingTaskId === task.taskId.toString()}
                            />
                          ))}
                          {provided.placeholder}
                          {zone.zoneType === 'General' && <div ref={newTaskPositionRef} />}
                        </div>
                      )}
                    </Droppable>
                    {showNewTask && zone.zoneType === 'General' && (
                      <NewTask
                        onDelete={() => setShowNewTask(false)}
                        onUpdate={handleAddTask}
                        defaultZoneTypeId={zoneTypeNameIdFinder('General')}
                      />
                    )}
                  </>
                ))}
              </DragDropContext>
              {showNewTask && !isIncludeGeneralZone && (
                <>
                  <h6><Trans>General</Trans></h6>
                  <NewTask
                    onDelete={() => setShowNewTask(false)}
                    onUpdate={handleAddTask}
                    defaultZoneTypeId={zoneTypeNameIdFinder('General')}
                  />
                </>
              )}
            </div>
            : <div className='col-12 px-0'>
              <DragDropContext onDragEnd={onZoneCardDragEnd}>
                <Droppable droppableId={'zone_area'} direction='vertical' type='column'>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="bg-primary rounded">
                      {zones && zones.map((zone, index) => (
                        <Draggable key={zone.zoneTypeId} draggableId={zone.zoneTypeId.toString()} index={index} isDragDisabled={isDragDisabled}>
                          {(provided) => (
                            <div className="zone-task-list drag bg-white" ref={provided.innerRef} {...provided.draggableProps}>
                              <h6 className="zone-task-list-label">
                                <img {...provided.dragHandleProps} src="/assets/img/drag-handle-small.png" width="17" className="mr-2" />
                                {zone.zoneType}
                                <span className="text-secondary font-weight-normal">&nbsp;&ndash; {`${zone.jobTask ? zone.jobTask.length : '0'} tasks`}</span>
                              </h6>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

Content.propTypes = {
  template: PropTypes.object,
  templateId: PropTypes.string,
  data: PropTypes.array,
  updateTasks: PropTypes.func,
  zoneTypes: PropTypes.array,
  shouldScrollToNewTask: PropTypes.bool,
  setShouldScrollToNewTask: PropTypes.func,
};

Content.displayName = 'Content';

export default Content;

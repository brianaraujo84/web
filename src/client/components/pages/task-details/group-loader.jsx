import React from 'react';
import PropTypes from 'prop-types';

const GroupLoader = ({ noContainer }) => {

  return (
    <div className={!noContainer ? 'container bg-light border-top' : ''}>
      <div className="row justify-content-center pt-3 pb-5 bg-light" id="tasks">
        <button disabled="" id="add-task" className="add-task btn btn-primary rounded-circle text-white position-fixed" role="button" title="Create Task">
          <i className="far fa-plus" aria-hidden="true"></i>
          <span className="sr-only">Create Task</span>
        </button>

        <div className="col-12">

          <div className="mb-3">
            <div className="d-flex">
              <div className="px-0">
                <h4 className="mt-1">Active </h4>
              </div>
              <div className="col px-0 text-right">
                <button style={{display: 'none'}} id="batch-actions-toggle" className="btn btn-outline-primary ml-2" role="button" data-toggle="collapse" href="#batch-menu" aria-expanded="false" aria-controls="batch-menu">
                  <i className="fas fa-th" aria-hidden="true"></i>
                  <span className="sr-only">Batch Actions</span>
                </button>
                <button disabled="" className="btn btn-outline-secondary ml-2" role="button" data-toggle="collapse" href="#page-view" aria-expanded="false" aria-controls="page-view">
                  <i className="far fa-eye" aria-hidden="true"></i>
                  <span className="sr-only">Page View</span>
                </button>
                <button disabled="" className="btn btn-outline-secondary ml-2" role="button" data-toggle="collapse" href="#quick-sort-menu" aria-expanded="false" aria-controls="quick-sort-menu">
                  <i className="fas fa-sort-size-down" aria-hidden="true"></i>
                  <span className="sr-only">Quick Filter and Sort</span>
                </button>
                <button disabled="" id="filter-toggle" className="btn btn-outline-secondary ml-2" role="button" data-toggle="collapse" href="#task-filters" aria-expanded="false" aria-controls="task-filters">
                  <i className="fas fa-filter" aria-hidden="true"></i>
                  <span className="sr-only">Filter Tasks</span>
                </button>
              </div>
            </div>
          </div>

          <div className="row bg-white border-top border-bottom py-3 mb-3 collapse" id="task-filters">
            <div className="col-6">
              <div className="form-group mb-2">

                <label className="text-secondary mb-1" htmlFor="filter-status-task"><small>Status</small></label>
                <select id="filter-status-task" className="selectpicker form-control" multiple="" data-selected-text-format="count > 2" data-dropup-auto="false" data-style="bg-white">
                  <optgroup label="Active">
                    <option selected="">All Active</option>
                    <option>Open (1)</option>
                    <option>Assigned (2)</option>
                    <option>Rework (0)</option>
                    <option>Accepted (0)</option>
                    <option>Declined (0)</option>
                    <option>In Progress (2)</option>
                    <option>In Review (0)</option>
                  </optgroup>
                  <optgroup label="Completed">
                    <option>All Completed</option>
                    <option>Completed</option>
                    <option>Incomplete</option>
                  </optgroup>
                </select>
              </div>
            </div>
            <div className="col-6 pl-0">
              <div className="form-group mb-2">
                <label className="text-secondary mb-1" htmlFor="filter-sort-task"><small>Sort By</small></label>
                <select id="filter-sort-task" className="selectpicker form-control" data-dropup-auto="false" data-style="bg-white">
                  <option data-subtext="Newest First" selected="">Created</option>
                  <option data-subtext="Oldest First">Created</option>
                  <option data-subtext="Newest First">Scheduled</option>
                  <option data-subtext="Oldest First">Scheduled</option>
                  <option data-subtext="Newest First">Due</option>
                  <option data-subtext="Oldest First">Due</option>
                  <option data-subtext="Highest First">Priority</option>
                  <option data-subtext="Lowest First">Priority</option>
                </select>
              </div>
            </div>
            <div className="col-6">
              <div className="form-group mb-2">

                <label className="text-secondary mb-1" htmlFor="filter-creator-task"><small>Creator</small></label>
                <select id="filter-creator-task" className="selectpicker form-control" multiple="" data-selected-text-format="count > 2" data-dropup-auto="false" data-style="bg-white">
                  <option selected="">All</option>
                  <option data-subtext="(Me)">Jane Smith (5)</option>
                  <option>Rob Taylor (0)</option>
                </select>
              </div>
            </div>
            <div className="col-6 pl-0">
              <div className="form-group mb-2">
                <label className="text-secondary mb-1" htmlFor="filter-assignee-task"><small>Assignee</small></label>
                <select id="filter-assignee-task" className="selectpicker form-control" multiple="" data-selected-text-format="count > 2" data-dropup-auto="false" data-style="bg-white">
                  <option selected="">All</option>
                  <option data-subtext="(Me)">Jane Smith (1)</option>
                  <option>John Smith (4)</option>
                  <option>Karl Taylor (0)</option>
                </select>
              </div>
            </div>
            <div className="col-6">
              <div className="form-group mb-2">
                <label className="text-secondary mb-1" htmlFor="filter-due-task"><small>Due Date</small></label>
                <select id="filter-due-task" className="selectpicker form-control" data-dropup-auto="false" data-style="bg-white">
                  <option selected="">All</option>
                  <option>Overdue</option>
                </select>
              </div>
            </div>
            <div className="col-6 pl-0">
              <div className="form-group mb-2">
                <label className="text-secondary mb-1" htmlFor="filter-priority-task"><small>Priority</small></label>
                <select id="filter-priority-task" className="selectpicker form-control" multiple="" data-selected-text-format="count > 3" data-dropup-auto="false" data-style="bg-white">
                  <option selected="">All</option>
                  <option>No Priority</option>
                  <option>P1</option>
                  <option>P2</option>
                  <option>P3</option>
                  <option>P4</option>
                  <option>P5</option>
                </select>
              </div>
            </div>
          </div>

          <div className="task create alert alert-info p-0" style={{display: 'none'}}>
            <a className="p-1 text-center task-status align-self-stretch d-block text-white rounded-left">
              New
            </a>
            <div className="p-2 col">
              <form>
                <div className="d-flex">
                  <div className="form-group mb-0 w-100 mr-1">
                    <label className="sr-only" htmlFor="taskTitle">Title</label>
                    <input type="text" className="form-control" id="taskTitle" placeholder="Title" />
                  </div>
                  <button className="btn btn-outline-info"><i className="ci ci-user-me"></i> </button>
                </div>
              </form>
              <hr className="my-2" />
              <div className="text-right">
                <button type="button" className="task-c-button p-1 ml-1 btn rounded btn-outline-info" data-toggle="modal" data-target="#discard-task"><i className="fas fa-times" aria-hidden="true"></i><span className="sr-only">Discard</span></button>
                <button type="button" className="task-c-button task-create p-1 ml-1 btn rounded btn-outline-info"><i className="fas fa-check" aria-hidden="true"></i><span className="sr-only">Create</span></button>
              </div>
            </div>
          </div>

          <div className="ph-animate ph-task rounded">
            <div className="p-2 col">
              <span className="ph-text ph-title mb-2"></span>
              <span className="ph-text ph-small"></span>
              <div className="text-right mt-2">
                <span className="skeleton ph-button mb-0 d-inline-block rounded ml-2"></span>
                <span className="skeleton ph-button mb-0 d-inline-block rounded ml-2"></span>
                <span className="skeleton ph-button mb-0 d-inline-block rounded ml-2"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

GroupLoader.propTypes = {
  noContainer: PropTypes.bool,
};

GroupLoader.displayName = 'GroupLoader';
export default GroupLoader;

import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';

import { TaskCardWrapper } from './tasks-list';

function PlaceHolderTaskCard({ title }) {
  return (
    <TaskCardWrapper>
      <div className='task alert p-0 alert-secondary' >
        <a className='p-1 text-center task-status text-white rounded-left placeholder' >
          <Trans i18nKey="open" />
        </a>
        <div className='p-2'>
          <div className='row job-title'>
            <h5 className='col w-100 alert-heading mb-1 task-title'>{title}</h5>
          </div>
          <hr className='my-2' />
          <div>
            <div className='text-right'>
              <button className='task-c-button p-1 ml-2 btn rounded-circle btn-outline-primary'>
                <i className="far fa-comment-alt" aria-hidden="true"></i><span className="sr-only"><Trans>Add Comment</Trans></span>
              </button>
              <button className='task-c-button p-1 ml-2 btn rounded-circle btn-outline-primary'>
                <i className="far fa-trash-alt" aria-hidden="true"></i><span className="sr-only"><Trans>Delete Job</Trans></span>
              </button>
              <button className='task-c-button p-1 ml-2 btn rounded-circle btn-outline-primary'>
                <i className="far fa-check" aria-hidden="true"></i><span className="sr-only"><Trans i18nKey="add_pics" /></span>
              </button>
              <button className='task-c-button p-1 ml-2 btn rounded-circle btn-outline-primary'>
                <i className="fas fa-user-plus" aria-hidden="true"></i><span className="sr-only"><Trans i18nKey="assign" /></span>
              </button>
              <button className='task-c-button p-1 ml-2 btn rounded-circle btn-outline-primary'>
                <i className="fas fa-ellipsis-v" aria-hidden="true"></i><span  className="sr-only"><Trans i18nKey="menu" /></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </TaskCardWrapper>
  );
}

PlaceHolderTaskCard.propTypes = {
  title: PropTypes.string,
};

PlaceHolderTaskCard.defaultProps = {
};

PlaceHolderTaskCard.displayName = 'PlaceHolderTaskCard';
export default PlaceHolderTaskCard;

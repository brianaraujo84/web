import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Collapse from 'react-bootstrap/Collapse';
import { Trans } from 'react-i18next';
import CommentsList from './list';
import TaskComments from './task-comments';
import * as URLS from '../../../urls';

const styles = {
  userpic: {
    width: '35px',
  },
};

const STATE_LIST = 'STATE_LIST';
const STATE_TASK_COMMENTS = 'STATE_TASK_COMMENTS';

const RecentComments = React.forwardRef((props, ref) => {
  const [expanded, setExpanded] = React.useState(false);
  const [fromBack, setFromBack] = React.useState(true);
  const [showState, setShowState] = React.useState(STATE_LIST);
  const [activeComment, setActiveComment] = React.useState(undefined);
  const { username } = useSelector(state => state.profile.data);

  React.useImperativeHandle(ref, () => ({
    openTaskComments: ({ locationId, locationName, task: { task, taskId } }) => {
      setActiveComment({ locationId, locationName, task, taskId });
      setShowState(STATE_TASK_COMMENTS);
      setExpanded(true);
      setFromBack(false);
    }
  }));

  const handlePanelClick = () => {
    setShowState(STATE_LIST);
    if (!expanded) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    setExpanded(e => !e);
  };

  const handleCommentClick = (comment, fb = true) => {
    setActiveComment(comment);
    setFromBack(fb);
    setShowState(STATE_TASK_COMMENTS);
  };

  const handleClickBack = () => {
    setShowState(STATE_LIST);
    setActiveComment(undefined);
  };


  return (
    <>
      <div id="messaging-container" className="fixed-bottom d-flex justify-content-end px-2">
        <div className="col messaging-spacer" onClick={handlePanelClick} />
        <div id="messaging" className="bg-white rounded-top shadow shadow-dark">
          {
            (!expanded || showState === STATE_LIST) && (
              <div className="align-items-center justify-content-between p-2 d-flex" id="messaging-header" onClick={handlePanelClick}>
                <div className="d-flex w-100 align-items-center collapsed" role="button" aria-expanded="false" aria-controls="comments">
                  <div>
                    <img className="rounded-circle border mr-2" src={URLS.PROFILE_IMAGE_THUMB(username)} style={styles.userpic} />
                    <span className="d-none unread-indicator-lg bg-success rounded-circle shadow-sm"></span>
                  </div>
                  <h6 className="mb-0">
                    <Trans>Comments</Trans>
                    {expanded && <span className="text-secondary small"> <Trans>(Tasks)</Trans></span>}
                  </h6>
                </div>
                <div className="text-right" style={{ minWidth: '105px' }}>
                  <Link id="comments-toggle" className="p-2 text-secondary collapsed" to="#" aria-controls="comments">
                    {
                      expanded ? (
                        <span>
                          <i className="fal fa-times" aria-hidden="true"></i>
                          <span className="sr-only"><Trans>Close</Trans></span>
                        </span>
                      ) : (
                        <>
                          <i className="far fa-comment-alt" aria-hidden="true"></i>
                          <span className="unread-indicator bg-primary rounded-circle shadow-sm"></span>
                          <span className="sr-only"><Trans>Comments</Trans></span>
                        </>
                      )
                    }
                  </Link>
                </div>
              </div>
            )
          }
          <Collapse in={expanded} mountOnEnter unmountOnExit>
            <div>
              <Collapse in={showState === STATE_LIST} mountOnEnter unmountOnExit>
                <div>
                  <CommentsList
                    onCommentClick={handleCommentClick}
                  />
                </div>
              </Collapse>
              <Collapse in={!!activeComment && showState === STATE_TASK_COMMENTS} mountOnEnter unmountOnExit>
                <div>
                  <TaskComments
                    activeComment={activeComment}
                    onBack={handleClickBack}
                    onClose={handlePanelClick}
                    fromBack={fromBack}
                  />
                </div>
              </Collapse>
            </div>
          </Collapse>
        </div>
      </div>
      {expanded && <div id="messaging-overlay" onClick={handlePanelClick}></div>}
    </>
  );
});

RecentComments.propTypes = {
};

RecentComments.defaultProps = {
};

RecentComments.displayName = 'RecentComments';

export default RecentComments;

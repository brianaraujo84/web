import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useTranslation } from 'react-i18next';

import Comment from './comment';
import { useActionDispatch } from '../../../hooks';
import { getCommunicationObjectsList, updateListItems } from '../../../redux/actions/objects';

const OBJECT_COMMENTS = 'comments';
const LIMIT = 10;
const BACKGROUND_FETCH_TIME = 5000;

const Comments = ({ scrollToBottom, taskId, fileArray, setFileArray }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = React.useState(true);

  const {
    items: comments,
    total: totalComments,
  } = useSelector(state => state.comments);

  const getCommentsByLocId = useActionDispatch(
    getCommunicationObjectsList(
      OBJECT_COMMENTS,
      undefined, undefined,
      `task/${taskId}/comment/list`,
      '',
      undefined,
      'totalCount')
  );
  const updateComments = useActionDispatch(updateListItems(OBJECT_COMMENTS));

  const currentCommentsLength = comments.length;
  const hasMore = !Number.isInteger(totalComments) || totalComments > currentCommentsLength;

  const fetchComments = (start, limit, firstFetch = false, append = false, prepend = false, readonly = false) => {
    return getCommentsByLocId(
      { start, limit },
      '',
      {},
      '',
      firstFetch,
      append,
      prepend,
      readonly,
    );
  };

  const fetchMoreComments = async () => {
    await fetchComments(
      currentCommentsLength,
      LIMIT,
      false,
      true,
      false,
    );
  };

  const fetchCommentsInBackground = async () => {
    const prevCommentsLength = currentCommentsLength;
    const currentStart = 0;
    const chunks = [];
    let start = currentStart;
    while (start < currentCommentsLength) {
      chunks.push(start);
      start += LIMIT;
    }

    if (chunks.length === 0) {
      chunks.push(0);
    }

    const response = await Promise.all(
      chunks.map(chunk => fetchComments(
        chunk, LIMIT, false, false, false, true,
      ))
    );
    if (response && response[0] && prevCommentsLength === comments.length) {
      const total = response[0].totalCount;
      const items = response.reduce((acc, item) => acc.concat(item.comments), []);
      updateComments(items, total);
    }
  };

  const loadComments = async () => {
    await fetchComments(
      0,
      LIMIT * 2,
      true,
    );
    setIsLoading(false);
  };

  React.useEffect(() => {
    if (hasMore) {
      scrollToBottom();
    }
  }, [hasMore]);

  React.useEffect(() => {
    const timerId = setInterval(() => {
      fetchCommentsInBackground();
    }, BACKGROUND_FETCH_TIME);

    return () => {
      clearInterval(timerId);
    };
  }, [totalComments, currentCommentsLength]);

  React.useEffect(() => {
    loadComments();
  }, []);

  if (isLoading) {
    return <div />;
  }
  return (
    <div id="comments-container" className={'container pt-3 flex-grow-1 overflow-auto d-flex flex-column-reverse'}>
      <div className="row justify-content-center">
        <div className="col-12 pt-3 ">
          {
            comments.length === 0
              ? (
                <div id="zero-discussion" data-target="zero-discussion">
                  <div className="row mb-3 pt-3">
                    <div className="col text-center">
                      <img className="mb-3" src="/assets/img/empty.png" width="200" />
                      <p className="mb-0 text-secondary"><em>{t('There is no discussion in your task.')}</em></p>
                    </div>
                  </div>
                </div>
              )
              : (
                <InfiniteScroll
                  dataLength={currentCommentsLength}
                  next={fetchMoreComments}
                  hasMore={hasMore}
                  loader={<div style={{ textAlign: 'center', padding: 20, width: '100%' }}><i className="far fa-spinner fa-spin fa-3x" aria-hidden="true" /></div>}
                  inverse={true}
                  style={{ display: 'flex', flexDirection: 'column-reverse' }}
                  scrollThreshold="100px"
                  scrollableTarget="comments-container"
                >
                  {
                    comments.map((comment, index) => (
                      <Comment
                        key={comment.commentId}
                        commentId={comment.commentId}
                        userName={comment.user}
                        email={comment.userName}
                        comment={comment.comment}
                        createdDate={comment.createdDate}
                        isCurrentUser={comment.currentUser}
                        taskId={taskId}
                        tempUrlArray={comment.tempUrlArray}
                        tempFileArray={comment.tempFileArray}
                        setFileArray={setFileArray}
                        fileArray={index === 0 ? fileArray : []}
                      />
                    ))
                  }
                </InfiniteScroll>
              )
          }
        </div>
      </div>
    </div>
  );
};
Comments.propTypes = {
  scrollToBottom: PropTypes.func,
  taskId: PropTypes.string,
  setFileArray: PropTypes.func,
  fileArray: PropTypes.array,
};

Comments.defaultProps = {
  scrollToBottom: () => { },
};

Comments.displayName = 'Comments';
export default Comments;

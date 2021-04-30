import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

import Comment from './comment';
import { useActionDispatch } from '../../../hooks';
import { getCommunicationObjectsList, updateListItems } from '../../../redux/actions/objects';

const OBJECT_COMMENTS = 'comments';
const LIMIT = 10;
const BACKGROUND_FETCH_TIME = 5000;

const Comments = ({ scrollToBottom }) => {
  const { locationId } = useParams();

  const {
    items: comments,
    total: totalComments,
  } = useSelector(state => state.comments);

  const getCommentsByLocId = useActionDispatch(
    getCommunicationObjectsList(OBJECT_COMMENTS, undefined, undefined, 'location', '/comment/list', undefined, 'totalCount')
  );
  const updateComments = useActionDispatch(updateListItems(OBJECT_COMMENTS));

  const currentCommentsLength = comments.length;
  const hasItems = comments.length > 0;
  const hasMore = !Number.isInteger(totalComments) || totalComments > currentCommentsLength;

  const fetchComments = (start, limit, firstFetch = false, append = false, prepend = false, readonly = false) => {
    return getCommentsByLocId(
      { start, limit },
      locationId,
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
      (Math.ceil((totalComments - currentCommentsLength) / LIMIT) * LIMIT) - LIMIT,
      LIMIT,
      false,
      false,
      true,
    );
  };

  const fetchCommentsInBackground = async () => {
    const prevCommentsLength = currentCommentsLength;
    const currentStart = (Math.ceil((totalComments - currentCommentsLength) / LIMIT) * LIMIT);
    const chunks = [];
    let start = currentStart;
    while (start < totalComments) {
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

  React.useEffect(() => {
    const timerId = setInterval(() => {
      fetchCommentsInBackground();
    }, BACKGROUND_FETCH_TIME);

    return () => {
      clearInterval(timerId);
    };
  }, [totalComments, currentCommentsLength]);

  React.useEffect(() => {
    if (totalComments && currentCommentsLength === 0) {
      fetchComments(
        (Math.ceil(totalComments / LIMIT) * LIMIT) - (LIMIT * 2),
        LIMIT * 2,
        true,
      );
    }
  }, [totalComments, currentCommentsLength]);

  React.useEffect(() => {
    if (hasItems) {
      scrollToBottom();
    }
  }, [hasItems]);

  return (
    <div id="workspace-comments-container" className="container pt-3 pb-3 flex-grow-1 overflow-auto d-flex flex-column-reverse">
      <div className="row justify-content-center">
        <div className="col-12">
          {
            totalComments === 0
              ? (
                <div id="zero-discussion" data-target="zero-discussion">
                  <div className="row mb-3 pt-3">
                    <div className="col text-center">
                      <img className="mb-3" src="/assets/img/empty.png" width="200" />
                      <p className="mb-0 text-secondary"><em>There is no discussion in your workspace.</em></p>
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
                  <div className="comments">
                    {
                      comments.map(comment => (
                        <Comment
                          key={comment.commentId}
                          commentId={comment.commentId}
                          userName={comment.user}
                          email={comment.userName}
                          comment={comment.comment}
                          createdDate={comment.createdDate}
                          timezone={comment.timezone}
                          isCurrentUser={comment.currentUser}
                        />
                      ))
                    }
                  </div>
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
};

Comments.defaultProps = {
  scrollToBottom: () => { },
};

Comments.displayName = 'Comments';
export default Comments;

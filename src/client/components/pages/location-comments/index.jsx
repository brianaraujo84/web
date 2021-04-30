import React, { useRef } from 'react';
import { Trans } from 'react-i18next';
import { useParams } from 'react-router-dom';
import scrollIntoView from 'smooth-scroll-into-view-if-needed';

import Comments from './comments';
import CommentInput from './comment-input';
import Layout from '../../shared/layout';
import { useActionDispatch } from '../../../hooks';
import { getCommunicationObjectsList, updateListItems } from '../../../redux/actions/objects';

const OBJECT_COMMENTS = 'comments';

const LocationComments = () => {
  const scrollToRef = useRef(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const { locationId } = useParams();

  
  const getCommentsByLocId = useActionDispatch(
    getCommunicationObjectsList(OBJECT_COMMENTS, undefined, undefined, 'location', '/comment/list', undefined, 'totalCount')
  );
  
  const updateComments = useActionDispatch(
    updateListItems(OBJECT_COMMENTS)
  );

  const scrollToBottom = () => {
    scrollIntoView(scrollToRef.current, {
      block: 'end',
      behavior: 'auto'
    });
  };

  const fetchComments = async () => {
    const response = await getCommentsByLocId(
      { start: 0, limit: 10 },
      locationId,
      {},
      '',
      true,
      false,
      false
    );
    updateComments([], response.totalCount);
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchComments();
  }, []);

  return (
    <Layout>
      <div className="content-wrapper bg-white">
        <div className="d-flex flex-column">
          <div id="workspace-comments-header" className="container py-2 fixed-top bg-light border-bottom">
            <div className="row justify-content-center">
              <div className="col-12 col-md-6">
                <h6 className="mb-0">
                  <Trans i18nKey="workspace_discussion" defaults="Workspace Discussion" />
                </h6>
              </div>
            </div>
          </div>
          {!isLoading && (
            <>
              <Comments scrollToBottom={scrollToBottom} />
              <CommentInput scrollToBottom={scrollToBottom} />
            </>
          )}
          <div ref={scrollToRef} />
        </div>
      </div>
    </Layout>
  );
};

LocationComments.displayName = 'Location Comments';
export default LocationComments;

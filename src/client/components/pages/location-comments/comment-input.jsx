import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-form-dynamic';
import Button from 'react-bootstrap/Button';

import { useActionDispatch } from '../../../hooks';
import { postCommunicationObject } from '../../../redux/actions/object';
import { addToList } from '../../../redux/actions/objects';

const OBJECT_COMMENT = 'comment';
const OBJECT_COMMENTS = 'comments';

const CommentInput = ({ scrollToBottom }) => {
  const { t } = useTranslation();
  const { locationId } = useParams();

  const postComment = useActionDispatch(postCommunicationObject(OBJECT_COMMENT));
  const addComment = useActionDispatch(addToList(OBJECT_COMMENTS));

  const totalComments = useSelector(state => state.comments.total);
  const profile = useSelector(state => state.profile.data);

  const handleChange = ({ target: { name, value } }) => {
    formik.setFieldValue(name, value);
  };

  const fields = [
    {
      name: 'comment',
      validations: [
        {
          rule: 'required',
        }
      ],
    },
  ];

  const onSubmit = async () => {
    const response = await postComment({ locationId, comment: formik.values.comment });
    await addComment(totalComments, {
      commentId: response.commentId,
      userName: profile.email.replace('@', '$'),
      comment: formik.values.comment,
      user: `${profile.firstName} ${profile.lastName}`,
      currentUser: true,
    });
    scrollToBottom();
    formik.handleReset();
  };

  const formik = useForm({ fields, onSubmit });

  return (
    <div id="comment-input-container" className="fixed-bottom bg-light shadow border-top p-3">
      <form onSubmit={formik.handleSubmit} autoComplete="off">
        <div className="d-flex">
          <div className="d-none pt-2 mr-3">
            <a className="text-secondary" data-toggle="modal" data-target="#add-attachment">
              <i className="far fa-lg fa-paperclip" aria-hidden="true" />
            </a>
          </div>
          <div className="w-100 pr-1">
            <textarea
              id="comment-input"
              name="comment"
              className="form-control"
              rows="1"
              style={{ resize: 'none' }}
              placeholder={t('Add comment to workspace...')}
              onChange={handleChange}
              value={formik.values.comment}
              data-target="comment-input"
            />
          </div>
          <div className="pl-2 pt-2">
            <Button
              id="send"
              type="submit"
              variant="link"
              className="p-0"
              disabled={!formik.isValid || formik.isSubmitting || !formik.values.comment}
            >
              <i className="fas fa-lg fa-paper-plane" aria-hidden="true"></i>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

CommentInput.propTypes = {
  scrollToBottom: PropTypes.func,
};

CommentInput.defaultProps = {
  scrollToBottom: () => {},
};

CommentInput.displayName = CommentInput;
export default CommentInput;

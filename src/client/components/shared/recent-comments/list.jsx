import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useActionDispatch } from '../../../hooks';
import { getCommunicationObjectsList } from '../../../redux/actions/objects';
import * as URLS from '../../../urls';
import { typeIcon } from '../../../utils';

const styles = {
  clearSearch: {
    background: 'none',
    border: 'none',
  },
};

const COMMENTS_LIMIT = 10;

const OBJECT_RECENT_COMMENTS_SEARCH = 'recentCommentsSearch';
const OBJECT_RECENT_COMMENTS = 'recentComments';
let to;

const List = ({ onCommentClick }) => {
  const [search, setSearch] = React.useState('');
  const [searchList, setSearchList] = React.useState([]);
  const { items, total } = useSelector(state => state.recentComments);
  const { t } = useTranslation();

  const getComments = useActionDispatch(getCommunicationObjectsList(OBJECT_RECENT_COMMENTS, 'comments', undefined, 'task', '/comments/recent', undefined, 'totalCount'));

  const fetchComments = (start, limit, firstFetch = false, append = false, prepend = false, readonly = false) => {
    return getComments(
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

  const searchComments = useActionDispatch(getCommunicationObjectsList(OBJECT_RECENT_COMMENTS_SEARCH, 'comments', undefined, 'task', '/comments/recent', undefined, 'totalCount'));

  const fetchMoreComments = async () => {
    await fetchComments(
      items.length,
      COMMENTS_LIMIT,
      false,
      true,
      false,
    );
  };

  const getFormattedDate = date => {
    if (!date) {
      return '';
    }

    if (moment().isSame(moment(date), 'day')) {
      return moment(date).format('h:mm A');
    }

    if (!moment().isSame(moment(date), 'year')) {
      return moment(date).format('MMMM D, YYYY');
    }

    return moment(date).format('MMMM D');
  };

  const handleSearchChange = ({ target: { value } }) => {
    setSearch(value);
    if (to) {
      window.clearTimeout(to);
    }
    if (!value.length) {
      setSearchList([]);
      return;
    }
    to = window.setTimeout(async () => {
      try {
        const { comments } = await searchComments({
          start: 0,
          limit: 10,
          searchTerm: value,
        });
        setSearchList(comments);
      } catch (e) {
        setSearchList([]);
      }
    }, 500);
  };

  const clearSearch = () => {
    if (to) {
      window.clearTimeout(to);
    }
    setSearch('');
    setSearchList([]);
  };

  React.useEffect(() => {
    fetchComments(0, COMMENTS_LIMIT);
  }, []);

  return (
    <div className="border-top collapse show" id="comments">
      <InputGroup>
        <Form.Control
          className="border-0 rounded-0"
          placeholder={t('Search task name...')}
          autoComplete="off"
          onChange={handleSearchChange}
          value={search}
        />
        {
          !!search.length && (
            <InputGroup.Append>
              <InputGroup.Text style={styles.clearSearch} onClick={clearSearch}>
                <i className="fa fa-times-circle" aria-hidden="true"></i>
              </InputGroup.Text>
            </InputGroup.Append>
          )
        }
      </InputGroup>
      <div className="pl-2 border-top keyboard" id="recent-comments-container">
        {
          !!searchList.length && (
            <div className="search-results bg-white px-2 rounded-bottom shadow border-left border-bottom border-right position-absolute">
              {
                searchList.map((c) => (
                  <a className="d-flex flex-column border-bottom p-2" key={c.commentId} onClick={() => onCommentClick(c, false)}>
                    <span className="small text-secondary truncate-1 mb-1 fade-75">{c.locationName}</span>
                    <strong>{c.task}</strong>
                    <span>
                      {
                        !!c.commentCount && (
                          <span className="small text-primary mb-1">
                            {c.commentCount > 1 ? (
                              <Trans i18nKey="{{commentCount}} comments" values={{ commentCount: c.commentCount }} />
                            ) : (
                              <Trans>1 comment</Trans>
                            )}

                          </span>
                        )
                      }
                      <em className="small truncate-2 text-break"><strong>{c.user}</strong> {c.comment}</em>
                    </span>
                  </a>
                ))
              }
            </div>
          )
        }
        <div>
          <InfiniteScroll
            dataLength={items.length}
            next={fetchMoreComments}
            hasMore={items?.length < total}
            loader={<div style={{ textAlign: 'center', padding: 20, width: '100%' }}><i className="far fa-spinner fa-spin fa-3x" aria-hidden="true" /></div>}
            scrollThreshold="100px"
            scrollableTarget="recent-comments-container"
          >
            {
              (items || []).map((c) => (
                <Link className="border-bottom d-flex py-2 collapsed" to="#" key={c.commentId} onClick={() => onCommentClick(c)}>
                  <img className="rounded-circle border mr-2" src={URLS.PROFILE_IMAGE_THUMB(c.userName)} width="40" height="40" />
                  <div className="w-100">
                    <div className="d-flex w-100 justify-content-between">
                      <div className="pr-2">
                        <span className="text-super-light truncate-1 mb-1 fade-75 small">
                          <strong>{c.task}</strong>
                        </span>
                        <div>
                          <span className="text-dark truncate-2 text-break"><strong>{c.user}</strong> {c.comment}</span>
                        </div>
                      </div>
                      {
                        !!c.priority && (
                          <div className="col-auto px-0">
                            <div className={`priority-badge-comment p${c.priority}`}>
                              <div className="priority-badge-number small">{c.priority}</div>
                              <div className="triangle"></div>
                            </div>
                          </div>
                        )
                      }

                    </div>
                    <div className="d-flex align-items-center text-secondary mt-1 fade-75 small pr-2">
                      <span aria-hidden="true" className="chat-loc-icon mr-2 text-primary rounded-circle text-center bg-light">
                        <i className={`fad ${typeIcon(c.locationType)}`} aria-hidden="true"></i>
                      </span>
                      <span className="text-super-light w-100 ellipsis">{c.locationName}</span>
                      <strong className="col-auto pr-0">
                        {getFormattedDate(c.createdDate)}
                      </strong>
                    </div>
                  </div>
                </Link>
              ))
            }
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

List.propTypes = {
  onCommentClick: PropTypes.func.isRequired,
};

List.defaultProps = {
};

List.displayName = 'List';
export default List;

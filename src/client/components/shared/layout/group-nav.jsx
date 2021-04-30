import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { classnames } from 'react-form-dynamic';
import PropTypes from 'prop-types';

import URLS from '../../../urls';
import useOnClickOutside from '../../../hooks/useOnClickOutside';
import { useActionDispatch } from '../../../hooks';
import { postConfidenceObject } from '../../../redux/actions/object';

const OBJECT_GROUP = 'group';

const GroupNav = ({ open, onToggle, locationUserRole }) => {
  const history = useHistory();
  const { locationId, taskTemplateId } = useParams();
  const { pathname } = history.location;

  const {
    locationName,
  } = useSelector(state => state.loc.data);
  const profile = useSelector(state => state.profile.data);

  const updateGroupList = useSelector(state => state.groupMenuUpdate?.data?.update);

  const ref = React.useRef();

  const handleOutsideClick = React.useCallback(() => {
    if(open) {
      onToggle();
    }
  }, [open, onToggle]);

  const handleNavigate = (templateId) => {
    history.push(URLS.TASK_DETAILS(locationId, templateId), { GroupNavOpen: true,  templateId});
  };

  useOnClickOutside(ref, handleOutsideClick);

  const customTemplate = useActionDispatch(postConfidenceObject(OBJECT_GROUP));
  const getGroupsList = useActionDispatch(postConfidenceObject(undefined, undefined, 'group/list'));

  const [groupList, setGroupList] = React.useState([]);
  const [lastCommittedId, setLastCommittedId] = React.useState();

  const updateList = () => {
    getGroupsList({ locationId, types: ['custom', 'Main'] }).then(({ groups = [] }) => {
      groups.sort((g1, g2) => g1.templateType < g2.templateType ? -1 : (g1.templateType > g2.templateType ? 1 : 0));
      setGroupList(groups);
    });
  };

  React.useEffect(() => {
    if (lastCommittedId !== locationId || updateGroupList) {
      updateList();
    }
    setLastCommittedId(locationId);
  },[updateGroupList, locationId]);

  if(!locationId || pathname.includes('templates')) {
    return <></>;
  }

  const handleCreateGroupClick = async () => {
    const dataUpdated = {
      jobManager: profile.username,
      locationId,
      templateName:	'New Group',
    };
    const { templateId } = await customTemplate(dataUpdated);
    if (templateId) {
      updateList();
      history.push(URLS.TASK_DETAILS(locationId, templateId), { templateId, isFirstTime: true });
    }
  };

  return (
    <nav id="grouplist" className={open ? 'open': 'closed'} ref={ref} style={{ width: '250' }}>
      <a 
        className={open ? 'grouplist-toggler rounded-left border-left border-bottom border-top': 'grouplist-toggler rounded-left border-left border-bottom border-top shadow'}
        data-target='group-nav-toggle-icon'
        onClick={onToggle}
      >
        <i className="fas fa-lg fa-grip-lines-vertical" aria-hidden="true"></i>
      </a>
      <div>
        <div className='position-fixed w-100 pt-2 pb-3 px-3 border-bottom bg-light'>
          <h6 className="text-secondary mb-3"><span className="truncate-1">{locationName}</span></h6>
          {(locationUserRole === 'Owner' || locationUserRole === 'Manager') && <a onClick={handleCreateGroupClick} href="#" className="btn btn-sm btn-primary btn-block">
          Create Group
          </a>}
        </div>
      </div>
      <div className="group-list bg-white">
        <ul className="navbar-nav mr-auto">
          {groupList?.map((task) => {
            return (
              <li
                key={`task-${task.templateId}`}
                className={classnames(['nav-item', task.templateId === parseInt(taskTemplateId) && 'selected'])}
                onClick={() => handleNavigate(task.templateId)}
              >
                <a className="nav-link" href="#">
                  <span className="truncate-1">
                    <i className={task.templateType === 'Main' ? 'fas fa-list-ol' : 'far fa-rectangle-landscape'} aria-hidden="true"></i>
                    {` ${task.templateName}`}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

GroupNav.propTypes = {
  open: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  locationUserRole: PropTypes.string,
};

GroupNav.displayName = 'GroupNav';
export default GroupNav;

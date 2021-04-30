import React from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { useActionDispatch } from '../../../hooks';
import { logout } from '../../../redux/actions/profile';
import * as URLS from '../../../urls';

const TaskCommentNotificaton = () => {
  const history = useHistory();
  const locData = useLocation();
  const paramData = useParams();

  const getQueryParams = (path = '') => {
    const str = path.substr(1, path.length);
    const ret = {};
    if (!path) {
      return ret;
    }
    const queryArray = str.split('&');
    for (let i = 0; i < queryArray.length; i++) {
      const param = queryArray[i].split('=');
      ret[param[0]] = param[1];
    }
    if (ret.newUser) {
      ret.mobile = ret.userName;
      delete ret.userName;
    }
    return ret;
  };

  let notificationPage = false;
  let locParamData = {};
  if (locData.search) {
    locParamData = getQueryParams(locData.search);
    notificationPage = locData.pathname === '/commentnotificaton';
  }
  const { mobile, locationId, taskId, newUser, templateId } = notificationPage ? locParamData : paramData;

  const { loggedIn } = useSelector(state => state.profile);
  const doLogout = useActionDispatch(logout);
  const { pathname } = history.location;
  const isNewUserURL = pathname && pathname.endsWith('/true');

  const gotoLogin = (path, data) => {
    const redirectTo = URLS.LOGIN(encodeURIComponent(path));
    history.replace({ pathname: redirectTo, data });
  };

  React.useEffect(() => {
    if (newUser || isNewUserURL) {
      if (loggedIn) {
        doLogout();
      }

      const data = {
        phone: mobile,
        taskId,
      };
      const pathname = URLS.SIGNUP_TYPE(mobile, 'worker');
      history.replace({ pathname, data });
    } else {
      // if (loggedIn && phone !== mobile) {
      //   doLogout();
      // }
      const data = {
        locationId, 
        taskId, 
        templateId,
      };
      if (locationId && taskId && templateId) {
        const pathname = URLS.TASK_COMMENTS(locationId, templateId, taskId);
        loggedIn ? history.replace({ pathname, data }) : gotoLogin(pathname, data);
      }
    }
  }, []);


  return null;
};

TaskCommentNotificaton.displayName = 'TaskCommentNotificaton';
export default TaskCommentNotificaton;

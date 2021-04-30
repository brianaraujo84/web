import React from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { useActionDispatch } from '../../../hooks';
import { logout } from '../../../redux/actions/profile';
import * as URLS from '../../../urls';

const WorkerTaskMobile = () => {
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
    notificationPage = locData.pathname === '/bulknotificaton' && 'bulk';
  }
  const { mobile, locationId, taskId, newUser, cardType, templateId, userName, cardStatus } = notificationPage ? locParamData : paramData;

  const { loggedIn } = useSelector(state => state.profile);
  const doLogout = useActionDispatch(logout);
  const { pathname } = history.location;
  const isNewUserURL = pathname && pathname.endsWith('/true');

  const gotoLogin = (path, data) => {
    const redirectTo = URLS.LOGIN(encodeURIComponent(path));
    history.replace({ pathname: redirectTo, data });
  };

  React.useEffect(() => {
    if (userName) {
      const data = { username: userName };
      if (notificationPage === 'bulk') {
        if (cardType === 'task') {
          const pathname = URLS.LOCATION(locationId, cardStatus);
          loggedIn ? history.replace({ pathname, data: {tabOnNotify: cardType} }) : gotoLogin(pathname, data);
          return;
        } else if (cardType === 'group') {
          const pathname = URLS.LOCATION(locationId, cardStatus);
          loggedIn ? history.replace({ pathname, data: {tabOnNotify: cardType} }) : gotoLogin(pathname, data);
          return;
        }
      } else if (cardType === 'task') {
        const pathname = URLS.NOTIFY_OWNER_TASK_GRP(locationId, cardType, taskId, templateId);
        loggedIn ? history.replace({ pathname, state: {templatetype: 'Custom' } }) : gotoLogin(pathname, data);
        return;
      } else if (cardType === 'group') {
        const pathname = URLS.TASK_DETAILS(locationId, templateId);
        loggedIn ? history.replace({ pathname, state: {templatetype: 'Main' } }) : gotoLogin(pathname, data);
        return;
      }
    }

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
        username: mobile,
        taskId,
      };
      //const pathname = URLS.LOCATION_ASSIGNED_TO_YOU(locationId);
      if (cardType === 'task') {
        const pathname = URLS.NOTIFY_MY_TASK_GRP(locationId, cardType, taskId, templateId);
        loggedIn ? history.replace({ pathname, data }) : gotoLogin(pathname, data);
      } else if (cardType === 'group') {
        const pathname = URLS.TASK_DETAILS(locationId, templateId, 'tm');
        loggedIn ? history.replace({ pathname, data }) : gotoLogin(pathname, data);
      }
    }
  }, []);


  return null;
};

WorkerTaskMobile.displayName = 'WorkerTaskMobile';
export default WorkerTaskMobile;

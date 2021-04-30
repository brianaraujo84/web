
import ReactDOM from 'react-dom';
import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';

import ElectronLoader from './electron-loader';
import PrivateRoute from './private-route';

import * as URLS from './urls';
import '../../assets/css/main.css';

import Parent from './parent';
import ModalContainer from './modal-container';

import {
  Page404,
  Page400,
  Page500,
  Home,
  Login,
  Signup,
  AddLocation,
  Locations,
  LocationsConfigureZones,
  LocationDetails,
  LocationComments,
  MyLocationDetails,
  TemplateSelection,
  TaskDetails,
  ForgotPassword,
  WorkerTaskMobile,
  Account,
  VerifyUser,
  TaskTemplate,
  ProductDetails,
  VirtualDisplay,
  DevicesConnected,
  Devices,
  AddDevice,
  DeviceActivate,
  DeviceDetails,
  DevicesList,
  VirtualDeviceAdd,
  Subscription,
  TeamUpgrade,
  MarketPlace,
  NewTemplate,
  Templates,
  TemplateTasks,
  TemplateDetails,
  TrialEnded,
  Billing,
  NotifyTaskDetails,
  SingleTaskDetails,
  SelectWorkspace,
  Activate,
  TaskCommentNotificaton,
} from './components';

import './i18n';
import 'react-datepicker/dist/react-datepicker.css';
import './css/style.css';
import store from './redux/store';

const container = document.getElementById('react-container');
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter basename="/">
      <Parent>
        <ElectronLoader />
        <Switch>
          <PrivateRoute exact path={URLS.HOME} component={Home} />
          <PrivateRoute exact path={URLS.ADD_LOCATION} component={AddLocation} />
          <PrivateRoute exact path={URLS.LOCATION_CONFIGURE_ZONES(':locationId')} component={LocationsConfigureZones} />
          <PrivateRoute exact path={URLS.TASK_TEMPLATES(':locationId')} component={TemplateSelection} />
          <PrivateRoute exact path={URLS.LOCATION_COMMENTS(':locationId')} component={LocationComments} />
          <PrivateRoute exact path={URLS.TASK_COMMENTS(':locationId', ':templateId', ':taskId')} component={SingleTaskDetails} />
          <PrivateRoute exact path={URLS.LOCATION_TASK_DETAILS(':locationId', ':cardType', ':taskId', ':templateId?')} component={NotifyTaskDetails} />
          <PrivateRoute exact path={URLS.LOCATION(':locationId', ':filter?')} component={LocationDetails} />
          <Redirect exact from={URLS.LOCATION_RELOAD(':locationId')} to={URLS.LOCATION(':locationId', ':filter?')} />
          <PrivateRoute exact path={URLS.LOCATION_ASSIGNED_TO_YOU(':locationId', ':filter?', ':taskId?')} component={MyLocationDetails} />
          <PrivateRoute exact path={URLS.TASK_TEMPLATE(':locationId', ':templateId')} component={TaskTemplate} />
          <PrivateRoute exact path={URLS.TASK_DETAILS(':locationId', ':taskTemplateId', ':tm?')} component={TaskDetails} />
          <Redirect exact from={URLS.TASK_DETAILS_RELOAD(':locationId', ':taskTemplateId', ':tm?')} to={URLS.TASK_DETAILS(':locationId', ':taskTemplateId', ':tm?')} />
          <PrivateRoute exact path={URLS.PRODUCT_DETAILS(':templateId')} component={ProductDetails} />
          <PrivateRoute exact path={URLS.LOCATIONS} component={Locations} />
          <PrivateRoute exact path={URLS.ACCOUNT} component={Account} />
          <PrivateRoute exact path={URLS.VIRTUAL_DISPLAY(':deviceId')} component={VirtualDisplay} />
          <PrivateRoute exact path={URLS.DEVICES} component={DevicesConnected} />
          <PrivateRoute exact path={URLS.DEVICES_CONNECTED} component={Devices} />
          <PrivateRoute exact path={URLS.ADD_DEVICE} component={AddDevice} />
          <PrivateRoute exact path={URLS.DEVICE_CONFIGURE} component={AddDevice} />
          <PrivateRoute exact path={URLS.DEVICE_ACTIVATE(':deviceId')} component={DeviceActivate} />
          <PrivateRoute exact path={URLS.DEVICE_DETAILS(':deviceId')} component={DeviceDetails} />
          <PrivateRoute exact path={URLS.DEVICES_LIST(':locationId')} component={DevicesList} />
          <PrivateRoute exact path={URLS.ADD_VIRTUAL_DEVICE(':locationId')} component={VirtualDeviceAdd} />
          <PrivateRoute exact path={URLS.MARKETPLACE} component={MarketPlace} />
          <PrivateRoute exact path={URLS.NEW_TEMPLATE} component={NewTemplate} />
          <PrivateRoute exact path={URLS.TEMPLATES} component={Templates} />
          <PrivateRoute exact path={URLS.TEMPLATE_TASKS(':templateId')} component={TemplateTasks} />
          <PrivateRoute exact path={URLS.TEMPLATE_DETILAS(':templateId')} component={TemplateDetails} />
          <PrivateRoute exact path={URLS.SELECT_WORKSPACE} component={SelectWorkspace} />
          <PrivateRoute exact path={URLS.ACTIVATE(':step?', ':id?')} component={Activate} />
          <Route exact path={URLS.TRIAL_ENDED} component={TrialEnded} />
          <Route exact path={URLS.BILLING} component={Billing} />
          <Route exact path={URLS.LOGIN(':redirect?')} component={Login} />
          <Route exact path={URLS.SUBSCRIPTION} component={Subscription} />
          <Route exact path={URLS.TEAM_UPGRADE} component={TeamUpgrade} />
          <Route exact path={URLS.SIGNUP} component={Signup} />
          <Route exact path={URLS.SIGNUP_TYPE(':phone', ':type')} component={Signup} />
          <Route exact path={URLS.VERIFY_USER(':userId', ':verifyCode')} component={VerifyUser} />
          <Route exact path={URLS.FORGOT_PASSWORD} component={ForgotPassword} />
          <Route exact path={URLS.WORKER_TASK_MOBILE(':cardType', ':mobile', ':locationId', ':templateId', ':taskId', 'true')} component={WorkerTaskMobile} />
          <Route exact path={URLS.WORKER_TASK_MOBILE(':cardType', ':mobile', ':locationId', ':templateId', ':taskId')} component={WorkerTaskMobile} />
          <Route exact path={URLS.WORKER_TASK_STATUS_MOBILE(':cardType', ':cardStatus', ':mobile', ':locationId', ':templateId', ':taskId', 'true')} component={WorkerTaskMobile} />
          <Route exact path={URLS.WORKER_TASK_STATUS_MOBILE(':cardType', ':cardStatus', ':mobile', ':locationId', ':templateId', ':taskId')} component={WorkerTaskMobile} />
          <Route exact path={URLS.BULK_NOTIFICATION_MOBILE} component={WorkerTaskMobile} />
          <Route exact path={URLS.OWNER_TASK_MOBILE(':cardType', ':userName', ':locationId', ':templateId', ':taskId')} component={WorkerTaskMobile} />
          <Route exact path={URLS.NOTIFY_MY_TASK_GRP(':locationId', ':cardType', ':taskId', ':templateId?')} component={NotifyTaskDetails} />
          <Route exact path={URLS.NOTIFY_OWNER_TASK_GRP(':locationId', ':cardType', ':taskId', ':templateId?')} component={NotifyTaskDetails} />
          <Route exact path={URLS.NOTIFY_TASK_COMMENT} component={TaskCommentNotificaton} />
          <Route exact path={URLS.PAGE_404} component={Page404} />
          <Route exact path={URLS.PAGE_400} component={Page400} />
          <Route exact path={URLS.PAGE_500} component={Page500} />
          <Route component={Page404} />
        </Switch>
        <ModalContainer />
      </Parent>
    </BrowserRouter>
  </Provider>,
  container
);

// Needed for Hot Module Replacement
if (typeof (module.hot) !== 'undefined') { // eslint-disable-line no-undef  
  module.hot.accept(); // eslint-disable-line no-undef  
}


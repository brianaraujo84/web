import {
  LOGIN_STARTED,
  LOGIN_ENDED,
  GET_PROFILE_DATA_STARTED,
  GET_PROFILE_DATA_ENDED,
  LOGOUT_ENDED,
  LOGOUT_STARTED,
  MANAGE_USER_STARTED,
  MANAGE_USER_ENDED,
  FORGOT_STARTED,
  FORGOT_ENDED,
  RESET_STARTED,
  RESET_ENDED,
  UPDATE_USER_STARTED,
  UPDATE_USER_ENDED,
  UPDATE_COMPANY_STARTED,
  UPDATE_COMPANY_ENDED,
  RESEND_CODE_STARTED,
  RESEND_CODE_ENDED,
  IS_SUBSCRIPTION_VALID_STARTED,
  IS_SUBSCRIPTION_VALID_ENDED,
  START_SUBSCRIPTION_STARTED,
  START_SUBSCRIPTION_ENDED,
  CHECK_USER_UPGRADE_STARTED,
  CHECK_USER_UPGRADE_ENDED,
  UPDATE_USER_DATA,
} from '../reducers/profile';

import {
  _getUserData,
  _logout,
  _login,
  _postService,
  _forgotPassword,
  _resetPassword,
  _isSubscriptionValid,
  _startFreeTrail,
  _checkUserUpgrade,
} from '../../services/profile';

export const login = (dispatch, data) => {
  dispatch({ type: LOGIN_STARTED });

  return _login(data)
    .then(response => {
      dispatch({
        type: LOGIN_ENDED,
        userData: response,
        error: false,
      });
      return response;
    }, error => {
      dispatch({
        type: GET_PROFILE_DATA_ENDED,
        userData: {},
        error: true,
      });
      throw error.data;
    });
};

/**
 * get user profile data
 * @return {dispatch function}
 */
export const getProfileData = (dispatch) => {
  dispatch({ type: GET_PROFILE_DATA_STARTED });

  return _getUserData()
    .then(response => {
      dispatch({
        type: GET_PROFILE_DATA_ENDED,
        userData: response,
        error: false,
      });
      return response;
    }, error => {
      dispatch({
        type: GET_PROFILE_DATA_ENDED,
        userData: {},
        error: true,
      });
      throw error.response;
    });
};


/**
 * logout
 * @return {dispatch function}
 */
export const logout = (dispatch, data) => {
  dispatch({ type: LOGOUT_STARTED });

  return _logout(data)
    .then(response => {
      dispatch({
        type: LOGOUT_ENDED,
        error: false,
      });
      return response.data;
    }, error => {
      dispatch({
        type: LOGOUT_ENDED,
        error: true,
      });
      throw error;
    });
};

/**
 * logout
 * @return {dispatch function}
 */
export const manageUser = (dispatch, data) => {
  dispatch({ type: MANAGE_USER_STARTED });

  return _postService('v1/confidence/manage/user', data)
    .then(response => {
      dispatch({
        type: MANAGE_USER_ENDED,
        error: false,
      });
      return response.data;
    }, error => {
      dispatch({
        type: MANAGE_USER_ENDED,
        error: true,
      });
      throw error;
    });
};

export const updateUser = (dispatch, data) => {
  dispatch({ type: UPDATE_USER_STARTED });

  return _postService('v1/confidence/user', data)
    .then(response => {
      dispatch({
        type: UPDATE_USER_ENDED,
        data,
        error: false,
      });
      return response.data;
    }, error => {
      dispatch({
        type: UPDATE_USER_ENDED,
        error: true,
      });
      throw error;
    });
};

export const updateCompany = (dispatch, data) => {
  dispatch({ type: UPDATE_COMPANY_STARTED });

  return _postService('v1/confidence/company', data)
    .then(response => {
      dispatch({
        type: UPDATE_COMPANY_ENDED,
        data,
        error: false,
      });
      return response.data;
    }, error => {
      dispatch({
        type: UPDATE_COMPANY_ENDED,
        error: true,
      });
      throw error;
    });
};

export const forgotPassword = (dispatch, data) => {
  dispatch({ type: FORGOT_STARTED });

  return _forgotPassword(data)
    .then(response => {
      dispatch({
        type: FORGOT_ENDED,
        userData: response,
        error: false,
      });
      return response;
    }, error => {
      dispatch({
        type: FORGOT_ENDED,
        userData: {},
        error: true,
      });
      throw error.data;
    });
};

export const resetPassword = (dispatch, data) => {
  dispatch({ type: RESET_STARTED });

  return _resetPassword(data)
    .then(response => {
      dispatch({
        type: RESET_ENDED,
        error: false,
      });
      return response;
    }, error => {
      dispatch({
        type: RESET_ENDED,
        error: true,
      });
      throw error.data;
    });
};

export const resendCode = (dispatch, data) => {
  dispatch({ type: RESEND_CODE_STARTED });

  return _postService('v1/user/onetimepasscode', data)
    .then(response => {
      dispatch({
        type: RESEND_CODE_ENDED,
        error: false,
      });
      return response.data;
    }, error => {
      dispatch({
        type: RESEND_CODE_ENDED,
        error: true,
      });
      throw error;
    });
};

export const isSubscriptionValid = (dispatch) => {
  dispatch({ type: IS_SUBSCRIPTION_VALID_STARTED });

  return _isSubscriptionValid()
    .then(response => {
      dispatch({
        type: IS_SUBSCRIPTION_VALID_ENDED,
        subscription: response,
        error: false,
      });
      return response;
    }, error => {
      dispatch({
        type: IS_SUBSCRIPTION_VALID_ENDED,
        subscription: {},
        error: true,
      });
      throw error.response;
    });
};

export const startFreeTrail = (dispatch, data) => {
  dispatch({ type: START_SUBSCRIPTION_STARTED });

  return _startFreeTrail(data)
    .then(response => {
      dispatch({
        type: START_SUBSCRIPTION_ENDED,
        subscriptionStatus: response,
        error: false,
      });
      return response;
    }, error => {
      dispatch({
        type: START_SUBSCRIPTION_ENDED,
        subscriptionStatus: {},
        error: true,
      });
      throw error.response;
    });
};

export const checkUserUpgrade = (dispatch) => {
  dispatch({ type: CHECK_USER_UPGRADE_STARTED });

  return _checkUserUpgrade()
    .then(response => {
      dispatch({
        type: CHECK_USER_UPGRADE_ENDED,
        teamUpgradePrompt: response.teamUpgragePrompt,
        quickCompleteTaskOption: response.quickCompleteTaskOption,
        error: false,
      });
      return response;
    }, error => {
      dispatch({
        type: CHECK_USER_UPGRADE_ENDED,
        subscriptionStatus: {},
        error: true,
      });
      throw error.response;
    });
};

export const updateUserProfile = (dispatch, data) => {
  return dispatch({ type: UPDATE_USER_DATA, data });
};

import * as URLS from '../../urls';

export const LOGIN_STARTED = 'profile/LOGIN_STARTED';
export const LOGIN_ENDED = 'profile/LOGIN_ENDED';
export const GET_PROFILE_DATA_STARTED = 'profile/GET_PROFILE_DATA_STARTED';
export const GET_PROFILE_DATA_ENDED = 'profile/GET_PROFILE_DATA_ENDED';
export const LOGOUT_STARTED = 'profile/LOGOUT_STARTED';
export const LOGOUT_ENDED = 'profile/LOGOUT_ENDED';
export const MANAGE_USER_STARTED = 'profile/MANAGE_USER_STARTED';
export const MANAGE_USER_ENDED = 'profile/MANAGE_USER_ENDED';
export const FORGOT_STARTED = 'profile/FORGOT_STARTED';
export const FORGOT_ENDED = 'profile/FORGOT_ENDED';
export const RESET_STARTED = 'profile/RESET_STARTED';
export const RESET_ENDED = 'profile/RESET_ENDED';
export const UPDATE_USER_STARTED = 'profile/UPDATE_USER_STARTED';
export const UPDATE_USER_ENDED = 'profile/UPDATE_USER_ENDED';
export const UPDATE_COMPANY_STARTED = 'profile/UPDATE_COMPANY_STARTED';
export const UPDATE_COMPANY_ENDED = 'profile/UPDATE_COMPANY_ENDED';
export const RESEND_CODE_STARTED = 'profile/RESEND_CODE_STARTED';
export const RESEND_CODE_ENDED = 'profile/RESEND_CODE_ENDED';
export const IS_SUBSCRIPTION_VALID_STARTED = 'profile/IS_SUBSCRIPTION_VALID_STARTED';
export const IS_SUBSCRIPTION_VALID_ENDED = 'profile/IS_SUBSCRIPTION_VALID_ENDED';
export const START_SUBSCRIPTION_STARTED = 'profile/START_SUBSCRIPTION_STARTED';
export const START_SUBSCRIPTION_ENDED = 'profile/START_SUBSCRIPTION_ENDED';
export const CHECK_USER_UPGRADE_STARTED = 'profile/CHECK_USER_UPGRADE_STARTED';
export const CHECK_USER_UPGRADE_ENDED = 'profile/CHECK_USER_UPGRADE_ENDED';
export const UPDATE_USER_DATA = 'profile/UPDATE_USER_DATA';

const initialState = {
  data: {},
  inprogress: false,
  error: false,
  loggedIn: false,
  forgotPassword: '',
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_STARTED:
      return {
        ...state,
        inprogress: true,
        error: false,
      };
    case LOGIN_ENDED:
      return {
        ...state,
        inprogress: false,
        loggedIn: true,
        data: action.userData,
        error: action.error,
      };
    case GET_PROFILE_DATA_STARTED:
      return {
        ...state,
        inprogress: true,
        error: false,
        data: {},
      };
    case GET_PROFILE_DATA_ENDED:
      return {
        ...state,
        inprogress: false,
        data: action.userData,
        error: action.error,
        loggedIn: !action.error,
      };
    case LOGOUT_STARTED:
      return {
        ...state,
        inprogress: true,
        loggedIn: false,
      };
    case LOGOUT_ENDED:
      return {
        ...state,
        inprogress: false,
        loggedIn: false,
        data: {},
      };
    case MANAGE_USER_STARTED:
      return {
        ...state,
        inprogress: true,
        error: false,
      };
    case MANAGE_USER_ENDED:
      return {
        ...state,
        inprogress: false,
        error: action.error
      };
    case UPDATE_COMPANY_STARTED:
      return {
        ...state,
        inprogress: true,
        error: false,
      };
    case UPDATE_COMPANY_ENDED:
      return {
        ...state,
        inprogress: false,
        error: action.error
      };
    case UPDATE_USER_STARTED:
      return {
        ...state,
        inprogress: true,
        error: false,
      };
    case UPDATE_USER_ENDED: {
      if (!action.error) {
        const { firstName, lastName, email, userName } = action.data;
        const img = URLS.PROFILE_IMAGE(userName);
        const imgThumb = URLS.PROFILE_IMAGE_THUMB(userName, 4);

        return {
          ...state,
          data: { ...state.data, firstName, lastName, email, img, imgThumb },
          inprogress: false,
          error: action.error
        };
      } else {
        return {
          ...state,
          inprogress: false,
          error: action.error
        };
      }
    }
    case FORGOT_STARTED:
      return {
        ...state,
        inprogress: true,
        error: false,
      };
    case FORGOT_ENDED:
      return {
        ...state,
        inprogress: false,
        error: action.error,
      };
    case RESET_STARTED:
      return {
        ...state,
        inprogress: true,
        error: false,
      };
    case RESET_ENDED:
      return {
        ...state,
        inprogress: false,
        error: action.error,
      };
    case RESEND_CODE_STARTED:
      return {
        ...state,
        inprogress: true,
        error: false,
      };
    case RESEND_CODE_ENDED:
      return {
        ...state,
        inprogress: false,
        error: action.error,
      };
    case IS_SUBSCRIPTION_VALID_STARTED:
      return {
        ...state,
        inprogress: true,
        error: false,
      };
    case IS_SUBSCRIPTION_VALID_ENDED:
      return {
        ...state,
        inprogress: false,
        data: { ...state.data, subscription: action.subscription },
        error: action.error,
      };
    case START_SUBSCRIPTION_STARTED:
      return {
        ...state,
        inprogress: true,
        error: false,
      };
    case START_SUBSCRIPTION_ENDED:
      return {
        ...state,
        inprogress: false,
        data: { ...state.data, subscriptionStatus: action.subscriptionStatus },
        error: action.error,
      };
    case CHECK_USER_UPGRADE_STARTED:
      return {
        ...state,
        data: { ...state.data, isUpgradeCheckCompleted: false },
        inprogress: true,
        error: false,
      };
    case CHECK_USER_UPGRADE_ENDED:
      return {
        ...state,
        inprogress: false,
        data: { ...state.data, isUpgradeCheckCompleted: true, teamUpgradePrompt: action.teamUpgradePrompt, quickCompleteTaskOption: action.quickCompleteTaskOption },
        error: action.error,
      };
    case UPDATE_USER_DATA:
      return {
        ...state,
        inprogress: false,
        data: { ...state.data, ...action.data },
        error: action.error,
      };
    default:
      return state;
  }
};

export default profileReducer;

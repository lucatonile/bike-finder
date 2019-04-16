import {
  REQUEST_NEW_PASSWORD_BEGIN,
  REQUEST_NEW_PASSWORD_FAILURE,
  REQUEST_NEW_PASSWORD_SUCCESS,
  REQUEST_NEW_PASSWORD_RESET,
} from '../actions/types';

const RESET_STATE = {
  init: true,
  loadingReset: false,
  passwordResetDone: false,
  error: '',
};

const ResetPasswordReducer = (state = RESET_STATE, action) => {
  switch (action.type) {
    case REQUEST_NEW_PASSWORD_RESET:
      return { ...state, passwordResetDone: false };
    case REQUEST_NEW_PASSWORD_BEGIN:
      return { ...state, loadingReset: true, passwordResetDone: false };
    case REQUEST_NEW_PASSWORD_FAILURE:
      return {
        ...state,
        loadingReset: false,
        passwordResetDone: false,
        error: action.payload,
      };
    case REQUEST_NEW_PASSWORD_SUCCESS:
      return {
        ...state,
        loadingReset: false,
        passwordResetDone: true,
        error: '',
      };
    default:
      return state;
  }
};

export default ResetPasswordReducer;

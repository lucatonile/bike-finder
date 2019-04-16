import {
  REQUEST_NEW_PASSWORD_BEGIN,
  REQUEST_NEW_PASSWORD_FAILURE,
  REQUEST_NEW_PASSWORD_SUCCESS,
  REQUEST_NEW_PASSWORD_RESET,
} from './types';

import serverApi from '../../utilities/serverApi';

export const requestNewPasswordBegin = () => (
  {
    type: REQUEST_NEW_PASSWORD_BEGIN,
  }
);

export const requestNewPasswordFailure = error => (
  {
    type: REQUEST_NEW_PASSWORD_FAILURE,
    payload: error,
  }
);

export const requestNewPasswordReset = () => (
  {
    type: REQUEST_NEW_PASSWORD_RESET,
  }
);

export const requestNewPasswordSuccess = () => (
  {
    type: REQUEST_NEW_PASSWORD_SUCCESS,
  }
);

export function requestNewPasswordInit(emailUsername) {
  let body = { email_username: emailUsername };

  body = JSON.stringify(body);
  return serverApi.postDispatch(
    'auth/resetpassword/',
    body,
    'application/json',
    null,
    requestNewPasswordBegin,
    requestNewPasswordFailure,
    requestNewPasswordSuccess,
  );
}

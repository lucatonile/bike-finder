import {
  PROFILE_IMG_URI,
  UPLOAD_PROFILE_IMG_BEGIN,
  UPLOAD_PROFILE_IMG_FAILURE,
  UPLOAD_PROFILE_IMG_SUCCESS,
  SET_LOCATION,
  SET_PROFILE_STATE,
  LOAD_PROFILE_BEGIN,
  LOAD_PROFILE_SUCCESS,
  LOAD_PROFILE_FAILURE,
  UNLOAD_PROFILE,
  UPDATE_USER_BEGIN,
  UPDATE_USER_FAILURE,
  UPDATE_USER_SUCCESS,
  UPDATE_RESET,
  RESET_PROFILE_NOTIFICATION,
  SET_PROFILE_NOTIFICATION,
  SET_PROFILE_NOTIFICATION_INTERVAL,
} from './types';
import serverApi from '../../utilities/serverApi';
import { deleteJWTInit } from './JwtActions';

export const saveImageToState = uri => (
  {
    type: PROFILE_IMG_URI,
    payload: uri,
  }
);

export const imgUploadBegin = () => (
  {
    type: UPLOAD_PROFILE_IMG_BEGIN,
  }
);

export const imgUploadFailure = error => (
  {
    type: UPLOAD_PROFILE_IMG_FAILURE,
    payload: error,
  }
);

export const imgUploadSuccess = avatarUri => (
  {
    type: UPLOAD_PROFILE_IMG_SUCCESS,
    payload: avatarUri,
  }
);

export const setLocation = location => (
  {
    type: SET_LOCATION,
    payload: location,
  }
);

export const setProfile = data => (
  {
    type: SET_PROFILE_STATE,
    payload: data,
  }
);

export const loadProfileBegin = () => (
  {
    type: LOAD_PROFILE_BEGIN,
  }
);

export const loadProfileSuccess = data => (
  {
    type: LOAD_PROFILE_SUCCESS,
    payload: data,
  }
);

export const loadProfileFailure = error => (
  {
    type: LOAD_PROFILE_FAILURE,
    payload: error,
  }
);

export const unloadProfile = () => (
  {
    type: UNLOAD_PROFILE,
  }
);

export const UpdateUserBegin = () => (
  {
    type: UPDATE_USER_BEGIN,
  }
);

export const UpdateUserFailure = error => (
  {
    type: UPDATE_USER_FAILURE,
    payload: error,
  }
);

export const UpdateUserSuccess = data => (
  {
    type: UPDATE_USER_SUCCESS,
    payload: data,
  }
);

export const updateReset = () => (
  {
    type: UPDATE_RESET,
  }
);


export function updateUserInit(newUser, jwt) {
  const body = JSON.stringify(newUser);
  return serverApi.postDispatch(
    'users/updateuser/',
    body,
    'application/json',
    jwt,
    UpdateUserBegin,
    UpdateUserFailure,
    UpdateUserSuccess,
  );
}

export const resetNotifiction = () => (
  {
    type: RESET_PROFILE_NOTIFICATION,
  }
);

export const setNotifiction = () => (
  {
    type: SET_PROFILE_NOTIFICATION,
  }
);

export const setNotifictionInterval = () => (
  {
    type: SET_PROFILE_NOTIFICATION_INTERVAL,
  }
);

export function uploadProfilePicToServer(imgUri, username, jwt) {
  const file = {
    uri: imgUri,
    type: 'image/jpg',
    name: `${username}.jpg`,
  };
  const formBody = new FormData();
  formBody.append('image', file);
  return serverApi.postDispatch(
    'users/updateprofilepic/',
    formBody,
    'multipart/form-data',
    jwt,
    imgUploadBegin,
    imgUploadFailure,
    imgUploadSuccess,
  );
}

function handleProfileData(data) {
  return (dispatch) => {
    if (data.status === 'error') {
      dispatch(deleteJWTInit());
      dispatch(loadProfileFailure(data.message));
    } else {
      dispatch(loadProfileSuccess(data));
    }
  };
}

export function loadProfileInit(jwt) {
  return serverApi.postDispatch('users/getuser/', '', 'application/x-www-form-urlencoded', jwt, loadProfileBegin, loadProfileFailure, handleProfileData);
}

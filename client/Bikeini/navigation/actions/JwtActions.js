import { AsyncStorage } from 'react-native';
import {
  LOAD_JWT_BEGIN,
  LOAD_JWT_SUCCESS,
  LOAD_JWT_FAILURE,
  DELETE_JWT_BEGIN,
  DELETE_JWT_SUCCESS,
  DELETE_JWT_FAILURE,
  STORE_JWT_BEGIN,
  STORE_JWT_FAILURE,
  STORE_JWT_SUCCESS,
} from './types';

export const deleteJWTBegin = () => (
  {
    type: DELETE_JWT_BEGIN,
  }
);

export const deleteJWTFailure = error => (
  {
    type: DELETE_JWT_FAILURE,
    payload: error,
  }
);

export const deleteJWTSuccess = () => (
  {
    type: DELETE_JWT_SUCCESS,
  }
);

export const loadJWTBegin = () => (
  {
    type: LOAD_JWT_BEGIN,
  }
);

export const loadJWTFailure = error => (
  {
    type: LOAD_JWT_FAILURE,
    payload: error,
  }
);

export const loadJWTSuccess = jwt => (
  {
    type: LOAD_JWT_SUCCESS,
    payload: jwt,
  }
);

export const storeJWTBegin = jwt => (
  {
    type: STORE_JWT_BEGIN,
    payload: jwt,
  }
);

export const storeJWTFailure = error => (
  {
    type: STORE_JWT_FAILURE,
    payload: error,
  }
);

export const storeJWTSuccess = () => (
  {
    type: STORE_JWT_SUCCESS,
  }
);

export function storeJWTInit(jwt) {
  return (dispatch) => {
    dispatch(storeJWTBegin(jwt));
    return AsyncStorage.setItem('id_token', jwt)
      .then(() => {
        dispatch(storeJWTSuccess());
      }).catch(error => storeJWTFailure(error));
  };
}

export function loadJWTInit() {
  return (dispatch) => {
    dispatch(loadJWTBegin());
    return AsyncStorage.getItem('id_token')
      .then((jwt) => {
        if (jwt !== null) {
          dispatch(loadJWTSuccess(jwt));
        } else {
          dispatch(loadJWTSuccess(null));
        }
      }).catch(error => loadJWTFailure(error));
  };
}

export function deleteJWTInit() {
  return (dispatch) => {
    dispatch(deleteJWTBegin());
    return AsyncStorage.removeItem('id_token')
      .then(() => {
        dispatch(deleteJWTSuccess());
      }).catch(error => deleteJWTFailure(error));
  };
}

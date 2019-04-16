import {
  LOGIN,
  LOGOUT,
  UNLOAD_PROFILE,
  SET_IS_LOGGED_IN,
  LOAD_PROFILE_SUCCESS,
  LOAD_JWT_BEGIN,
  LOAD_JWT_FAILURE,
  LOAD_JWT_SUCCESS,
  DELETE_JWT_BEGIN,
  DELETE_JWT_FAILURE,
  DELETE_JWT_SUCCESS,
  LOGIN_BEGIN,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  STORE_JWT_BEGIN,
  STORE_JWT_FAILURE,
  STORE_JWT_SUCCESS,
  DELETE_USER_BEGIN,
  DELETE_USER_FAILURE,
  DELETE_USER_SUCCESS,
  DELETE_USER_RESET,
} from '../actions/types';

const AUTH_STATE = {
  isLoggedIn: false,
  username: '',
  password: '',
  jwt: [],
  loadingJwt: false,
  deletingJwt: false,
  authorizing: false,
  storingJwt: false,
  error: '',
  deleteUser: {
    deletingUser: false,
    userdeleted: false,
    error: '',
  },
};

const authReducer = (state = AUTH_STATE, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, jwt: [action.payload] };
    case LOGOUT:
      return { ...state, jwt: [], isLoggedIn: false };
    case SET_IS_LOGGED_IN:
      return { ...state, isLoggedIn: action.payload };
    case UNLOAD_PROFILE:
      return { ...state, isLoggedIn: false };
    case LOAD_PROFILE_SUCCESS:
      return {
        ...state, error: '',
      };
    case DELETE_JWT_BEGIN:
      return { ...state, deletingJwt: true };
    case DELETE_JWT_FAILURE:
      return { ...state, deletingJwt: false, error: action.payload };
    case DELETE_JWT_SUCCESS:
      return {
        ...state, deletingJwt: false, error: '', jwt: [],
      };
    case LOAD_JWT_BEGIN:
      return { ...state, loadingJwt: true };
    case LOAD_JWT_FAILURE:
      return { ...state, loadingJwt: false, error: action.payload };
    case LOAD_JWT_SUCCESS:
      return {
        ...state, loadingJwt: false, error: '', jwt: [action.payload],
      };
    case LOGIN_BEGIN:
      return { ...state, authorizing: true };
    case LOGIN_FAILURE:
      return { ...state, authorizing: false, error: action.payload };
    case LOGIN_SUCCESS:
      return {
        ...state, authorizing: false, error: '',
      };
    case STORE_JWT_BEGIN:
      return { ...state, storingJwt: true, jwt: [action.payload] };
    case STORE_JWT_FAILURE:
      return { ...state, storingJwt: false, error: action.payload };
    case STORE_JWT_SUCCESS:
      return {
        ...state, storingJwt: false, error: '',
      };
    case DELETE_USER_BEGIN:
      return {
        ...state,
        deleteUser: {
          ...state.deleteUser, deletingUser: true, userdeleted: false, error: '',
        },
      };
    case DELETE_USER_FAILURE:
      return {
        ...state,
        deleteUser: {
          ...state.deleteUser, deletingUser: false, userdeleted: false, error: action.payload,
        },
      };
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        deleteUser: {
          ...state.deleteUser, deletingUser: false, userdeleted: true, error: '',
        },
      };
    case DELETE_USER_RESET:
      return {
        ...state,
        deleteUser: {
          ...state.deleteUser, deletingUser: false, userdeleted: false, error: '',
        },
      };
    default:
      return state;
  }
};

export default authReducer;

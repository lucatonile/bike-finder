import {
  SET_ACTIVE_ROUTE,
  SET_HOLD_NOTIFICATION,
} from '../actions/types';

const ROUTE_INITIAL_STATE = {
  activeRoute: '',
  holdNotification: false,
};

const routeReducer = (state = ROUTE_INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_ACTIVE_ROUTE:
      return { ...state, activeRoute: action.payload, holdNotification: false };
    case SET_HOLD_NOTIFICATION:
      return { ...state, holdNotification: true };
    default:
      return state;
  }
};

export default routeReducer;

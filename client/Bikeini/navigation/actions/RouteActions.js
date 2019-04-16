import {
  SET_ACTIVE_ROUTE,
  SET_HOLD_NOTIFICATION,
} from './types';

export const setActiveRoute = route => (
  {
    type: SET_ACTIVE_ROUTE,
    payload: route,
  }
);

export const setHoldNotification = () => (
  {
    type: SET_HOLD_NOTIFICATION,
  }
);

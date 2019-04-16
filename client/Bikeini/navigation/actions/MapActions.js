import {
  SET_COORDS, SET_SHOW_MARKER, SET_MARKER, SET_USER_MARKER, RESET_MAP_STATE,
} from './types';

export const setMapLocation = coords => (
  {
    type: SET_COORDS,
    payload: coords,
  }
);

export const setShowMarker = bool => (
  {
    type: SET_SHOW_MARKER,
    payload: bool,
  }
);

export const setMarker = coords => (
  {
    type: SET_MARKER,
    payload: coords,
  }
);

export const setUserMarker = coords => (
  {
    type: SET_USER_MARKER,
    payload: coords,
  }
);

export const cleanMapState = () => (
  {
    type: RESET_MAP_STATE,
  }
);

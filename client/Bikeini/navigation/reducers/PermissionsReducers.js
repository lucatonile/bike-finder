// Might be uncessary to store theese states, will keep for now.
import { CAMERA, ROLL } from '../actions/types';

const PERMISSION_STATE = {
  hasCameraPermission: null,
  hasCameraRollPermission: null,
};

function setCameraPermission(state, payload) {
  const { hasCameraRollPermission } = state;
  let { hasCameraPermission } = state;
  hasCameraPermission = payload;
  const newState = { hasCameraPermission, hasCameraRollPermission };
  return newState;
}

function setCameraRollPermission(state, payload) {
  const { hasCameraPermission } = state;
  let { hasCameraRollPermission } = state;
  hasCameraRollPermission = payload;
  const newState = { hasCameraPermission, hasCameraRollPermission };

  return newState;
}

const PermissionsReducer = (state = PERMISSION_STATE, action) => {
  switch (action.type) {
    case CAMERA:
      return setCameraPermission(state, action.payload);
    case ROLL:
      return setCameraRollPermission(state, action.payload);
    default:
      return state;
  }
};

export default PermissionsReducer;

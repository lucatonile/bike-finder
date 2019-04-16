// Might be uncessary to store theese states, will keep for now.
import { CAMERA, ROLL } from './types';

export const setCameraPermission = status => (
  {
    type: CAMERA,
    payload: status,
  }
);

export const setCameraRollPermission = status => (
  {
    type: ROLL,
    payload: status,
  }
);

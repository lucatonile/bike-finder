import { CHANGEITEMS, RESETITEMS, CHANGETEXT } from './types';

export const changeItems = items => (
  {
    type: CHANGEITEMS,
    payload: items,
  }
);

export const resetItems = () => (
  {
    type: RESETITEMS,
  }
);

export const changeText = items => (
  {
    type: CHANGETEXT,
    payload: items,
  }
);

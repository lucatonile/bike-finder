import { combineReducers } from 'redux';
import authReducer from './AuthReducers';
import signUpReducer from './SignUpReducers';
import filterReducer from './FilterReducers';
import addBikeReducers from './AddBikeReducers';
import PermissionsReducer from './PermissionsReducers';
import profileReducer from './ProfileReducers';
import resetPasswordReducer from './ResetPasswordReducers';
import mapReducer from './MapReducers';
import routeReducer from './RouteReducers';

const allReducers = combineReducers({
  authState: authReducer,
  signUpState: signUpReducer,
  filterState: filterReducer,
  addBikeState: addBikeReducers,
  permissionState: PermissionsReducer,
  profileState: profileReducer,
  resetState: resetPasswordReducer,
  mapState: mapReducer,
  routeState: routeReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'RESET_ALL') {
    state = undefined;
  }
  return allReducers(state, action);
};

export default rootReducer;

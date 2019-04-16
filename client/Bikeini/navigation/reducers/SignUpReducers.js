const SIGN_UP_STATE = {
  isLoggedIn: false,
  newUsername: '',
  newPassword: '',
};

function doSomething(state) {
  return state;
}

const signUpReducer = (state = SIGN_UP_STATE, action) => {
  switch (action.type) {
    case 'ANYTHING':
      return doSomething(state);
    default:
      return state;
  }
};

export default signUpReducer;

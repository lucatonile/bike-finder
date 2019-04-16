// For running with emulator on same computer:
//      http://10.0.2.2:3000/
// Use 'localhost' when using external device on Home-Network
// and local IP-address when on Uni-network! :)
import { Alert } from 'react-native';

// Handle HTTP errors since fetch won't.
function handleErrors(response) {
  // console.log(response);
  if (!response.ok) {
    throw Error(response.status);
  }
  return response;
}

const serverApi = {

  getDispatch(urlEnd, jwt, dispatchBegin, dispatchFailure, dispatchSuccess) {
    return (dispatch) => {
      dispatch(dispatchBegin());
      return fetch(`http://bikeify.student.it.uu.se/${urlEnd}`, {
	    method: 'GET',
        headers: {
          'x-access-token': jwt,
        },
      })
        .then(handleErrors)
        .then(response => response.json())
        .then((json) => {
          dispatch(dispatchSuccess(json));
          return true;
        })
        .catch((error) => {
          console.log('GET:', error);
          dispatch(dispatchFailure(String(error)));
          return false;
        });
    };
  },

  postDispatch(urlEnd, body, contentType, jwt, dispatchBegin, dispatchFailure, dispatchSuccess) {
    return (dispatch) => {
      dispatch(dispatchBegin());
      return fetch(`http://bikeify.student.it.uu.se/${urlEnd}`, {
        method: 'POST',
        body,
        headers: {
          'Content-Type': contentType,
          'x-access-token': jwt,
        },
      })
        .then(handleErrors)
        .then(response => response.json())
        .then((json) => {
          if (json.error) {
            if (!(typeof json.error === 'boolean')) {
              dispatch(dispatchFailure(String(json.error)));
            } else {
              dispatch(dispatchFailure(String(json.message)));
              Alert.alert(json.message);
            }
            return false;
          } if (json.status === 'error') {
            dispatch(dispatchFailure(String(json.message)));
            Alert.alert(json.message);
            return false;
          }
          dispatch(dispatchSuccess(json));
          return json;
        })
        .catch((error) => {
          console.log('POST:', error);
          dispatch(dispatchFailure(String(error)));
          return false;
        });
    };
  },

  post(_urlEnd, _body, _contentType, _jwt) {
    return fetch(`http://bikeify.student.it.uu.se/${_urlEnd}`, {
	  method: 'POST',
	  body: _body,
      headers: {
        'Content-Type': _contentType,
        'x-access-token': _jwt,
      },
    })
      .then(handleErrors)
      .then(response => response.json())
      .catch((error) => {
        console.log('POST:', error);
      });
  },

  get(_urlEnd, _jwt) {
    return fetch(`http://bikeify.student.it.uu.se/${_urlEnd}`, {
      method: 'GET',
      headers: {
        'x-access-token': _jwt,
      },
    })
      .then(handleErrors)
      .then(response => response.json())
      .catch((error) => {
        console.log('GET:', error);
      });
  },
};

export default serverApi;

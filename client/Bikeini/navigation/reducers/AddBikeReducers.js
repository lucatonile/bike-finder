import {
  NEW_IMG_URI,
  UPLOAD_IMG_BEGIN,
  UPLOAD_IMG_FAILURE,
  UPLOAD_IMG_SUCCESS,
  UPLOAD_BIKE_BEGIN,
  UPLOAD_BIKE_FAILURE,
  UPLOAD_BIKE_SUCCESS,
  SET_BIKE_POSTED,
} from '../actions/types';
// !addBikeState.uriSet && !addBikeState.uploadingImg && !addBikeState.imgUploaded

const ADD_BIKE_STATE = {
  imgToUploadUri: '',
  uriSet: false,
  uploadingImg: false,
  imgUploaded: false,
  error: '',
  uploadDisabled: true,
  uploadingBike: false,
  bikePosted: false,
};

const addBikeReducers = (state = ADD_BIKE_STATE, action) => {
  switch (action.type) {
    case NEW_IMG_URI:
      return {
        ...state,
        imgToUploadUri: action.payload,
        uriSet: true,
        uploadDisabled: false,
        imgUploaded: false,
      };
    case UPLOAD_IMG_BEGIN:
      return {
        ...state, uploadingImg: true, uploadDisabled: true,
      };
    case UPLOAD_IMG_FAILURE:
      return {
        ...state, uploadingImg: false, error: action.payload, uploadDisabled: false,
      };
    case UPLOAD_IMG_SUCCESS:
      return {
        ...state, uploadingImg: false, imgUploaded: true, uploadDisabled: false,
      };
    case UPLOAD_BIKE_BEGIN:
      return {
        ...state, uploadingBike: true,
      };
    case UPLOAD_BIKE_FAILURE:
      return {
        ...state, uploadingBike: false,
      };
    case UPLOAD_BIKE_SUCCESS:
      return {
        ...state,
        uploadingBike: false,
        imgToUploadUri: '',
        uriSet: false,
        uploadDisabled: true,
        bikePosted: true,
      };
    case SET_BIKE_POSTED:
      return { ...state, bikePosted: action.payload };
    default:
      return state;
  }
};

export default addBikeReducers;

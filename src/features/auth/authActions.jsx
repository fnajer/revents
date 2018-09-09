import { LOGIN_USER, SIGN_OUT_USER } from './authConstants';
import { closeModal } from '../modal/modalActions';

export const loginUser = (creds) => {
  return async dispatch => {
    dispatch({
      type: LOGIN_USER,
      payload: {
        creds,
      },
    });
    dispatch(closeModal());
  }
}

export const logoutUser = () => {
  return {
    type: SIGN_OUT_USER,
  };
};
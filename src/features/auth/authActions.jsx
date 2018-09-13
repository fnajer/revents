import { SIGN_OUT_USER } from './authConstants';
import { closeModal } from '../modal/modalActions';

export const loginUser = (creds) => {
  return async (dispatch, getState, {getFirebase}) => {
    const firebase = getFirebase();
    try {
      await firebase.auth().signInWithEmailAndPassword(creds.email, creds.password);
      dispatch(closeModal());
    } catch (error) {
      console.log(error);
    }
  }
}

export const logoutUser = () => {
  return {
    type: SIGN_OUT_USER,
  };
};
import { LOGIN_USER, SIGN_OUT_USER } from './authConstants';

export const loginUser = (creds) => {
  return {
    type: LOGIN_USER,
    payload: {
      creds,
    },
  };
}

export const logoutUser = () => {
  return {
    type: SIGN_OUT_USER,
  };
};
import { SubmissionError } from 'redux-form';
import { closeModal } from '../modal/modalActions';

export const loginUser = (creds) => {
  return async (dispatch, getState, {getFirebase}) => {
    const firebase = getFirebase();
    try {
      await firebase.auth().signInWithEmailAndPassword(creds.email, creds.password);
      dispatch(closeModal());
    } catch (error) {
      throw new SubmissionError({
        _error: error.message,
      });
    }
  }
}

export const registerUser = user => async (dispatch, getState, { getFirebase, getFirestore }) => {
  const firebase = getFirebase();
  const firestore = getFirestore();
  try {
   
    // create new user in auth firebase
    let createdUser = await firebase.auth().createUserWithEmailAndPassword(user.email, user.password);
    // update user profile
    await createdUser.updateProfile({
      displayName: user.displayName,
    });
    // create user profile in firestore
    let newUser = {
      displayName: user.displayName,
      createdAt: firestore.FieldValue.serverTimestamp(), 
    };
    await firestore.set(`users/${createdUser.uid}`, {...newUser});
    dispatch(closeModal());
  } catch (error) {
    throw new SubmissionError({
      _error: error.message,
    });
  }
};

export const socialLogin = selectedProvider => async (dispatch, getState, { getFirebase, getFirestore }) => {
  const firebase = getFirebase();
  const firestore = getFirestore();
  try {
    dispatch(closeModal());
    let user = await firebase.login({
      provider: selectedProvider,
      type: 'popup',
    });
    if (user.additionalUserInfo.isNewUser) {
      firestore.set(`users/${user.user.uid}`, {
        displayName: user.profile.displayName,
        createdAt: firestore.FieldValue.serverTimestamp(),
        photoUrl: user.profile.avatarUrl,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

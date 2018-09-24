import moment from "moment";
import { toastr } from "react-redux-toastr";

export const updateProfile = user => async (
  dispatch,
  getState,
  { getFirebase }
) => {
  const firebase = getFirebase();
  const {isEmpty, isLoaded, ...updatedUser} = user;

  // that date will be proper update, and wont try update, if dates equally
  const secondsInFirebase = getState().firebase.profile.dateOfBirth && getState().firebase.profile.dateOfBirth.seconds;
  const secondsOnClient = updatedUser.dateOfBirth && updatedUser.dateOfBirth.seconds;
  if (secondsOnClient !== secondsInFirebase) {
    updatedUser.dateOfBirth = moment(updatedUser.dateOfBirth).toDate();
  }

  try {
    await firebase.updateProfile(updatedUser);
    toastr.success("Success", "Profile updated");
  } catch (error) {
    console.log(error);
  }
};

export const updateProfileImage = (file, filename) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();
  const firestore = getFirestore();
  const user = firebase.auth().currentUser; //not async await
  const path = `${user.uid}/user_images`;
  const options = {
    name: filename,
  };

  try {
    // Upload the file to firebase storage
    let uploadedFile = await firebase.uploadFile(path, file, null, options);
    // get url of image
    let downloadURL = await uploadedFile.uploadTaskSnapshot.downloadURL;
    // get userdoc
    let userDoc = await firestore.get(`users/${user.uid}`);
    // check if user has photo, if not update profile with new image
    if (!userDoc.data().photoURL) {
      await firebase.updateProfile({
        photoURL: downloadURL,
      });
      await firebase.updateProfile({
        photoURL: downloadURL,
      });
    }
    // add the new photo to photos collection
    return firestore.add({
      collection: 'users',
      doc: user.uid,
      subcollections: [{collection: 'photos'}],
    }, {
      name: filename,
      url: downloadURL,
    });
  } catch (error) {
    console.log(error);
    throw new Error('Problem uploading photo');
  }
};

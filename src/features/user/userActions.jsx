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

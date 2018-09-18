import moment from "moment";
import toastr from "react-redux-toastr";

export const updateProfile = user => async (
  dispatchEvent,
  getState,
  { getFirebase }
) => {
  const firebase = getFirebase();

  if (user.dateOfBirth) {
    user.dateOfBirth = moment(user.dateOfBirth).getDate();
  }

  try {
    await firebase.updateProfile(user);
    toastr.success("Success", "Profile updated");
  } catch (error) {
    console.log(error);
  }
};

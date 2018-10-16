import moment from "moment";
import cuid from 'cuid';
import { toastr } from "react-redux-toastr";
import { asyncActionStart, asyncActionFinish, asyncActionError } from '../async/asyncActions';
import { FETCH_EVENTS } from "../event/eventConstants";
import firebase from "../../app/config/firebase";

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

export const updateProfileImage = (file, fileName) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  dispatch(asyncActionStart());

  const firebase = getFirebase();
  const firestore = getFirestore();

  const imageName = cuid();
  const user = firebase.auth().currentUser; //not async await
  const path = `${user.uid}/user_images`;
  const options = {
    name: imageName,
  };

  try {
    // Upload the file to firebase storage
    let uploadedFile = await firebase.uploadFile(path, file, null, options);
    // get url of image
    let downloadURL = await uploadedFile.uploadTaskSnapshot.downloadURL;
    // get userdoc
    let userDoc = await firestore.get(`users/${user.uid}`);
    console.log(userDoc.data().photoURL);
    // check if user has photo, if not update profile with new image
    if (!userDoc.data().photoURL) {
      await firebase.updateProfile({
        photoURL: downloadURL,
      });
      await user.updateProfile({
        photoURL: downloadURL,
      });
    }
    // add the new photo to photos collection
    await firestore.add({
      collection: 'users',
      doc: user.uid,
      subcollections: [{collection: 'photos'}]
    }, {
      name: imageName,
      url: downloadURL 
    });

    dispatch(asyncActionFinish());
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
    throw new Error('Problem uploading photo');
  }
};

export const deletePhoto = (photo) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();
  const firestore = getFirestore();
  const user = firebase.auth().currentUser;

  try {
    await firebase.deleteFile(`${user.uid}/user_images/${photo.name}`);
    await firestore.delete({
      collection: 'users',
      doc: user.uid,
      subcollections: [{collection: 'photos', doc: photo.id}],
    })
  } catch (error) {
    console.log(error);
    throw new Error('Problem with deleting file');
  }
};

export const setMainPhoto = photo => async (
  dispatch,
  getState,
  { getFirebase },
) => {
  const firebase = getFirebase();
  try {
    return await firebase.updateProfile({
      photoURL: photo.url,
    });
  } catch (error) {
    console.log(error);
    throw new Error('Problem with setting main photo');
  }
}


export const goingToEvent = event =>
  async (dispatch, getState, {getFirestore}) => {
    const firestore = getFirestore();
    const user = firestore.auth().currentUser;
    const photoURL = getState().firebase.profile.photoURL;
    const attendee = {
      displayName: user.displayName,
      joinDate: Date.now(),
      photoURL: photoURL || '/assets/user.png',
      going: true,
      host: false,
    };
    try {
      await firestore.update(`events/${event.id}`, {
        [`attendees.${user.uid}`]: attendee,
      });
      await firestore.set(`event_attendee/${event.id}_${user.uid}`, {
        eventId: event.id,
        userUid: user.uid,
        eventDate: event.date,
        host: false,
      });
      toastr.success('Success', 'You have signed up to the event');
    } catch (error) {
      console.log(error);
      toastr.error('Oops', 'Connect to event failed');
    }
  }

export const cancelGoingToEvent = (event) =>
  async (dispatch, getState, {getFirestore}) => {
    const firestore = getFirestore();
    const user = firestore.auth().currentUser;
    try {
      await firestore.update(`events/${event.id}`, {
        [`attendees.${user.uid}`]: firestore.FieldValue.delete(),
      });
      await firestore.delete(`event_attendee/${event.id}_${user.uid}`);
      toastr.success('Oops', 'You no longer go to the event');
    } catch (error) {
      console.log(error);
      toastr.error('Oops', 'Something went wrong');
    }
  }

export const getUserEvents = (userUid, activeTab) => 
  async (dispatch, getState) => {
    dispatch(asyncActionStart());
    const firestore = firebase.firestore();
    const today = new Date(Date.now());
    let eventsRef = firestore.collection('event_attendee');
    let query;
    console.log(activeTab);
    
    switch (activeTab) {
      case 1: // past events
        query = eventsRef
          .where('userUid', '==', userUid)
          .where('eventDate', '<=', today)
          .orderBy('eventDate', 'desc');
        break;
      case 2: // future events
        query = eventsRef
          .where('userUid', '==', userUid)
          .where('eventDate', '>=', today)
          .orderBy('eventDate');
        break;
      case 3: // hosted events
        query = eventsRef
          .where('userUid', '==', userUid)
          .where('host', '==', true)
          .orderBy('eventDate', 'desc');
        break;
      default:
        query = eventsRef
          .where('userUid', '==', userUid)
          .orderBy('eventDate', 'desc');
        break;
    }

    try {
      let querySnap = await query.get();
      let events = [];

      for (let i = 0; i < querySnap.docs.length; i++) {
        let event = await firestore.collection('events').doc(querySnap.docs[i].data().eventId).get();
        events.push({...event.data(), id: event.id});
      }
      
      dispatch({type: FETCH_EVENTS, payload: { events }});
      dispatch(asyncActionFinish());
    } catch (error) {
      console.log(error);
      dispatch(asyncActionError());
    }
  }

  export const followUser = (userId) =>
    async (dispatch, getState, { getFirebase, getFirestore }) => {
      //const firestore = firebase.firestore();
      const firebase = getFirebase();
      const firestore = getFirestore();
      const user = firebase.auth().currentUser;
      console.log(user);
      let userCard = {
        displayName: user.displayName,
        photoURL: user.photoURL,
        city: user.city || 'unknow city',
      };

      await firestore.add({
        collection: 'users',
        doc: userId,
        subcollections: [{collection: 'followers'}]
      }, {
        [user.uid]: userCard, 
      });
    }
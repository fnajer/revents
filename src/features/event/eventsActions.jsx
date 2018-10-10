import { toastr } from 'react-redux-toastr';
import moment from "moment";

import { FETCH_EVENTS } from './eventConstants';
import { asyncActionStart, asyncActionFinish, asyncActionError } from '../async/asyncActions';

import firebase from "../../app/config/firebase";  

import { createNewEvent } from "../../app/common/util/helpers";

export const createEvent = (event) => {
  return async (dispatch, getState, {getFirestore}) => {
    const firestore = getFirestore();
    const user = firestore.auth().currentUser;
    const photoURL = getState().firebase.profile.photoURL;
    let newEvent = createNewEvent(user, photoURL, event);
    try {
      const createdEvent = await firestore.add('events', newEvent);
      await firestore.set(`event_attendee/${createdEvent.id}_${user.uid}`, {
        eventId: createdEvent.id,
        userId: user.uid,
        eventDate: event.date,
        host: true,
      });
      toastr.success('Success!', 'Event has been created');
    } catch (error) {
      toastr.error('Oops', 'Something went wrong');
    }
  };
};

export const updateEvent = (event) => {
  return async (dispatch, getState, {getFirestore}) => {
    const firestore = getFirestore();
    if (event.date !== getState().firestore.ordered.events[0].date) {
      event.date = moment(event.date).toDate();
    }
    try {
      await firestore.update(`events/${event.id}`, event);
      toastr.success('Success!', 'Event has been updated');
    } catch (error) {
      toastr.error('Oops', 'Something went wrong');
    }
  };
};

export const cancelToggle = (cancelled, eventId) =>
  async (dispatch, getState, {getFirestore}) => {
    const firestore = getFirestore();
    const message = cancelled
      ? 'Are you sure you want to cancel the event?'
      : 'This will be reactivate the event - are you sure?';
    try {
      toastr.confirm(message, {
        onOk: () => 
          firestore.update(`events/${eventId}`, {
            cancelled: cancelled,
          }),
      })
    } catch (error) {
      console.log(error);
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

export const getEventsForDashboard = (lastEvent) =>
  async (dispatch, getState) => {
    const today = new Date(Date.now());
    const firestore = firebase.firestore();
    const eventsRef = firestore.collection('events');
    try {
      dispatch(asyncActionStart());
      let startAfter = lastEvent && await firestore.collection('events').doc(lastEvent.id).get();
      
      let query;

      lastEvent 
      ? query = eventsRef.where('date', '>=', today).orderBy('date').startAfter(startAfter).limit(2)
      : query = eventsRef.where('date', '>=', today).orderBy('date').limit(2);

      let querySnap = await query.get();
      let events = [];

      if (querySnap.docs.length === 0) {
        dispatch(asyncActionFinish());
        return querySnap;
      }

      for (let i = 0; i < querySnap.docs.length; i++) {
        let event = {...querySnap.docs[i].data(), id: querySnap.docs[i].id}
        events.push(event);
      }
      dispatch({ type: FETCH_EVENTS, payload: {events}});
      dispatch(asyncActionFinish());
      return querySnap;
      
    } catch (error) {
      dispatch(asyncActionError());
      console.log(error);
    }
  }
import { toastr } from 'react-redux-toastr';
import moment from "moment";

import { DELETE_EVENT, FETCH_EVENTS } from './eventConstants';
import { asyncActionStart, asyncActionFinish, asyncActionError } from '../async/asyncActions';

import { fetchSampleData } from '../../app/data/mockApi';

import { createNewEvent } from "../../app/common/util/helpers";
import { withFirestore } from 'react-redux-firebase';


export const fetchEvents = (events) => {
  return {
    type: FETCH_EVENTS,
    payload: events,
  };
};

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

export const deleteEvent = (eventId) => {
  return {
    type: DELETE_EVENT,
    payload: {
      eventId,
    },
  };
};

export const loadEvents = () => {
  return async dispatch => {
    try {
      dispatch(asyncActionStart());
      let events = await fetchSampleData();
      dispatch(fetchEvents(events));
      dispatch(asyncActionFinish());
    } catch (error) {
      console.log(error);
      dispatch(asyncActionError());
    }
  };
};

export const goingToEvent = event =>
  async (dispatch, getState, {getFirestore}) => {
    const firestore = getFirestore();
    const user = firestore.auth().currentUser;
    const photoURL = getState().firebase.profile.photoURL;
    const attendee = {
      displayName: user.displayName,
      joinDate: Date.now(),
      photoURL: photoURL,
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
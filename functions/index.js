const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.createActivity = functions.firestore
  .document('events/{eventId}')
  .onCreate(event => {
    let newEvent = event.data();

    console.log(newEvent);
    
    const activity = {
      type: 'newEvent',
      title: newEvent.title,
      hostedBy: newEvent.hostedBy,
      eventDate: newEvent.date,
      photoURL: newEvent.photoURL,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      hostUid: newEvent.hostUid,
      eventId: event.id,
    };

    console.log(activity);

    return admin.firestore().collection('activity')
      .add(activity)
      .then(docRef => {
        return console.log('Activity created with ID:', docRef.id);
      })
      .catch(error => {
        return console.log('Error adding activity', error);
      })
  });
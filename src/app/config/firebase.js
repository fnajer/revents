import firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCi4yTikFXCW_HbYvau9zZIYU7kAihoK3Q",
  authDomain: "revents-5b101.firebaseapp.com",
  databaseURL: "https://revents-5b101.firebaseio.com",
  projectId: "revents-5b101",
  storageBucket: "revents-5b101.appspot.com",
  messagingSenderId: "230774625113"
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;

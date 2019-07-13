import firebase from 'firebase/app';
import 'firebase/firestore';

const config = {
  apiKey: "AIzaSyArW-UbSMzLfQOlbhPYyZJ3LNkiHf7AU7o",
  authDomain: "weeklyorder0.firebaseapp.com",
  databaseURL: "https://weeklyorder0.firebaseio.com",
  projectId: "weeklyorder0",
  storageBucket: "weeklyorder0.appspot.com",
  messagingSenderId: "511940527299",
  appId: "1:511940527299:web:408ebc2d954147bb"
};

// eslint-disable-next-line import/prefer-default-export
export const FirebaseApp = firebase.initializeApp(config);

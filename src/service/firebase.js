import firebase from 'firebase/app';
import 'firebase/firestore';

let config = {
  apiKey: 'AIzaSyAU9GiZ6sPSkcodEuMCK-1cwRj8sSbGM68',
  authDomain: 'yterminal-b0906.firebaseapp.com',
  databaseURL: 'https://yterminal-b0906.firebaseio.com',
  projectId: 'yterminal-b0906',
  storageBucket: 'yterminal-b0906.appspot.com',
  messagingSenderId: '745735371809'
};

export const FirebaseApp = firebase.initializeApp(config);

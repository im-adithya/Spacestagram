/* eslint-disable no-undef */
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: 'space-stagram.firebaseapp.com',
  projectId: 'space-stagram',
  storageBucket: 'space-stagram.appspot.com',
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

function initFirebase() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
}

initFirebase();
firebase.analytics();

export default firebase;

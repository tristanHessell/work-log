import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

window.firebase = firebase;

firebase.initializeApp({
  apiKey: process.env.GOOGLE_FIRESTORE_API_KEY,
  authDomain: "totemic-polygon-291511.firebaseapp.com",
  databaseURL: "https://totemic-polygon-291511.firebaseio.com",
  projectId: "totemic-polygon-291511",
  storageBucket: "totemic-polygon-291511.appspot.com",
  messagingSenderId: "987927113868",
  appId: "1:987927113868:web:64e80b9823e9873c938ba9",
});

const db = firebase.firestore();
const auth = firebase.auth();

export { firebase, db, auth };


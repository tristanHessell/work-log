import React from "react";
import firebase from "firebase";
import * as firebaseui from "firebaseui";

const uiConfig = {
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
  ],
};

const ui = new firebaseui.auth.AuthUI(firebase.auth());
// ui.start();

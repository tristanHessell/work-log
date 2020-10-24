import React from "react";
import { Redirect } from "react-router-dom";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { isAuthenticated } from "./utils";
import { firebase, auth } from "./firebase";

const uiConfig = {
  signInFlow: "popup",
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
  ],
  signInSuccessUrl: "/",
};

export const SignIn: React.FC = () => {
  if (isAuthenticated()) {
    return <Redirect to="/" />;
  }

  return <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />;
};

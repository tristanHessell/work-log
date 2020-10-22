import React, { useState, useEffect } from "react";
import {Route, BrowserRouter, Switch} from 'react-router-dom';
import {ProtectedRoute} from './ProtectedRoute';
import {Home} from './Home';
import {Landing} from './Landing';
import { firebase, auth } from './firebase';
import "./App.css";

function App(): JSX.Element | null {
  // TODO propogate the logged in user state through the app better
  const [user, setUser] = useState<firebase.User | null>(auth.currentUser);
  const [finishedChecking, setFinishedChecking] = useState(false);
  useEffect(() => {
    const unregisterListener = auth.onAuthStateChanged((newUser) => {
      setFinishedChecking(true);
      setUser(newUser);
    });

    return () : void => {
      unregisterListener();
    };
  }, []);

  // This is here as otherwise the app flashes to the sign in screen.
  // This gives the firebase code time to collect any stored credentials
  // TODO deal with this problem better
  if (!finishedChecking) {
    return null;
  }

  return <BrowserRouter>
    <Switch>
      <Route path="/signin" component={Landing}/>
      <ProtectedRoute component={Home}/>
    </Switch>
  </BrowserRouter>
}

export default App;

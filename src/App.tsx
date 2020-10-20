import React from "react";
import {Route, BrowserRouter, Switch} from 'react-router-dom';
import {ProtectedRoute} from './ProtectedRoute';
import {Home} from './Home';
import {Landing} from './Landing';
import "./App.css";

function App(): JSX.Element {
  return <BrowserRouter>
    <Switch>
      <Route path="/signin" component={Landing}/>
      <ProtectedRoute component={Home}/>
    </Switch>
  </BrowserRouter>
}

export default App;

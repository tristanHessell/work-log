import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { Home } from "./Home";
import { Landing } from "./Landing";
import { AuthHandler } from "./AuthHandler";
import "./App.css";

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <AuthHandler>
        <Switch>
          <Route path="/signin" component={Landing} />
          <ProtectedRoute component={Home} />
        </Switch>
      </AuthHandler>
    </BrowserRouter>
  );
}

export default App;

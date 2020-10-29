import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { Home } from "./Home";
import { Landing } from "./Landing";
import { List } from "./List";
import { AuthHandler } from "./AuthHandler";
import "./App.scss";

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <AuthHandler>
        <Switch>
          <Route path="/signin" component={Landing} />
          <ProtectedRoute path="/list" component={List} />
          <ProtectedRoute component={Home} />
        </Switch>
      </AuthHandler>
    </BrowserRouter>
  );
}

export default App;

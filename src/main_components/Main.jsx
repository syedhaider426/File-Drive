import Login from "../components/Login";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ForgotPassword from "../components/ForgotPassword";
import Home from "../components/Home";

const Main = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/forgot-password">
            <ForgotPassword />
          </Route>
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/" exact>
            <Login />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default Main;

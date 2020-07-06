import Login from "../components/Login";
import React, { Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ForgotPassword from "../components/ForgotPassword";
import Home from "../components/Home";
import Actions from "../panel_left/Actions";
import Starred from "../panel_middle/Starred";
import Trash from "../panel_middle/Trash";

const Main = () => {
  return (
    <Fragment>
      <Router>
        <Actions />
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
          <Route path="/favorites">
            <Starred />
          </Route>
          <Route path="/trash">
            <Trash />
          </Route>
          <Route path="/" exact>
            <Login />
          </Route>
        </Switch>
      </Router>
    </Fragment>
  );
};

export default Main;

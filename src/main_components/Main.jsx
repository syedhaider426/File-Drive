import Login from "../components/Login";
import React, { Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ForgotPassword from "../components/ForgotPassword";
import Grid from "@material-ui/core/Grid";
import Files from "../panel_middle/Files";
import SignInSide from "../components/Login";
import Dashboard from "../panel_left/Dashboard";

/***
 * If the same component is used as the child of multiple <Route>s at the
 * same point in the component tree, React will see this as the same
 * component instance and the component’s state will be preserved between
 * route changes. If this isn’t desired, a unique key prop added to each
 * route component will cause React to recreate the component
 * instance when the route changes.
 *
 */
const Main = () => {
  return (
    <Fragment>
      <Router>
        <Switch>
          <Route path="/login">
            <SignInSide />
          </Route>
          <Route path="/forgot-password">
            <ForgotPassword />
          </Route>
          <Route path="/home" key={1234}>
            <Grid container spacing={0}>
              <Files path={"Home"} />
            </Grid>
          </Route>
          <Route path="/favorites" key={2345}>
            <Grid container spacing={0}>
              <Files path={"Favorites"} />
            </Grid>
          </Route>
          <Route path="/trash" key={3456}>
            <Grid container spacing={0}>
              <Files path={"Trash"} />
            </Grid>
          </Route>
          <Route path="/dashboard">
            <Grid container spacing={0}>
              <Dashboard />
            </Grid>
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

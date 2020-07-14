import Login from "../components/Login";
import React, { Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ForgotPassword from "../components/ForgotPassword";
import Grid from "@material-ui/core/Grid";
import Files from "../panel_middle/Files";
import SignInSide from "../components/Login";
import Dashboard from "../panel_left/Dashboard";
import Register from "../components/Register";
import Confirmation from "../components/Confirmation";
import { withRouter } from "react-router-dom";
import Profile from "../components/Profile";

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
          <Route path="/drive/home">
            <Grid container spacing={0}>
              <Files menu={"Home"} />
            </Grid>
          </Route>
          <Route path="/drive/favorites">
            <Grid container spacing={0}>
              <Files menu={"Favorites"} />
            </Grid>
          </Route>
          <Route path="/drive/trash">
            <Grid container spacing={0}>
              <Files menu={"Trash"} />
            </Grid>
          </Route>
          <Route path="/drive/folders/:folder">
            <Grid container spacing={0}>
              <Files menu={"Folder"} />
            </Grid>
          </Route>
          <Route path="/dashboard">
            <Grid container spacing={0}>
              <Dashboard />
            </Grid>
          </Route>
          <Route path="/register">
            <Grid container spacing={0}>
              <Register />
            </Grid>
          </Route>
          <Route path="/confirmRegistration">
            <Grid container spacing={0}>
              <Confirmation
                message={
                  "Thank you for registering your account. Please check your email to confirm your account."
                }
              />
            </Grid>
          </Route>
          <Route path="/verification">
            <Grid container spacing={0}>
              <Confirmation
                message={
                  "Thank you for verifiying your email. You can now login to your account."
                }
              />
            </Grid>
          </Route>
          <Route path="/drive/profile">
            <Grid container spacing={0}>
              <Profile />
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

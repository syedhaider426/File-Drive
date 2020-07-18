import Login from "../components/Login";
import React, { Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ForgotPassword from "../components/ForgotPassword";
import Files from "../components/Files";
import SignInSide from "../components/Login";
import Dashboard from "../panel_left/Dashboard";
import Register from "../components/Register";
import Confirmation from "../components/Confirmation";
import Profile from "../components/Profile";
import MoveItem from "../components/MoveItem";

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
            <Files menu={"Home"} />
          </Route>
          <Route path="/drive/favorites">
            <Files menu={"Favorites"} />
          </Route>
          <Route path="/drive/trash">
            <Files menu={"Trash"} />
          </Route>
          <Route path="/drive/folders/:folder">
            <Files menu={"Folder"} />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/confirmRegistration">
            <Confirmation
              message={
                "Thank you for registering your account. Please check your email to confirm your account."
              }
            />
          </Route>
          <Route path="/verification">
            <Confirmation
              message={
                "Thank you for verifiying your email. You can now login to your account."
              }
            />
          </Route>
          <Route path="/drive/profile">
            <Profile />
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

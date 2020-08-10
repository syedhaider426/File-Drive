import Login from "../components/user-related-components/Login";
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import ForgotPassword from "../components/user-related-components/ForgotPassword";
import Files from "../components/Files";
import SignInSide from "../components/user-related-components/Login";
import Register from "../components/user-related-components/Register";
import Confirmation from "../components/user-related-components/Confirmation";
import Profile from "../components/user-related-components/Profile";
import NotFound from "../components/NotFound";

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
    <Router>
      <Switch>
        <Route path="/not-found" component={NotFound}></Route>
        <Route path="/" exact>
          <Login />
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
        <Route path="/login">
          <SignInSide />
        </Route>
        <Route path="/forgot-password">
          <ForgotPassword />
        </Route>
        <Route path="/drive/home">
          <Files menu={"Home"} isLoaded={false} />
        </Route>
        <Route path="/drive/favorites">
          <Files menu={"Favorites"} isLoaded={false} />
        </Route>
        <Route path="/drive/trash">
          <Files menu={"Trash"} isLoaded={false} />
        </Route>
        <Route path="/drive/folders/:folder">
          <Files menu={"Folder"} isLoaded={false} />
        </Route>
        <Route path="/user/profile">
          <Profile />
        </Route>
        <Redirect to="/not-found" />
      </Switch>
    </Router>
  );
};

export default Main;

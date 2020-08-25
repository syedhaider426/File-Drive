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
import Verification from "../components/user-related-components/Verification";
import ResetPassword from "../components/user-related-components/ResetPassword";
import ResendVerificationEmail from "../components/user-related-components/ResendVerificationEmail";

// Component represents all the possible URLs that can be navigated to
const Main = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/newPassword">
          <ResetPassword />
        </Route>
        <Route path="/confirmation">
          <Verification
            message={
              "Thank you for verifiying your email. You can now login to your account."
            }
          />
        </Route>
        <Route path="/password-confirmation">
          <Confirmation
            message={"Please check your email to reset your password."}
          />
        </Route>
        <Route path="/verification">
          <Confirmation
            message={
              "Thank you for registering your account. Please check your email to confirm your account."
            }
          />
        </Route>
        <Route path="/verification-resend">
          <Confirmation
            message={"Please check your email to confirm your account."}
          />
        </Route>
        <Route path="/resend">
          <ResendVerificationEmail />
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
        <Route path="/not-found" component={NotFound}></Route>
        <Redirect to="/not-found" />
      </Switch>
    </Router>
  );
};

export default Main;

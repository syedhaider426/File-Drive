import Login from "../components/Login";
import React, { Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ForgotPassword from "../components/ForgotPassword";
import Actions from "../panel_left/Actions";
import Favorites from "../panel_middle/Favorites";
import Trash from "../panel_middle/Trash";
import PrimarySearchAppBar from "../components/PrimarySearchAppBar";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Files from "../panel_middle/Files";
import SignInSide from "../components/Login";
import Dashboard from "../panel_left/Dashboard";

const useStyles = makeStyles((theme) => ({}));

const Main = () => {
  const classes = useStyles();
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
          <Route path="/home">
            <div className={classes.root}>
              <Grid container spacing={0}>
                <Files />
              </Grid>
            </div>
          </Route>
          <Route path="/favorites">
            <Grid container spacing={0}>
              <Favorites />
            </Grid>
          </Route>
          <Route path="/trash">
            <Grid container spacing={0}>
              <Trash />
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

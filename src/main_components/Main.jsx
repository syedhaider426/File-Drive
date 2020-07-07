import Login from "../components/Login";
import React, { Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ForgotPassword from "../components/ForgotPassword";
import Actions from "../panel_left/Actions";
import Starred from "../panel_middle/Starred";
import Trash from "../panel_middle/Trash";
import PrimarySearchAppBar from "../components/PrimarySearchAppBar";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Files from "../panel_middle/Files";

const useStyles = makeStyles((theme) => ({}));

const Main = () => {
  const classes = useStyles();
  return (
    <Fragment>
      <PrimarySearchAppBar />
      <Router>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/forgot-password">
            <ForgotPassword />
          </Route>
          <Route path="/home">
            <div className={classes.root}>
              <Grid container spacing={0}>
                <Actions />
                <Files />
              </Grid>
            </div>
          </Route>
          <Route path="/favorites">
            <Grid container spacing={0}>
              <Actions />
              <Starred />
            </Grid>
          </Route>
          <Route path="/trash">
            <Grid container spacing={0}>
              <Actions />
              <Trash />
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

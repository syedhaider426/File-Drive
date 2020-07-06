import React, { Fragment } from "react";
import Files from "../panel_middle/Files";
import Actions from "../panel_left/Actions";
import { Box, Grid } from "@material-ui/core";
import { Switch, Route, Link } from "react-router-dom";
import Starred from "../panel_middle/Starred";
import Trash from "../panel_middle/Trash";
const Home = () => {
  return <Files />;
};

export default Home;

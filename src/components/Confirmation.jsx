import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import postData from "../helpers/postData";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { Container, Divider } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  title: {
    margin: theme.spacing(4),
  },
  button: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

function Confirmation(props) {
  const classes = useStyles(props);
  const LoginLink = React.forwardRef((props, ref) => (
    <Link to={"/login"} {...props} ref={ref} />
  ));
  return (
    <Container component="main" maxWidth="xs" border={1}>
      <CssBaseline />
      <Box border={1}>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component="h5" variant="h6">
            {props.message}
          </Typography>
          <div className={classes.button}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              component={LoginLink}
            >
              Login
            </Button>
          </div>
        </div>
      </Box>
    </Container>
  );
}
export default withRouter(Confirmation);

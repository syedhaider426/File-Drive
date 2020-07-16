import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import postData from "../helpers/postData";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Header from "./Header";
import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 40,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
class Profile extends Component {
  state = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    errors: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    open: false,
    passwordSuccess: false,
  };

  handleCurrentPasswordChange = ({ target }) => {
    const { errors } = this.state;
    if (target.value === "")
      errors.currentPassword = "Please enter current password.";
    else delete errors.currentPassword;
    this.setState({ currentPassword: target.value, errors });
  };

  handleNewPasswordChange = ({ target }) => {
    const { errors, confirmPassword } = this.state;
    if (target.value === "") errors.newPassword = "Please enter new password.";
    else if (confirmPassword !== "" && target.value !== confirmPassword)
      errors.newPassword = "Passwords do not match.";
    else delete errors.newPassword;
    this.setState({ newPassword: target.value, errors });
  };

  handleConfirmPasswordChange = ({ target }) => {
    const { errors, newPassword } = this.state;
    if (target.value === "")
      errors.confirmPassword = "Please confirm password.";
    if (target.value !== newPassword)
      errors.confirmPassword = "Passwords do not match";
    else delete errors.confirmPassword;
    this.setState({ confirmPassword: target.value, errors });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = { ...this.state };
    const errors = {};
    if (currentPassword === "")
      errors.currentPassword = "Please enter current password.";
    if (newPassword === "") errors.newPassword = "lease enter new password.";
    if (confirmPassword === "")
      errors.confirmPassword = "Please confirm password.";

    if (Object.keys(errors).length !== 0) {
      this.setState({ errors });
    } else {
      const data = { currentPassword, newPassword, confirmPassword };
      postData("/api/user/resetPassword", data)
        .then((data) => {
          if (data.success)
            this.setState({
              confirmPassword: "",
              newPassword: "",
              currentPassword: "",
              open: true,
              passwordSuccess: true,
            });
          else {
            this.setState({
              open: true,
              passwordSuccess: false,
              confirmPassword: "",
              newPassword: "",
              currentPassword: "",
            });
          }
        })
        .catch((err) => console.log("Err"));
    }
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const {
      errors,
      open,
      passwordSuccess,
      currentPassword,
      newPassword,
      confirmPassword,
    } = { ...this.state };
    const { classes } = this.props;
    let res;
    if (passwordSuccess)
      res = {
        severity: "success",
        message: "Succesfully changed password!",
      };
    else
      res = {
        severity: "error",
        message:
          "Password entered does not match current password. Please try again!",
      };
    const successSnack = (
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={open}
        autoHideDuration={6000}
        onClose={this.handleClose}
      >
        <Alert onClose={this.handleClose} severity={res.severity}>
          {res.message}
        </Alert>
      </Snackbar>
    );

    return (
      <Fragment>
        <CssBaseline />
        <Header />
        <div className={classes.paper}>
          <form
            className={classes.form}
            noValidate
            onSubmit={this.handleSubmit}
          >
            <h1>Change Password</h1>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="currentPassword"
              label="Current Password"
              name="currentPassword"
              type="password"
              autoComplete="currentPassword"
              value={currentPassword}
              error={errors.currentPassword}
              helperText={errors.currentPassword}
              onChange={this.handleCurrentPasswordChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="new password"
              label="New Password"
              id="newPassword"
              autoComplete="newPassword"
              value={newPassword}
              error={errors.newPassword}
              helperText={errors.newPassword}
              onChange={this.handleNewPasswordChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Confirm Password"
              id="password"
              autoComplete="confirmPassword"
              value={confirmPassword}
              error={errors.confirmPassword}
              helperText={errors.confirmPassword}
              onChange={this.handleConfirmPasswordChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Submit
            </Button>
            <Box>
              <Typography variant="body2" color="textSecondary" align="center">
                {"Copyright © "}
                <Link color="inherit" to="https://g-drive-clone.com/">
                  G-Drive Clone
                </Link>{" "}
                {new Date().getFullYear()}
                {"."}
              </Typography>
            </Box>
            {successSnack}
          </form>
        </div>
      </Fragment>
    );
  }
}

export default withRouter(withStyles(styles)(Profile));

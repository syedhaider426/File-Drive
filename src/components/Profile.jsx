import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import postData from "../helpers/postData";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import PrimarySearchAppBar from "./PrimarySearchAppBar";
import Header from "./Header";

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
class Profile extends Component {
  state = {
    email: "",
    password: "",
    errors: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    confirmPassword: "",
  };

  handleEmailChange = ({ target }) => {
    const { errors } = this.state;
    if (target.value === "") errors.email = "Email is required";
    else delete errors.email;
    this.setState({ email: target.value, errors });
  };

  handlePasswordChange = ({ target }) => {
    const { errors } = this.state;
    if (target.value === "") errors.password = "Password is required";
    else delete errors.password;
    this.setState({ password: target.value, errors });
  };

  handleConfirmPasswordChange = ({ target }) => {
    const { errors, password } = this.state;
    if (target.value === "") errors.confirmPassword = "Please confirm password";
    if (target.value !== password)
      errors.confirmPassword = "Passwords do not match";
    else delete errors.confirmPassword;
    this.setState({ confirmPassword: target.value, errors });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { email, password, confirmPassword } = { ...this.state };
    const errors = {};
    if (email === "") errors.email = "Email is required.";
    if (password === "") errors.password = "Password is required.";
    if (confirmPassword === "")
      errors.confirmPassword = "Please confirm password";
    if (Object.keys(errors).length !== 0) {
      this.setState({ errors });
    } else {
      const data = { email, password, confirmPassword };
      postData("/api/user/register", data)
        .then((data) => {
          console.log("test");
          this.props.history.push("/confirmRegistration");
        })
        .catch((err) => console.log("Err"));
    }
  };

  render() {
    const { errors } = { ...this.state };
    const { classes } = this.props;
    return (
      <Fragment>
        <CssBaseline />
        <Header />
        <div className={classes.paper}>
          <Typography component="h1" variant="h4">
            Account Settings
          </Typography>
          <form
            className={classes.form}
            noValidate
            onSubmit={this.handleSubmit}
          >
            <h1>Change Email</h1>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="currentEmail"
              label="Current Email Address"
              name="currentEmail"
              autoComplete="currentEmail"
              onChange={this.handleEmailChange}
              error={errors.email}
              helperText={errors.email}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="newEmail"
              label="New Email Address"
              name="newEmail"
              autoComplete="newEmail"
              onChange={this.handleNewEmailChange}
              error={errors.newEmail}
              helperText={errors.newEmail}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="confirmEmail"
              label="Confirm Email Address"
              name="confirmEmail"
              autoComplete="confirmEmail"
              onChange={this.handleNewEmailChange}
              error={errors.confirmEmail}
              helperText={errors.confirmEmail}
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
          </form>

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
              autoComplete="currentPassword"
              onChange={this.handleCurrentPasswordChange}
              error={errors.currentPassword}
              helperText={errors.currentPassword}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="new password"
              label="New Password"
              type="password"
              id="newPassword"
              autoComplete="newPassword"
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
              type="password"
              id="password"
              autoComplete="confirmPassword"
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
          </form>
        </div>
      </Fragment>
    );
  }
}

export default withRouter(withStyles(styles)(Profile));

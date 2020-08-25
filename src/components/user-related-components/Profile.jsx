import React, { useState, Fragment } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import patchData from "../../helpers/patchData";
import Header from "../header-components/Header";

const useStyles = makeStyles((theme) => ({
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
  grow: {
    flexGrow: 1,
  },
  flex: {
    display: "flex",
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Profile() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [open, setOpen] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // User types in current password and updates the currentPassword hook
  const handleCurrentPasswordChange = ({ target }) => {
    if (target.value === "")
      errors.currentPassword = "Please enter current password.";
    else delete errors.currentPassword;
    setCurrentPassword(target.value);
    setErrors(errors);
  };

  // User types in new password and updates the newPassword hook
  const handleNewPasswordChange = ({ target }) => {
    if (target.value === "") errors.newPassword = "Please enter new password.";
    else if (confirmPassword !== "" && target.value !== confirmPassword)
      errors.newPassword = "Passwords do not match.";
    else delete errors.newPassword;
    setNewPassword(target.value);
    setErrors(errors);
  };

  /*
   * User types in the password that they entered in the new password textbox
   * and updates confirmPassword hook
   */
  const handleConfirmPasswordChange = ({ target }) => {
    if (target.value === "")
      errors.confirmPassword = "Please confirm password.";
    if (target.value !== newPassword)
      errors.confirmPassword = "Passwords do not match";
    else delete errors.confirmPassword;
    setConfirmPassword(target.value);
    setErrors(errors);
  };

  /**
   * User clicks 'Submit', submits password details, and sends it to the server.
   * If the current password matches up, then it will update the password.
   * Else, it will throw an error on the screen.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    const err = {};
    if (currentPassword === "")
      err.currentPassword = "Please enter current password.";
    if (newPassword === "") err.newPassword = "Please enter new password.";
    if (confirmPassword === "")
      err.confirmPassword = "Please confirm password.";
    if (Object.keys(err).length !== 0) {
      setErrors(err);
    } else {
      const data = { currentPassword, newPassword, confirmPassword };
      patchData("/api/users/password-reset", data)
        .then((data) => {
          if (data.success) {
            setConfirmPassword("");
            setNewPassword("");
            setCurrentPassword("");
            setOpen(true);
            setPasswordSuccess(true);
            setErrors({
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            });
          } else {
            setConfirmPassword("");
            setNewPassword("");
            setCurrentPassword("");
            setOpen(true);
            setPasswordSuccess(false);
            setErrors({
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            });
          }
        })
        .catch((err) => console.log("Err"));
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const classes = useStyles();
  let res;
  if (passwordSuccess)
    res = {
      severity: "success",
      message: "Succesfully changed password!",
      duration: 6000,
    };
  else
    res = {
      severity: "error",
      message:
        "Password entered does not match current password. Please try again!",
      duration: 12000,
    };
  const successSnack = (
    <Snackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      open={open}
      autoHideDuration={res.duration}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={res.severity}>
        {res.message}
      </Alert>
    </Snackbar>
  );
  return (
    <Fragment>
      <CssBaseline />
      <Header />
      <div className={classes.paper}>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
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
            onChange={handleCurrentPasswordChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="new password"
            label="New Password"
            id="newPassword"
            type="password"
            autoComplete="newPassword"
            value={newPassword}
            error={errors.newPassword}
            helperText={errors.newPassword}
            onChange={handleNewPasswordChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Confirm Password"
            id="password"
            type="password"
            autoComplete="confirmPassword"
            value={confirmPassword}
            error={errors.confirmPassword}
            helperText={errors.confirmPassword}
            onChange={handleConfirmPasswordChange}
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
          {successSnack}
        </form>
      </div>
    </Fragment>
  );
}

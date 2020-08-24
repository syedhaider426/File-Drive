import React, { useState, Fragment } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Header from "../header-components/Header";
import postData from "../../helpers/postData";

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

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [open, setOpen] = useState(false);

  const handleNewPasswordChange = ({ target }) => {
    if (target.value === "") errors.newPassword = "Please enter new password.";
    else if (confirmPassword !== "" && target.value !== confirmPassword)
      errors.newPassword = "Passwords do not match.";
    else delete errors.newPassword;
    setNewPassword(target.value);
    setErrors(errors);
  };

  const handleConfirmPasswordChange = ({ target }) => {
    if (target.value === "")
      errors.confirmPassword = "Please confirm password.";
    if (target.value !== newPassword)
      errors.confirmPassword = "Passwords do not match";
    else delete errors.confirmPassword;
    setConfirmPassword(target.value);
    setErrors(errors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = {};
    if (newPassword === "") err.newPassword = "Please enter new password.";
    if (confirmPassword === "")
      err.confirmPassword = "Please confirm password.";
    if (Object.keys(err).length !== 0) {
      setErrors(err);
    } else {
      const data = { newPassword, confirmPassword };
      postData("/api/users/password-email", data)
        .then((data) => {
          setConfirmPassword("");
          setNewPassword("");
          setOpen(true);
          setErrors({
            newPassword: "",
            confirmPassword: "",
          });
        })
        .catch((err) => {
          setConfirmPassword("");
          setNewPassword("");
          setOpen(true);
          setErrors({
            newPassword: "",
            confirmPassword: "",
          });
        });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const classes = useStyles();
  let res = {
    severity: "success",
    message: "Succesfully changed password!",
    duration: 6000,
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
            disabled={confirmPassword !== newPassword}
          >
            Submit
          </Button>
          {successSnack}
        </form>
      </div>
    </Fragment>
  );
}

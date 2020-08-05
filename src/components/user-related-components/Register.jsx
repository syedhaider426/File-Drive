import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import postData from "../../helpers/postData";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import makeStyles from "@material-ui/core/styles/makeStyles";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import Header from "../Header";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Register() {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  let history = useHistory();

  const handleEmailChange = ({ target }) => {
    if (target.value === "") errors.email = "Email is required";
    else delete errors.email;
    setEmail(target.value);
    setErrors(errors);
  };

  const handleEmailBlur = ({ target }) => {
    if (!validateEmail(target.value) && !errors.email)
      errors.email = "Please enter a valid email";
    else delete errors.email;
    setErrors(errors);
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(String(email).toLowerCase());
  };

  const handlePasswordChange = ({ target }) => {
    if (target.value === "") errors.password = "Password is required";
    else if (target.value !== confirmPassword && confirmPassword !== "")
      errors.password = "Passwords do not match";
    else delete errors.password;
    setPassword(target.value);
    setErrors(errors);
  };

  const handleConfirmPasswordChange = ({ target }) => {
    if (target.value === "") errors.confirmPassword = "Please confirm password";
    if (target.value !== password)
      errors.confirmPassword = "Passwords do not match";
    else delete errors.confirmPassword;
    setConfirmPassword(target.value);
    setErrors(errors);
  };
  const handleClose = () => {
    delete errors.register;
    setErrors(errors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let err = {};
    if (email === "") err.email = "Email is required.";
    if (password === "") err.password = "Password is required.";
    if (confirmPassword === "") err.confirmPassword = "Please confirm password";
    if (Object.keys(err).length !== 0) {
      setErrors(err);
    } else {
      const data = { email, password, confirmPassword };
      postData("/api/users/registration", data)
        .then((data) => {
          const { success } = data;
          if (success) history.push("/confirmRegistration");
          else {
            err.register =
              "User already exists. Please login or try to register again.";
            setErrors(err);
          }
        })
        .catch((err) => console.log("Error", err));
    }
  };

  const failRegister = (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={errors.register?.length > 0}
      autoHideDuration={3000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity="error">
        {errors.register}
      </Alert>
    </Snackbar>
  );

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Header></Header>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        {failRegister}
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            error={errors.email?.length > 0}
            helperText={errors.email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            error={errors.password?.length > 0}
            helperText={errors.password}
            onChange={handlePasswordChange}
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
            autoComplete="current-password"
            error={errors.confirmPassword?.length > 0}
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
          <Box mt={5}>
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
    </Container>
  );
}

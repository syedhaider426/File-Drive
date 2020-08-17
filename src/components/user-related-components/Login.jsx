import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import postData from "../../helpers/postData";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles/";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  tableRow: {
    "&:hover": {
      backgroundColor: "#e8f0fe !important",
      color: "#1967d2 !important",
    },
  },
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage:
      "url(https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=801650w)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
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
    else delete errors.password;
    setPassword(target.value);
    setErrors(errors);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    let err = {};
    if (email === "") err.email = "Email is required.";
    if (password === "") err.password = "Password is required.";
    if (Object.keys(err).length > 0) {
      setErrors(err);
    } else {
      const data = { email, password };
      postData("/api/users/login", data)
        .then((data) => {
          if (data.error) {
            err.login = "Login failed. Please try again.";
            setErrors(err);
          } else {
            history.push("/drive/home");
          }
        })
        .catch((e) => {
          err.login = "Unable to login at this. Please try again later.";
          setErrors(errors);
        });
    }
  };

  const handleClose = () => {};
  const classes = useStyles();
  const failLogin = (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={errors.login?.length > 0}
      autoHideDuration={3000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity="error">
        Login failed. Please try again.
      </Alert>
    </Snackbar>
  );

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            F-Drive
          </Typography>
          {failLogin}
          <form className={classes.form} noValidate onSubmit={handleLogin}>
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
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              error={errors.email?.length > 0}
              helperText={errors.email}
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to="/forgot-password" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}

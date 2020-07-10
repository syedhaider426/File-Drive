import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import postData from "../helpers/postData";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
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
    backgroundImage: "url(https://source.unsplash.com/random)",
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
});

class Login extends Component {
  state = {
    email: "",
    password: "",
    errors: {
      email: "",
      password: "",
    },
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

  handleLogin = (e) => {
    e.preventDefault();
    const { email, password } = { ...this.state };
    const errors = {};
    if (email === "") errors.email = "Email is required.";
    if (password === "") errors.password = "Password is required.";
    if (Object.keys(errors).length !== 0) {
      this.setState({ errors });
    } else {
      const data = { email, password };
      postData("/api/user/login", data).then((data) => {
        if (data.error) {
          errors.login = "Login failed. Please try again.";
          this.setState({ email: "", password: "", errors });
        } else {
          console.log("Logged in succesfully");
          this.props.history.push("/home");
        }
      });
    }
  };

  render() {
    const { classes } = this.props;
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
              G-Drive
            </Typography>
            <form
              className={classes.form}
              noValidate
              onSubmit={this.handleLogin}
            >
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
                onChange={this.handleEmailChange}
                error={this.state.errors.email}
                helperText={this.state.errors.email}
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
                error={this.state.errors.password}
                helperText={this.state.errors.password}
                onChange={this.handlePasswordChange}
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
              <Box mt={5}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                >
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
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(withStyles(styles)(Login));

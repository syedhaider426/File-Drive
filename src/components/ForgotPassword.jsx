import React, { Component } from "react";
import { Link } from "react-router-dom";
import postData from "../helpers/postData";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";

const styles = (theme) => ({
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
});
class ForgotPassword extends Component {
  state = { email: "", errors: "", success: "" };

  handleEmailChange = ({ target }) => {
    let { errors } = this.state;
    if (target.value === "") errors = "Email is required";
    else errors = "";
    this.setState({ email: target.value, errors });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let { email, errors } = { ...this.state };
    if (email === "") {
      errors = "Please enter your email address";
      this.setState({ errors });
    } else {
      const data = { email };
      postData("/api/user/forgotPassword", data).then((data) => {
        console.log(data);
      });
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Forgot Password
          </Typography>
          <form
            className={classes.form}
            noValidate
            onSubmit={this.handleSubmit}
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
              error={this.state.errors}
              helperText={this.state.errors}
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
            <Grid container>
              <Grid item>
                <Link to="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
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
}

export default withStyles(styles)(ForgotPassword);

import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Container from "@material-ui/core/Container";
import postData from "../../helpers/postData";
import Header from "../header-components/Header";

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

// This component handles the functionality for resending an email to verify the user if they did not verify it
export default function ResendVerificationEmail() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState();
  const history = useHistory();
  // User types in email and updates the email hook
  const handleEmailChange = ({ target }) => {
    if (target.value === "") setErrors("Email is required");
    else setErrors("");
    setEmail(target.value);
  };

  // When the email textbox loses focus, function checks to see if the email entered is valid
  const handleEmailBlur = ({ target }) => {
    if (!validateEmail(target.value) && !errors)
      setErrors("Please enter a valid email");
    else setErrors("");
  };

  // Validate the syntax of the email
  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(String(email).toLowerCase());
  };

  // Sends user an email to verify their account
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "") {
      setErrors("Please enter your email address");
    } else {
      const data = { email };
      postData("/api/users/confirmation", data)
        .then((data) => {
          if (data.success.isVerified) history.push("/verified");
          else history.push("/verification-resend");
        })
        .catch((err) => console.log("Err", err));
    }
  };

  const classes = useStyles();
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Header />
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Resend Email Verification
        </Typography>
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
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            error={errors}
            helperText={errors}
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
        </form>
      </div>
    </Container>
  );
}

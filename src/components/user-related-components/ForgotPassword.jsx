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
import Header from "../Header";

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

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState("");
  const [disabledButton, setDisabledButton] = useState(false);
  const history = useHistory();

  const handleEmailChange = ({ target }) => {
    if (target.value === "") setErrors("Email is required");
    else setErrors("");
    setEmail(target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "") {
      setErrors("Please enter your email address");
    } else {
      const data = { email };
      setDisabledButton(true);
      postData("/api/users/password-email", data)
        .then((data) => {
          history.push("/password-confirmation");
        })
        .catch((err) => {
          setDisabledButton(false);
          console.log("Err", err);
        });
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
          Forgot Password
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
            error={errors}
            helperText={errors}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={disabledButton}
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

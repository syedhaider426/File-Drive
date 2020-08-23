import React, { useEffect, useState, Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Container from "@material-ui/core/Container";
import Header from "../Header";
import getData from "../../helpers/getData";
import CircularProgress from "@material-ui/core/CircularProgress";
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
  title: {
    margin: theme.spacing(4),
  },
  button: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

export default function Verification(props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const location = useLocation();
  const token = location.search.substr(7);

  useEffect(() => {
    if (token.length > 0)
      getData(`/registration-confirmation?token=${token}`)
        .then((d) => {
          setIsLoaded(true);
        })
        .catch((err) => setError(true));
    else setError(true);
  });
  const classes = useStyles(props);

  const LoginLink = React.forwardRef((props, ref) => (
    <Link to={"/login"} {...props} ref={ref} />
  ));

  const ResendEmailLink = React.forwardRef((props, ref) => (
    <Link to={"/resend"} {...props} ref={ref} />
  ));

  const verifiedUser = (
    <Fragment>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h5" variant="h6">
        {props.message}
      </Typography>
      <div className={classes.button}>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          component={LoginLink}
        >
          Login
        </Button>
      </div>
    </Fragment>
  );

  const unVerifiedUser = (
    <Fragment>
      <CircularProgress />
      <Typography>Verifying User.....</Typography>
    </Fragment>
  );

  const errorUser = (
    <Fragment>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h5" variant="h6">
        {
          "The confirmation link is not valid anymore. Please resend email verification"
        }
      </Typography>
      <div className={classes.button}>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          component={ResendEmailLink}
        >
          Resend Email Verification
        </Button>
      </div>
    </Fragment>
  );

  return (
    <Container component="main" maxWidth="xs" border={1}>
      <CssBaseline />
      <Header></Header>
      <Box border={1}>
        <div className={classes.paper}>
          {isLoaded && !error
            ? verifiedUser
            : !isLoaded && !error
            ? unVerifiedUser
            : errorUser}
        </div>
      </Box>
    </Container>
  );
}

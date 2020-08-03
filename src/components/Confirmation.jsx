import React from "react";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Container from "@material-ui/core/Container";
import Header from "./Header";

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

export default function Confirmation(props) {
  const classes = useStyles(props);
  const LoginLink = React.forwardRef((props, ref) => (
    <Link to={"/login"} {...props} ref={ref} />
  ));
  return (
    <Container component="main" maxWidth="xs" border={1}>
      <CssBaseline />
      <Header></Header>
      <Box border={1}>
        <div className={classes.paper}>
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
        </div>
      </Box>
    </Container>
  );
}

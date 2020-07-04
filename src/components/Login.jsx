import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import postData from "../helpers/postData";
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
    this.setState({ email: target.value });
  };

  handlePasswordChange = ({ target }) => {
    this.setState({ password: target.value });
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
      postData("/login", data).then((data) => {
        if (data.error) {
          errors.login = "Login failed. Please try again.";
          this.setState({ errors });
        } else {
          this.props.history.push("/home");
        }
      });
    }
  };

  render() {
    const { email, password, errors } = { ...this.state };
    return (
      <div>
        <form onSubmit={this.handleLogin}>
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={email}
            onChange={this.handleEmailChange}
          ></input>
          {errors.email && <label>{errors.email}</label>}
          <label>Password</label>
          <input
            type="text"
            name="password"
            value={password}
            onChange={this.handlePasswordChange}
          ></input>
          {errors.password && <label>{errors.password}</label>}
          <Link to="/forgot-password">Forgot password?</Link>
          <button type="submit">Log In</button>
          <Link to="/register">Register</Link>
        </form>
      </div>
    );
  }
}

export default withRouter(Login);

import React, { Component } from "react";
import postData from "../helpers/postData";


class ForgotPassword extends Component {
  state = { email: "", errors: "", success: "" };

  handleEmailChange = ({ target }) => {
    this.setState({ email: target.value });
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
    const { email, errors } = { ...this.state };
    return (
      <div>
        <h2>Forgot Password</h2>
        <h4>
          Please enter your email address. Reset instructions will be sent to
          you.
        </h4>
        <form onSubmit={this.handleSubmit}>
          <label>Email</label>
          <input
            type="text"
            name="Email"
            value={email}
            onChange={this.handleEmailChange}
          ></input>
          {errors && <label>{errors}</label>}
          <button type="submit">Reset Password</button>
        </form>
      </div>
    );
  }
}

export default ForgotPassword;

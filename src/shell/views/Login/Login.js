import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

import { request } from "../../../util/request";
import { fetchUser } from "../../store/user";
import { notify } from "../../store/notifications";
import { parseUrl } from "../../../util/parseUrl";
import config from "../../config";
import styles from "./Login.less";

class Login extends Component {
  constructor(props) {
    super();
    this.state = {
      submitted: false,
      message: ""
    };
  }
  componentDidMount() {
    const invite = parseUrl(window.location.href);
    if (invite) {
      this.props.dispatch({
        type: "USER_INVITED",
        invite
      });
      console.table(parseUrl(window.location.href));
    }
  }
  render() {
    return (
      <section className={styles.Login}>
        <div className={styles.gridWrap}>
          <header>
            <img src="/zesty-io-logo.svg" />
          </header>
          {this.state.message ? (
            <p className={styles.error}>
              <i className="fa fa-exclamation-triangle" aria-hidden="true" />&nbsp;{
                this.state.message
              }
            </p>
          ) : null}
          <main className={styles.gridSingle}>
            <form name="login" className={styles.LoginForm}>
              <label>
                <p>Email Address</p>
                <Input
                  className={styles.loginInput}
                  type="text"
                  placeholder="e.g. hello@zesty.io"
                  name="email"
                />
              </label>
              <label>
                <p>Password</p>
                <Input
                  className={styles.loginInput}
                  type="password"
                  name="pass"
                />
              </label>
              <Button
                onClick={this.handleLogin}
                disabled={this.state.submitted}
              >
                {this.state.submitted ? "Logging you in" : "Log In"}
              </Button>
            </form>

            <AppLink to="/reset-password">Forgot Password?</AppLink>
          </main>
          <footer className={styles.gridSingle}>
            <div className={styles.createAccount}>
              <h2>Create an Account</h2>
              <p>
                Welcome to Zesty.io. Sign up to start creating and managing
                content ready to be delivered securely, quickily and scalably to
                everywhere from anywhere.<br />
              </p>
              <AppLink to="/signup">Create Account</AppLink>
              <h3>Additional Information</h3>
              <p>
                <Url href="https://zesty.io">https://zesty.io</Url>
              </p>
              <p>
                <Url href="mailto:hello@zesty.io">hello@zesty.io</Url>
              </p>
            </div>
          </footer>
        </div>
      </section>
    );
  }
  handleLogin = evt => {
    this.setState({ submitted: !this.state.submitted });
    evt.preventDefault();
    request(`${config.API_AUTH}/login`, {
      body: {
        email: document.forms.login.email.value,
        password: document.forms.login.pass.value
      }
    })
      .then(json => {
        if (json.code === 200) {
          this.props.dispatch({
            type: "FETCH_AUTH_SUCCESS",
            ZUID: json.meta.userZuid,
            auth: true
          });
        } else if (json.code === 202) {
          window.location = "/login/2fa";
        } else {
          this.setState({ submitted: !this.state.submitted });
          this.props.dispatch(
            notify({
              message: "There was a problem loggin in",
              type: "error"
            })
          );
          this.props.dispatch({
            type: "FETCH_AUTH_ERROR",
            auth: false
          });
        }
      })
      .catch(err => {
        this.setState({ submitted: !this.state.submitted });
        this.props.dispatch(
          notify({
            message: "There was a problem loggin in",
            type: "error"
          })
        );
        console.error("LOGIN ERR", err);
      });
  };
}
export default withRouter(connect(state => state)(Login));

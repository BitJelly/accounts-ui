import React, { Component } from 'react'
import {connect} from 'react-redux'

import styles from './Signup.less'
import {request} from '../../../util/request'

export default class Signup extends Component {
  constructor (props) {
    super(props)
    this.state = {
      message: 'TEST'
    }
  }
  render () {
    return (
      <section className={styles.Signup}>
        <form name='signup' className={styles.SignupForm}>
          <img src='/zesty-z-logo.png' />
          <label>
            <p>Email Address</p>
            <input name='email' className={styles.input} type='email' placeholder="e.g. hello@zesty.io" />
          </label>
          <label>
            <p>First Name</p>
            <input name='first_name' className={styles.input} type='text' />
          </label>
          <label>
            <p>Last Name</p>
            <input name='last_name' className={styles.input} type='text' />
          </label>
          <label>
            <p>Password</p>
            <input name='pass' className={styles.input} type='password' />
          </label>
          <Button onClick={this.handleSignup}>Create An Account</Button>
          <p>{this.state.message}</p>
        </form>
      </section>
    )
  }
  handleSignup = (evt) => {
    evt.preventDefault()

    console.log("signup", evt);

    // request('http://svc.zesty.localdev:3011/login', {
    //   body: {
    //     email: document.forms.login.email.value,
    //     password: document.forms.login.pass.value
    //   }
    // })
    // .then(json => {
    //   if (json.code === 201) {
    //     // TODO Show 2FA screen
    //     // TODO poll auth api for 2FA one touch
    //     this.props.dispatch({
    //       type: 'FETCH_AUTH_SUCCESS',
    //       auth: false
    //     })
    //   } else {
    //     // TODO Display error message
    //     this.setState({
    //       message: json.message
    //     })
    //     this.props.dispatch({
    //       type: 'FETCH_AUTH_SUCCESS',
    //       auth: false
    //     })
    //   }
    // })
  }
}

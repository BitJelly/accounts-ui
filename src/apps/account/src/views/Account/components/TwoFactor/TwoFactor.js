import React, { Component } from 'react'
import { zConfirm } from '../../../../../../../shell/store/confirm'
import { update2fa } from '../../../../../../../shell/store/user'

import styles from './TwoFactor.less'

export default class TwoFactorOptions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      submitted: false,
      authyPhoneCountryCode: '',
      authyPhoneNumber: ''
    }
  }
  render() {
    return (
      <Card>
        <CardHeader>
          <h1>Two-Factor Authentication (2FA)</h1>
        </CardHeader>
        <CardContent className={styles.TwoFactor}>
          {this.props.user.authyEnabled ? (
            <React.Fragment>
              <p>
                Two-factor authentication is enabled on your account. Currently
                registered phone number:
              </p>
              <p className={styles.RegisteredNumber}>
                +{this.props.user.authyPhoneCountryCode}-{
                  this.props.user.authyPhoneNumber
                }
              </p>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <p>
                <Url
                  className={styles.InfoLink}
                  target="_blank"
                  href="https://authy.com/what-is-2fa/">
                  What is Authy 2 Factor Authentication?
                </Url>
              </p>
              <p>
                Two-factor authentication is not currently enabled for this
                account. Provide your primary phone number for authentication
                below.
              </p>
              <form id="TwoFactor">
                <label className={styles.PhoneNumber}>
                  <span className={styles.PhoneNumberLabel}>Phone Number</span>
                  <Input
                    required
                    type="text"
                    size="5"
                    placeholder="+1"
                    name="authyPhoneCountryCode"
                    value={this.state.authyPhoneCountryCode}
                    onChange={this.handleChange}
                  />&nbsp;
                  <Input
                    required
                    type="tel"
                    placeholder="123-456-7890"
                    name="authyPhoneNumber"
                    value={this.state.authyPhoneNumber}
                    onChange={this.handleChange}
                  />
                </label>
              </form>
            </React.Fragment>
          )}
        </CardContent>
        <CardFooter>
          {this.props.user.authyEnabled ? (
            <Button
              onClick={this.handleDisable}
              disabled={this.state.submitted}>
              {this.state.submitted ? (
                <React.Fragment>
                  <i className="fa fa-hourglass-o" aria-hidden="true" />&nbsp;Disabling
                  Authy 2FA
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <i className="fa fa-shield" aria-hidden="true" />&nbsp;Disable
                  Authy 2FA
                </React.Fragment>
              )}
            </Button>
          ) : (
            <Button
              form="TwoFactor"
              onClick={this.handleEnable}
              disabled={this.state.submitted}>
              {this.state.submitted ? (
                <React.Fragment>
                  <i className="fa fa-hourglass-o" aria-hidden="true" />&nbsp;Enabling
                  Authy 2FA
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <i className="fa fa-shield" aria-hidden="true" />&nbsp;Enable
                  Authy 2FA
                </React.Fragment>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    )
  }
  handleChange = evt => {
    this.setState({ [evt.target.name]: evt.target.value })
  }
  handleEnable = evt => {
    evt.preventDefault()

    if (!this.state.authyPhoneNumber || !this.state.authyPhoneNumber) {
      return
    }

    this.setState({
      submitted: true
    })
    this.props
      .dispatch(update2fa(this.props.user.ZUID, true, this.state))
      .then(() => {
        this.setState({
          submitted: false
        })
      })
      .catch(err => {
        console.error(err)
        this.setState({
          submitted: false
        })
      })
  }
  handleDisable = () => {
    this.props.dispatch(
      zConfirm({
        prompt: 'Are you sure you want to disable two-factor authentication?',
        callback: confirmed => {
          if (confirmed) {
            this.setState({
              submitted: true
            })
            this.props
              .dispatch(update2fa(this.props.user.ZUID, false))
              .then(() => {
                this.setState({
                  submitted: false
                })
              })
              .catch(err => {
                console.error(err)
                this.setState({
                  submitted: false
                })
              })
          }
        }
      })
    )
  }
}

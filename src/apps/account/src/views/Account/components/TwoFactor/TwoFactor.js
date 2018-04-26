import { Component } from 'React'
import { connect } from 'react-redux'

import Toggle from '../../../../../../../core/toggle/Toggle'
import { zConfirm } from '../../../../../../../shell/store/confirm'
import { update2fa } from '../../../../../../../shell/store/user'

import styles from './TwoFactor.less'

class TwoFactorOptions extends Component {
  constructor(props) {
    super()
    this.state = {
      authyPhoneCountyCode: '',
      authyPhoneNumber: ''
    }
  }
  handleChange = evt => {
    this.setState({ [evt.target.name]: evt.target.value })
  }
  handleEnable = evt => {
    evt.preventDefault()
    // do the thing that sets up 2fa
    this.props.dispatch(update2fa(true, this.state))
  }
  handleDisable = evt => {
    evt.preventDefault()
    this.props.dispatch(
      zConfirm({
        prompt: 'Are you sure you want to disable two factor auth?',
        callback: response => {
          if (response) {
            // do the thing that removes 2fa
            this.props.dispatch(update2fa(false))
          }
        }
      })
    )
  }
  render() {
    return (
      <article className={styles.TwoFactor}>
        <header>
          <h2>Two Factor Authentication</h2>
        </header>
        <main>
          {this.props.authyEnabled ? (
            <div>
              <p>
                Two-factor authentication currently set up for this account.
              </p>
              <p>number used {this.props.authyPhoneNumber}</p>
              <Button text="Disable Two-factor" onClick={this.handleDisable} />
            </div>
          ) : (
            <div>
              <p>
                Two-factor authentication is not currently set up for this
                account. Put in the phone number you want to use for
                authentication below.
              </p>
              <label>Phone Number</label>
              <Input
                type="text"
                size="5"
                placeholder="+1"
                name="authyPhoneCountyCode"
                value={this.state.authyPhoneCountyCode}
                onChange={this.handleChange}
              />
              <Input
                type="text"
                placeholder="123-456-7890"
                name="authyPhoneNumber"
                required
                value={this.state.authyPhoneNumber}
                onChange={this.handleChange}
              />
            </div>
          )}
        </main>
        <footer>
          {this.props.authyEnabled ? (
            <Button text="Disable Two-factor" onClick={this.handleDisable} />
          ) : (
            <Button text="Enable Two-factor" onClick={this.handleEnable} />
          )}
        </footer>
      </article>
    )
  }
}

export default connect(state => state.user)(TwoFactorOptions)

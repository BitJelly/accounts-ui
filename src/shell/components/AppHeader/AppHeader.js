import { Component } from 'react'
import { NavLink } from 'react-router-dom'
import cx from 'classnames'
import styles from './AppHeader.less'

import { logout } from '../../store/auth'
import { zConfirm } from '../../store/confirm'

export default class AppHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userNavOpen: ''
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.closeUserNav)
    if (!this.props.user.prefs.hasSelectedDev) {
      this.props.dispatch(
        zConfirm({
          prompt: 'Are you interested in using developer features?',
          callback: response => {
            if (response) {
              this.props.dispatch({
                type: 'DEV_PREFS',
                payload: 1
              })
              this.props.dispatch(saveProfile())
            } else {
              this.props.dispatch({
                type: 'DEV_PREFS',
                payload: 0
              })
              this.props.dispatch(saveProfile())
            }
          }
        })
      )
    }
  }
  componentWillUnmountMount() {
    document.removeEventListener('click', this.closeUserNav)
  }

  render() {
    return (
      <header className={styles.AppHeader}>
        <img className={styles.logo} src="/zesty-z-logo.svg" />
        <nav className={styles.GlobalNav}>
          <NavLink to="/instances">
            <i className="fa fa-globe" aria-hidden="true" />
            &nbsp;Instances
          </NavLink>
          {/* <NavLink to="/teams">
            <i className="fa fa-users" aria-hidden="true" />
            &nbsp;Teams
          </NavLink> */}
          {this.props.user.prefs.devOptions === 1 && (
            <NavLink to="/blueprints">
              <i className="fa fa-map" aria-hidden="true" />
              &nbsp;Blueprints
            </NavLink>
          )}
        </nav>
        <nav
          ref={nav => (this.userNav = nav)}
          className={cx(
            'UserNav',
            styles.UserNav,
            styles[this.state.userNavOpen]
          )}
          onClick={this.toggleUserNav}>
          {this.props.user.firstName} {this.props.user.lastName}
          <img
            className={styles.avatar}
            src={`https://www.gravatar.com/avatar/${
              this.props.user.emailHash
            }?d=mm&s=30`}
          />
          <ul className={styles.UserMenu} id="userNavDropdown">
            <li className={styles.user}>
              <span className={styles.name}>
                {this.props.user.firstName} {this.props.user.lastName}
              </span>
              <span className={styles.email}>{this.props.user.email}</span>
            </li>

            <hr />

            <li>
              <NavLink to="/settings/account">
                <i className="fa fa-cog" aria-hidden="true" /> My Account
              </NavLink>
            </li>

            <li>
              <NavLink to="/support">
                <i
                  className={cx(styles.icon, 'fa fa-question-circle')}
                  aria-hidden="true"
                />{' '}
                Support
              </NavLink>
            </li>

            <hr />

            <li
              className={styles.logout}
              title="Logout"
              onClick={() => this.props.dispatch(logout())}>
              <i className="fa fa-sign-out" aria-hidden="true" />
              &nbsp;Logout
            </li>
          </ul>
        </nav>
      </header>
    )
  }

  toggleUserNav = evt => {
    this.setState({
      userNavOpen: this.state.userNavOpen === 'show' ? '' : 'show'
    })
  }

  closeUserNav = evt => {
    if (this.state.userNavOpen) {
      const parent = evt.target.closest('.UserNav')
      if (!parent || parent !== this.userNav) {
        this.setState({
          userNavOpen: ''
        })
      }
    }
  }
}

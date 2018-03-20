import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './profile.less'

import { updateSetting, saveProfile } from '../../../store'

class Profile extends Component {
  handleClick = e => {
    e.preventDefault()
    this.props.dispatch(saveProfile())
  }
  handleChange = e => {
    this.props.dispatch(updateSetting({ [e.target.name]: e.target.value }))
  }
  render() {
    return (
      <section className={styles.profile}>
        <h2>Profile</h2>
        <div className={styles.field}>
          <div>
            <label>First Name</label>
          </div>
          <Input
            type="text"
            value={this.props.profile.firstName}
            onChange={this.handleChange}
            name="firstName"
          />
        </div>
        <div className="field">
          <div>
            <label>Last Name</label>
          </div>
          <Input
            type="text"
            value={this.props.profile.lastName}
            onChange={this.handleChange}
            name="lastName"
          />
          <Button
            className={styles.ProfileSave}
            text="Save"
            onClick={this.handleClick}
          />
        </div>
      </section>
    )
  }
}

const mapStateToProps = state => {
  return { profile: state.profile }
}
export default connect(mapStateToProps)(Profile)

import react, { Component } from 'react'
import { connect } from 'react-redux'

import { request } from '../../../../../util/request'
import { notify } from '../../../../../shell/store/notifications'
import config from '../../../../../shell/config'

import styles from './BugReport.less'
class BugReport extends Component {
  componentDidMount() {
    let navClone = {}
    // have to use a for in loop because navigator is all proto
    for (const prop in navigator) {
      navClone[prop] = navigator[prop]
    }
    // remove functions from the object proto
    Object.keys(navClone).map(key => {
      if (typeof navClone[key] !== 'string') {
        delete navClone[key]
      }
    })
    this.setState({
      userInfo: {
        navData: navClone,
        zestyUser: this.props.user
      }
    })
  }

  render() {
    return (
      <div className={styles.bugReport}>
        <h2> Bug Report</h2>
        <form
          onSubmit={evt => {
            evt.preventDefault()
            // generate user data object to be send with the bug report
            const dataObj = {
              currentTime: Date.now()
            }

            const formData = new FormData(evt.target)
            formData.forEach((entry, key) => {
              if (evt.target[key].type === 'checkbox') {
                dataObj[key] = evt.target[key].checked
              } else {
                dataObj[key] = entry
              }
            })
            dataObj.user = this.state.userInfo

            this.sendBugReport(dataObj)
          }}>
          <p>
            We appologize that you have experienced issues with our product.<br />
            In order to make this product better for you please give as much
            detail as possible.
          </p>
          <label>Describe the issue</label>
          <textarea name="reportedIssue" wrap="soft" />
          <span className={styles.inline}>
            <input type="checkbox" name="followUp" />
            <p>Please follow up with me about this issue.</p>
          </span>
          <Button type="submit" text="Submit" />
          <Button type="cancel" text="Cancel" onClick={this.cancel} />
        </form>
      </div>
    )
  }

  cancel = evt => {
    evt.preventDefault()
    this.props.history.push('/support')
  }

  sendBugReport = data => {
    request(config.EMAIL_SERVICE, {
      method: 'POST',
      json: true,
      body: {
        senderHandle: 'bugs',
        senderName: this.state.userInfo.zestyUser.firstName,
        emailSubject: `Bug report from Accounts-UI dateTime-${
          data.currentTime
        }`,
        emailBody: JSON.stringify(data, null, 2),
        toRecipient: 'support@zesty.io'
      }
    })
      .then(data => {
        this.props.dispatch(
          notify({
            message: 'Thank you for your feedback',
            type: 'success'
          })
        )
      })
      .catch(err => {
        this.props.dispatch(
          notify({
            message: 'there was a problem with the bug report',
            type: 'error'
          })
        )
        console.log(err)
      })
  }
}

export default connect(state => state)(BugReport)

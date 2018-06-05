import React, { Component } from 'react'
import { connect } from 'react-redux'

import { updateDomain } from '../../../../store/sitesDomain'
import { fetchSite } from '../../../../store/sites'
import { notify } from '../../../../../../../shell/store/notifications'

import styles from './Domain.less'

class Domain extends Component {
  /* TODO:
  **  users need to confirm and upgrade their
  **  accounts in order to use the custom
  **  domain feature. this will be implemented
  **  in a future API version
  */

  constructor(props) {
    super(props)
    this.state = {
      submitted: false,
      editing: false,
      domain: props.site.domain || ''
    }
  }
  render() {
    return (
      <label className={styles.Domain}>
        {this.state.submitted ? (
          <span>Saving&hellip;</span>
        ) : this.props.site.domain && !this.state.editing ? (
          <span className={styles.Name} onClick={this.handleEdit}>
            {this.state.domain}
            <i className="fa fa-pencil" />
          </span>
        ) : (
          <span className={styles.Edit}>
            <Input
              value={this.state.domain}
              placeholder="Set a custom domain"
              onChange={this.handleDomain}
            />
            <Button onClick={this.handleSave}>
              <i className="fa fa-save" aria-hidden="true" />Save
            </Button>
          </span>
        )}
      </label>
    )
  }

  handleEdit = () => {
    this.setState({
      editing: true
    })
  }

  handleDomain = evt => {
    this.setState({
      domain: evt.target.value
    })
  }

  handleSave = () => {
    this.setState({ submitted: true })
    let strippedDomain = this.state.domain.toLowerCase().replace(/http:\/\/|https:\/\//g, '')
    this.props
      .dispatch(
        updateDomain(this.props.siteZUID, strippedDomain)
      )
      .then(domain => {
        console.log('Domain update success', domain)
        this.setState({
          domain,
          submitted: false,
          editing: false
        })
        this.props.dispatch(
          notify({
            message: `Your domain has been set to ${domain}`,
            type: 'success'
          })
        )
      })
      .catch(data => {
        this.setState({ submitted: false })
        this.props.dispatch(
          notify({
            message: `There was an error changing your domain`,
            type: 'error'
          })
        )
      })
  }
}

export default connect(state => state)(Domain)

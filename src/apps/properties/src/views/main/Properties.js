import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import styles from './Websites.less'
import { WithLoader } from '@zesty-io/core/WithLoader'

import { fetchSites, fetchSitesWithInvites } from '../../store/sites'
import { fetchSystemRoles } from '../../../../../shell/store/systemRoles'

import PropertiesList from '../PropertiesList'
import PropertyCreate from '../PropertyCreate'
import PropertyBlueprint from '../PropertyBlueprint'
import PropertyOverview from '../PropertyOverview'

class Properties extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loadingSites: true,
      loadingInvitedSites: true
    }
  }
  componentDidMount() {
    this.props.dispatch(fetchSites()).then(() => {
      this.setState({ loadingSites: false })
    })
    this.props.dispatch(fetchSitesWithInvites()).then(() => {
      this.setState({ loadingInvitedSites: false })
    })
    this.props.dispatch(fetchSystemRoles())
  }
  render() {
    return (
      <section className={styles.Websites}>
        <WithLoader
          condition={
            !this.state.loadingSites && !this.state.loadingInvitedSites
          }
          message="Loading Your Instances">
          <Switch>
            <Route
              exact
              path="/instances/:zuid/blueprint"
              component={PropertyBlueprint}
            />
            <Route exact path="/instances/create" component={PropertyCreate} />
            <Route path="/instances" component={PropertiesList} />
          </Switch>
        </WithLoader>
      </section>
    )
  }
}
export default connect(state => state)(Properties)

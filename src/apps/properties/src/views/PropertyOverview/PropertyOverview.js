import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import styles from './PropertyOverview.less'

import PropertyName from './components/PropertyName'
import Domain from './components/Domain'
import Users from './components/Users'
import Roles from './components/Roles'
import Blueprint from './components/Blueprint'

import { fetchSiteUsers, fetchSiteUsersPending } from '../../store/sitesUsers'
import { fetchSiteRoles } from '../../store/sitesRoles'
// import { fetchSite } from '../../store/sites'
// import { fetchSiteCollections } from '../../store/sitesCollections'
// import { updateSite } from '../../store/sites'
// import { notify } from '../../../../../shell/store/notifications'

class PropertyOverview extends Component {
  constructor(props) {
    super(props)
    console.log('PropertyOverview: ', props)
  }
  componentDidMount() {
    // Fetch Users
    this.props.dispatch(fetchSiteUsers(this.props.siteZUID))
    this.props.dispatch(fetchSiteRoles(this.props.siteZUID))
    // this.props.dispatch(fetchSiteTeams(this.props.siteZUID))
    // this.props.dispatch(fetchSiteCollections(this.props.siteZUID))
    // this.props.dispatch(fetchBlueprint(this.props.site.blueprintID))

    // pending users
    this.props.dispatch(fetchSiteUsersPending(this.props.siteZUID))
  }
  render() {
    return (
      <section className={styles.PropertyOverviewWrap}>
        <article className={styles.PropertyOverview}>
          <header className={styles.PropertyOverviewHeader}>
            <Link className={styles.close} to="/properties/">
              <i className="fa fa-times-circle-o" aria-hidden="true" /> Close
            </Link>
            <PropertyName name={this.props.site.name} />
            <Domain siteZUID={this.props.site.ZUID} site={this.props.site} />
          </header>
          <main>
            <article className={styles.card}>
              <h2>
                <i className="fa fa-users" aria-hidden="true" />
                &nbsp;User Access
              </h2>
              <Users
                siteZUID={this.props.site.ZUID}
                dispatch={this.props.dispatch}
                users={this.props.users}
                roles={this.props.roles}
              />
            </article>

            {/* <article className={styles.card}>
              <h2>
                <i className="fa fa-building" aria-hidden="true" />
                &nbsp;Company Access
              </h2>
              <CompanyAccess />
            </article> */}

            {/* <article className={styles.card}>
              <h2>
                <i className="fa fa-lock" aria-hidden="true" />
                &nbsp;Site Roles
              </h2>
              <Roles />
            </article>

            <article className={styles.card}>
              <h2>
                <i className="fa fa-file-code-o" aria-hidden="true" />
                &nbsp;Blueprint
              </h2>
              <Blueprint />
            </article> */}
          </main>
        </article>
      </section>
    )
  }
}

export default withRouter(
  connect((state, props) => {
    const siteZUID = props.match.params.hash
    return {
      siteZUID,
      users: state.sitesUsers[siteZUID] || {},
      roles: state.sitesRoles[siteZUID] || {},
      site: state.sites[siteZUID] || {}
    }
  })(PropertyOverview)
)

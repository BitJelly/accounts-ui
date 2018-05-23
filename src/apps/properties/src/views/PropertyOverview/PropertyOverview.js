import React, { Component } from 'react'
import { Route } from 'react-router'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import styles from './PropertyOverview.less'

import PropertyName from './components/PropertyName'
import Domain from './components/Domain'
import Users from './components/Users'
import CompanyAccess from './components/CompanyAccess'
import Roles from './components/Roles'
import Blueprint from './components/Blueprint'
import Meta from './components/Meta'

import { fetchSiteUsers, fetchSiteUsersPending } from '../../store/sitesUsers'
import { fetchSiteRoles } from '../../store/sitesRoles'
import { fetchSiteCompanies } from '../../store/sitesCompanies'
import { fetchBlueprint } from '../../store/blueprints'
// import { fetchSite } from '../../store/sites'
// import { updateSite } from '../../store/sites'
// import { notify } from '../../../../../shell/store/notifications'

class PropertyOverview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loadingUsers: true,
      loadingRoles: true,
      loadingUsersPending: true,
      loadingTeams: true,
      loadingCollections: true,
      loadingBlueprint: true
    }
  }
  componentDidMount() {
    this.props.dispatch(fetchSiteUsers(this.props.siteZUID)).then(() => {
      this.setState({
        loadingUsers: false
      })
    })
    this.props.dispatch(fetchSiteUsersPending(this.props.siteZUID)).then(() => {
      this.setState({
        loadingUsersPending: false
      })
    })
    this.props.dispatch(fetchSiteRoles(this.props.siteZUID)).then(() => {
      this.setState({
        loadingRoles: false
      })
    })
    this.props.dispatch(fetchSiteCompanies(this.props.siteZUID)).then(() => {
      this.setState({
        loadingTeams: false
      })
    })
    this.props
      .dispatch(fetchBlueprint(this.props.site.blueprintID))
      .then(() => {
        this.setState({
          loadingBlueprint: false
        })
      })

    document.addEventListener('keydown', this.close)
    document.addEventListener('click', this.close)
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.close)
    document.removeEventListener('keydown', this.close)
  }
  render() {
    return (
      <section className={styles.PropertyOverviewWrap}>
        <article className={styles.PropertyOverview}>
          <Button
            className={styles.CloseOverview}
            id="closeOverviewButton"
            onClick={this.close}
          >
            <i className="fa fa-times-circle-o" aria-hidden="true" />
          </Button>
          <header className={styles.PropertyOverviewHeader}>
            <PropertyName
              siteZUID={this.props.site.ZUID}
              name={this.props.site.name}
              dispatch={this.props.dispatch}
            />
            <Domain siteZUID={this.props.site.ZUID} site={this.props.site} />

            <Url
              className={styles.manager}
              target="_blank"
              href={`${CONFIG.MANAGER_URL_PROTOCOL}${
                this.props.site.randomHashID
              }${CONFIG.MANAGER_URL}`}
            >
              <i className="fa fa-external-link" aria-hidden="true" />&nbsp;Site
              Manager
            </Url>
          </header>
          <main className={styles.Cards}>
            <Route
              path="/instances/:siteZUID"
              render={routeProps => {
                return (
                  <Users
                    {...routeProps}
                    // viewerSystemRole={this.props.viewerSystemRole}
                    isAdmin={this.props.isAdmin}
                    siteZUID={this.props.site.ZUID}
                    dispatch={this.props.dispatch}
                    users={this.props.users}
                    siteRoles={this.props.siteRoles}
                    loadingUsers={this.state.loadingUsers}
                    loadingUsersPending={this.state.loadingUsersPending}
                    loadingRoles={this.state.loadingRoles}
                  />
                )
              }}
            />

            {/* Custom roles are on pause until legacy cuts over */}
            {/* <Route
              path="/instances/:siteZUID"
              render={routeProps => {
                return (
                  <Roles
                    {...routeProps}
                    dispatch={this.props.dispatch}
                    siteZUID={this.props.siteZUID}
                    userZUID={this.props.userZUID}
                    siteRoles={this.props.siteRoles}
                    systemRoles={this.props.systemRoles}
                  />
                )
              }}
            /> */}

            {this.props.isAdmin ? (
              <Route
                path="/instances/:siteZUID"
                render={routeProps => {
                  return (
                    <CompanyAccess
                      companies={this.props.companies}
                      siteRoles={this.props.siteRoles}
                      loadingTeams={this.state.loadingTeams}
                    />
                  )
                }}
              />
            ) : null}

            <Route
              path="/instances/:siteZUID"
              render={routeProps => {
                return (
                  <Blueprint
                    {...routeProps}
                    isAdmin={this.props.isAdmin}
                    loadingBlueprint={this.state.loadingBlueprint}
                    siteZUID={this.props.siteZUID}
                    blueprint={this.props.blueprint}
                  />
                )
              }}
            />

            <Route
              path="/instances/:siteZUID"
              render={routeProps => {
                return <Meta {...routeProps} site={this.props.site} />
              }}
            />

            {/* <article className={styles.card}>
              <h2>
                <i className="fa fa-users" aria-hidden="true" />
                &nbsp;User Access
              </h2>
              <Users
                siteZUID={this.props.site.ZUID}
                dispatch={this.props.dispatch}
                users={this.props.users}
                roles={this.props.allRoles}
                loadingUsers={this.state.loadingUsers}
                loadingUsersPending={this.state.loadingUsersPending}
                loadingRoles={this.state.loadingRoles}
              />
            </article> */}

            {/* <article className={styles.card}>
              <h2>
                <i className="fa fa-lock" aria-hidden="true" />
                &nbsp;Custom Site Roles
              </h2>
              <Roles
                dispatch={this.props.dispatch}
                siteZUID={this.props.siteZUID}
                siteRoles={this.props.siteRoles}
                systemRoles={this.props.systemRoles}
              />
            </article> */}

            {/* <article className={styles.card}>
              <h2>
                <i className="fa fa-building" aria-hidden="true" />
                &nbsp;Company Access
              </h2>
              <CompanyAccess
                companies={this.props.companies}
                loadingTeams={this.state.loadingTeams}
              />
            </article> */}

            {/* <Blueprint
              loadingBlueprint={this.state.loadingBlueprint}
              siteZUID={this.props.siteZUID}
              blueprint={this.props.blueprint}
            /> */}
          </main>
        </article>
      </section>
    )
  }
  close = evt => {
    if (evt.key === 'Escape') {
      this.props.history.push('/instances')
    }
    if (evt.type === 'click') {
      if (
        evt.target.parentElement.id === 'siteListWrapper' ||
        evt.target.parentElement.id === 'closeOverviewButton'
      ) {
        this.props.history.push('/instances')
      }
    }
  }
}

export default withRouter(
  connect((state, props) => {
    const siteZUID = props.match.params.hash

    let systemRoles = Object.keys(state.systemRoles).reduce((acc, key) => {
      acc.push(state.systemRoles[key])
      return acc
    }, [])

    // Get all non system roles for instance
    let siteRoles = state.sitesRoles[siteZUID] || {}
    siteRoles = Object.keys(siteRoles)
      .reduce((acc, key) => {
        acc.push(siteRoles[key])
        return acc
      }, [])
      .filter(role => !role.systemRole)

    // let viewerSystemRole =
    //   state.sitesUsers[siteZUID] && state.sitesUsers[siteZUID][state.user.ZUID]
    //     ? state.sitesUsers[siteZUID][state.user.ZUID].role.systemRole
    //     : {}

    // Determine users permissions for instance
    let isAdmin = false
    if (state.user.staff) {
      isAdmin = true
    } else {
      if (
        state.sitesUsers[siteZUID] &&
        state.sitesUsers[siteZUID][state.user.ZUID]
      ) {
        if (
          state.sitesUsers[siteZUID][state.user.ZUID].role.name === 'Owner' ||
          state.sitesUsers[siteZUID][state.user.ZUID].role.name === 'Admin'
        ) {
          isAdmin = true
        }
      }
    }

    return {
      siteZUID,
      systemRoles,
      siteRoles,
      userZUID: state.user.ZUID,
      isAdmin,
      // viewerSystemRole,
      site: state.sites[siteZUID] || {},
      users: state.sitesUsers[siteZUID] || {},
      companies: state.sitesCompanies[siteZUID] || {},
      blueprint: state.sites[siteZUID]
        ? state.blueprints[state.sites[siteZUID].blueprintID] || {}
        : {}
    }
  })(PropertyOverview)
)

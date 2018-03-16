import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import styles from './WebsiteOverview.less'

import UserAccess from './UserAccess'
import CompanyAccess from './CompanyAccess'
import Actions from './Actions'
import Domain from './Domain'
import Stats from './Stats'
import Blueprint from './Blueprint'

import { getSiteDetails } from '../../store'
import { getUsersForSite } from '../../store/siteUsers'

class WebsiteOverview extends Component {
  componentDidMount() {
    this.props.dispatch(getSiteDetails())
    this.props.dispatch(getUsersForSite(this.props.userZuid, this.props.ZUID))
    console.log(this.props)
  }
  render() {
    return (
      <section className={styles.WebsiteOverviewWrap}>
        {this.props.AccountName ? (
          <article className={styles.WebsiteOverview}>
            <header>
              <Link className={styles.close} to="/properties/">
                <i className="fa fa-times-circle-o" aria-hidden="true" />Close
              </Link>
              <h1 className={styles.name}>{this.props.AccountName}</h1>
              <h2 className={styles.domain}>
                {this.props.Domain ? (
                  this.props.Domain
                ) : (
                  <Button>
                    <i className={cx('fa fa-cog')} aria-hidden="true" />Setup
                    Domain
                  </Button>
                )}
              </h2>
            </header>
            <main>
              <h2>Month Requests</h2>
              <Stats site={this.props} />
              <h2>Recent Site Actions</h2>
              {/* <Actions site={this.props} /> */}
              <h2>User Access</h2>
              <UserAccess users={this.props.siteUsers} />
              <h2>Company Access</h2>
              {/* <CompanyAccess site={this.props} /> */}
              <h2>Blueprint</h2>
              {/* <Blueprint site={this.props} /> */}
            </main>
          </article>
        ) : (
          <section className={styles.Loading}>
            <h3>Loading Site</h3>
            <Loader />
          </section>
        )}
      </section>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    ...state.sites[ownProps.match.params.hash],
    userZuid: state.user.zuid
  }
}
export default withRouter(connect(mapStateToProps)(WebsiteOverview))

import React, { Component } from 'react'
import { connect } from 'react-redux'

import CreateTeam from '../../components/CreateTeam'
import TeamCard from '../../components/TeamCard'

import styles from './teams.less'
import InviteCard from '../InviteCard/'

class Teams extends Component {
  state = {
    user: this.props.user
  }

  render() {
    return (
      <section className={styles.Teams}>
        <h1 className={styles.TeamsTitle}>Manage Your Teams</h1>
        <div className={styles.Team}>
          <div className={styles.TeamCard}>
            {/* creation card */}
            <CreateTeam dispatch={this.props.dispatch} />
            {/* invited teams */}
            {this.props.teams &&
              Object.keys(this.props.teams)
                .filter(team =>
                  this.props.teams[team].hasOwnProperty('teamInviteZUID')
                )
                .map((team, i) => (
                  <InviteCard
                    team={this.props.teams[team]}
                    dispatch={this.props.dispatch}
                    key={i}
                  />
                ))}
            {/* regular teams */}
            {this.props.teams &&
              Object.keys(this.props.teams)
                .filter(
                  team =>
                    !this.props.teams[team].hasOwnProperty('teamInviteZUID')
                )
                .map(team => {
                  return (
                    <TeamCard
                      dispatch={this.props.dispatch}
                      team={this.props.teams[team]}
                      key={this.props.teams[team].ZUID}
                      isAdmin={
                        this.props.teams[team].createdByUserZUID ===
                        this.props.user.ZUID
                      }
                    />
                  )
                })}
          </div>
        </div>
      </section>
    )
  }
}
const mapStateToProps = state => {
  return { user: state.user, teams: state.teams }
}

export default connect(mapStateToProps)(Teams)

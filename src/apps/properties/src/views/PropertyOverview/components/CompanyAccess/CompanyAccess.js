import { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { zConfirm } from '../../../../../../../shell/store/confirm'
import {
  fetchSiteTeams,
  addTeamToInstance,
  removeTeamFromInstance
} from '../../../../store/sitesTeams'

import styles from './CompanyAccess.less'

export default class CompanyAccess extends Component {
  constructor(props) {
    super(props)
    this.state = {
      team: '',
      role: ''
    }
  }
  componentDidMount() {
    this.props.dispatch(fetchSiteTeams(this.props.match.params.siteZUID))
  }
  render() {
    return (
      <Card className={styles.TeamAccess}>
        <CardHeader>
          <h2>
            <i className="fa fa-building" aria-hidden="true" />
            &nbsp;Team Access
          </h2>
        </CardHeader>
        <CardContent>
          {this.props.isAdmin ? (
            <React.Fragment>
              <p>
                By providing a team access you can allow an external group of
                users access to manage your instance. For example: this can be
                used to provide an agency with access to manage your website.
              </p>
              <div className={styles.addCompany}>
                <Input placeholder="Enter team ID" onChange={this.handleTeam} />
                <Select onSelect={this.handleRole}>
                  <Option key="default" value="" text="Select Role" />
                  {this.props.siteRoles.map(role => {
                    return (
                      <Option
                        key={role.ZUID}
                        value={role.ZUID}
                        text={role.name}
                      />
                    )
                  })}
                </Select>
                <Button name="companyAccessSubmit" onClick={this.handleAddTeam}>
                  Grant Access
                </Button>
              </div>
            </React.Fragment>
          ) : null}
          <div className={styles.companyTable}>
            <header>
              <h3>Team</h3>
              <h3>Contact</h3>
              <h3>Email</h3>
              <h3>Access</h3>
            </header>
            <main>
              <WithLoader
                condition={!this.props.loadingTeams}
                message="Loading Instance Teams"
                height="100px"
                width="100%">
                {Object.keys(this.props.teams).map(ZUID => {
                  let team = this.props.teams[ZUID]
                  return (
                    <article key={ZUID}>
                      <span>{team.name}</span>
                      <span>{team.mainContactName}</span>
                      <span>{team.mainContactEmail}</span>
                      <span>
                        {this.props.isAdmin && (
                          <i
                            className="fa fa-trash-o"
                            onClick={() => this.handleRemove(team.ZUID)}
                          />
                        )}
                      </span>
                    </article>
                  )
                })}

                {!Object.keys(this.props.teams).length &&
                !this.props.loadingTeams ? (
                  <article>
                    <em>No team access added for this instance.</em>
                  </article>
                ) : null}
              </WithLoader>
            </main>
          </div>
        </CardContent>
      </Card>
    )
  }
  handleRemove = teamZUID => {
    this.props.dispatch(
      zConfirm({
        prompt: `are you sure you want to remove access from ${
          this.props.teams[teamZUID].name
        }`,
        callback: result => {
          if (!result) {
            return
          }
          this.props.dispatch(
            removeTeamFromInstance(teamZUID, this.props.siteZUID)
          )
        }
      })
    )
  }
  handleTeam = evt => {
    this.setState({
      team: evt.target.value
    })
  }
  handleRole = evt => {
    this.setState({
      role: evt.target.dataset.value
    })
  }
  handleAddTeam = () => {
    this.props
      .dispatch(
        addTeamToInstance(this.props.siteZUID, this.state.team, this.state.role)
      )
      .then(console.log)
  }
}

import React, { Component } from 'react'

import { createTeam } from '../../store'

import styles from './create.less'
class CreateTeam extends Component {
  state = {
    name: '',
    invitees: ['', '', ''],
    submitted: false
  }
  render() {
    return (
      <Card className={styles.Card}>
        <CardHeader>
          <h1>Create Team</h1>
        </CardHeader>
        <CardContent>
          <section>
            <label>Name your team:</label>
            <Input
              type="text"
              value={this.state.name}
              onChange={this.changeName}
            />
          </section>
          <section>
            <p>Add members to a team and gain access to an instance together</p>
            <p>
              Teams can be invited to a role on an instance by using the invite
              code
            </p>
            <p>
              Once the invitation is accepted by the team admin, all users in
              the team ahve access to the instance
            </p>
            <label>Invite team members by email address:</label>
            <article className={styles.inviteInputs}>
              {this.state.invitees.map((email, i) => {
                return (
                  <Input
                    key={i}
                    name={i}
                    value={email}
                    onChange={this.addInviteField}
                  />
                )
              })}
            </article>
            <Button className={styles.addMember} onClick={this.addInvitee}>
              <i className="fa fa-user" />
              <p>Add Member</p>
            </Button>
          </section>
        </CardContent>
        <CardFooter>
          <Button disabled={this.state.submitted} onClick={this.handleSubmit}>
            <i className="fa fa-plus" />
            Create Team
          </Button>
        </CardFooter>
      </Card>
    )
  }
  addInvitee = () => {
    const invitees = this.state.invitees
    invitees.push('')
    this.setState({ invitees })
  }
  addInviteField = evt => {
    const invitees = this.state.invitees
    invitees.splice(Number(evt.target.name), 1, evt.target.value)
    this.setState({ invitees })
  }
  changeName = evt => {
    this.setState({ name: evt.target.value })
  }
  handleSubmit = evt => {
    this.props.dispatch(createTeam(this.state.name)).then(data => {
      this.props.dispatch({ type: 'CREATE_TEAM_SUCCESS', data })
    })
  }
}

export default CreateTeam

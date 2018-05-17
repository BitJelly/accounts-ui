import { Component } from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router'

import { notify } from '../../../../../../../shell/store/notifications'
import { zConfirm } from '../../../../../../../shell/store/confirm'
import {
  fetchSiteRoles,
  // createRole,
  removeRole,
  getRole
} from '../../../../store/sitesRoles'

// import Modal from '../../../../../../../shell/components/Modal'

import EditRole from './EditRole'
import RoleCreate from './components/RoleCreate'

import styles from './Roles.less'

const formatDate = date => {
  if (!date) {
    return ''
  }
  const newDate = new Date(date)
  return `${newDate.getMonth() +
    1}-${newDate.getDate()}-${newDate.getFullYear()}`
}

export default class Roles extends Component {
  constructor(props) {
    super(props)

    console.log('Roles: ', props)

    // this.state = {
    //   modalIsOpen: false,
    //   roleZUID: ''
    // }
  }
  render() {
    return (
      <Card>
        <CardHeader>
          <h2>
            <i className="fa fa-lock" aria-hidden="true" />
            &nbsp;Custom Site Roles
          </h2>
        </CardHeader>
        <CardContent>
          <div className={styles.Roles}>
            <Route
              exact
              path={`/properties/:siteZUID/role/:roleZUID`}
              component={EditRole}
            />

            {/* <Modal close={this.toggleModal} isOpen={this.state.modalIsOpen}>
              <EditRole props={{ ...this.props, roleZUID: this.state.roleZUID }} />
            </Modal> */}

            <p>
              By creating custom roles you can provide fine grained controls of
              what content specific users can access and what actions the can
              take.
            </p>
            <RoleCreate
              dispatch={this.props.dispatch}
              systemRoles={this.props.systemRoles}
            />
            <Divider />
            <div className={styles.currentRoles}>
              <header>
                <h3>Role</h3>
                <h3>Created</h3>
                <h3>Expires</h3>
              </header>
              <main>
                {this.props.siteRoles.map(role => {
                  return (
                    <article key={role.ZUID}>
                      <span>{role.name}</span>
                      <span>{formatDate(role.createdAt)}</span>
                      <span>{formatDate(role.expiry)}</span>
                      <span>
                        <ButtonGroup>
                          <AppLink
                            to={`${this.props.match.url}/role/${role.ZUID}`}
                          >
                            <i className="fa fa-pencil" aria-hidden="true" />&nbsp;Edit
                          </AppLink>
                          <Button onClick={() => this.handleRemove(role.ZUID)}>
                            <i className="fa fa-trash-o" aria-hidden="true" />Remove
                          </Button>
                        </ButtonGroup>
                      </span>
                    </article>
                  )
                })}
              </main>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
  // handleEdit = (roleZUID, siteZUID) => {
  //   this.setState({ roleZUID })
  //   this.toggleModal()
  // }
  handleRemove = ZUID => {
    this.props.dispatch(
      zConfirm({
        prompt: 'Are you certain you want to delete this role?',
        callback: result => {
          // remove role if user confirms
          if (result) {
            this.props.dispatch(removeRole(ZUID)).then(data => {
              this.props.dispatch(
                notify({
                  message: 'Role successfully removed',
                  type: 'success'
                })
              )
              // return this.props.dispatch(
              //   fetchSiteRoles(this.props.user.ZUID, this.props.siteZUID)
              // )
            })
          }
        }
      })
    )
  }
  // toggleModal = evt => {
  //   this.setState({
  //     modalIsOpen: !this.state.modalIsOpen
  //   })
  // }
}

// export default connect((state, props) => {
//   console.log('connect:Roles: ', state, props)
//
//   return {}
// })(Roles)

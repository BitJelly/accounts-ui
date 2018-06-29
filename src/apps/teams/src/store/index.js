import { request } from '../../../../util/request'
import { notify } from '../../../../shell/store/notifications'

export function teams(state = {}, action) {
  switch (action.type) {
    case 'FETCH_TEAMS_SUCCESS':
      // sorting teams
      const teams = Object.keys(action.data)
        .sort((prev, next) => {
          if (action.data[prev].createdAt < action.data[next].createdAt) {
            return 1
          }
          if (action.data[prev].createdAt > action.data[next].createdAt) {
            return -1
          }
          return 0
        })
        .reduce((acc, team) => {
          acc[action.data[team].ZUID] = action.data[team]
          return acc
        }, {})
      return { ...state, ...teams }

    case 'FETCH_TEAM_SUCCESS':
      // put the new team in the correct place
      const stateTeams = state
      stateTeams[action.ZUID] = action.team
      const sortedTeams = Object.keys(stateTeams)
        .sort((prev, next) => {
          if (stateTeams[prev].createdAt < stateTeams[next].createdAt) {
            return 1
          }
          if (stateTeams[prev].createdAt > stateTeams[next].createdAt) {
            return -1
          }
          return 0
        })
        .reduce((acc, team) => {
          acc[stateTeams[team].ZUID] = stateTeams[team]
          return acc
        }, {})
      return { ...sortedTeams }

    case 'REMOVE_TEAM_FROM_STATE':
      const removed = state
      delete removed[action.data.ZUID]
      return { ...removed }

    case 'FETCH_MEMBERS_TEAM_SUCCESS':
      return {
        ...state,
        [action.teamZUID]: {
          ...state[action.teamZUID],
          members: [...action.data]
        }
      }

    case 'FETCH_MEMBERS_PENDING_TEAM_SUCCESS':
      return {
        ...state,
        [action.teamZUID]: {
          ...state[action.teamZUID],
          members: [...state[action.teamZUID].members, ...action.data]
        }
      }

    case 'FETCH_INSTANCES_TEAM_SUCCESS':
      return {
        ...state,
        [action.teamZUID]: {
          ...state[action.teamZUID],
          instances: [...action.data]
        }
      }

    case 'REMOVE_TEAM_MEMBER':
      return {
        ...state,
        [action.teamZUID]: {
          ...state[action.teamZUID],
          members: state[action.teamZUID].members.filter(
            member => member.ZUID !== action.userZUID
          )
        }
      }

    case 'INVITING_TEAM_MEMBER_SUCCESS':
      return {
        ...state,
        [action.teamZUID]: {
          ...state[action.teamZUID],
          members: [
            ...state[action.teamZUID].members,
            {
              invitedByUserZUID: 'newUser',
              ZUID: 'new',
              inviteeEmail: action.inviteeEmail
            }
          ]
        }
      }
    case 'FETCHING_TEAMS_FAILURE':
    case 'FETCHING_TEAMS':
    case 'ACCEPT_TEAM_INVITE_SUCCESS':
    case 'CREATE_TEAM_SUCCESS':
    default:
      return state
  }
}

// sort teams
// const sortTeams = (state = {}, team) => {
//   stateTeams[action.ZUID] = action.team
//   const sortedTeams = Object.keys(stateTeams)
//     .sort((prev, next) => {
//       if (stateTeams[prev].createdAt < stateTeams[next].createdAt) {
//         return 1
//       }
//       if (stateTeams[prev].createdAt > stateTeams[next].createdAt) {
//         return -1
//       }
//       return 0
//     })
//     .reduce((acc, team) => {
//       acc[stateTeams[team].ZUID] = stateTeams[team]
//       return acc
//     }, {})
//   return { ...sortedTeams }
// }

// CRUD teams here

export const fetchTeams = userZUID => {
  return dispatch => {
    dispatch({ type: 'FETCHING_TEAMS' })
    return request(`${CONFIG.API_ACCOUNTS}/teams`)
      .then(res => {
        dispatch({ type: 'FETCH_TEAMS_SUCCESS', data: res.data })
        return res.data
      })
      .catch(err => {
        dispatch({ type: 'FETCHING_TEAMS_FAILURE', err })
        console.table(err)
        return err
      })
  }
}

export const fetchTeam = teamZUID => {
  return dispatch => {
    dispatch({ type: 'FETCHING_TEAM' })
    return request(`${CONFIG.API_ACCOUNTS}/teams/${teamZUID}`)
      .then(res => {
        dispatch({ type: 'FETCH_TEAM_SUCCESS', team: res.data })
        return res.data
      })
      .catch(err => {
        dispatch({ type: 'FETCHING_TEAM_FAILURE', err })
        console.table(err)
        return err
      })
  }
}

export const createTeam = (name, description) => {
  return dispatch => {
    dispatch({ type: 'CREATING_TEAM' })
    return request(`${CONFIG.API_ACCOUNTS}/teams`, {
      method: 'POST',
      json: true,
      body: {
        name,
        description
      }
    })
      .then(res => {
        dispatch({ type: 'FETCH_TEAM_SUCCESS', team: res.data })
        dispatch(
          notify({
            type: 'success',
            message: 'Created team successfully'
          })
        )
        return res.data
      })
      .catch(err => {
        dispatch({ type: 'CREATING_TEAM_FAILURE', err })
        console.table(err)
        return err
      })
  }
}

export const updateTeam = (teamZUID, Name, Description) => {
  // request to PUT with payload { Name: name }
  return dispatch => {
    dispatch({ type: 'UPDATING_TEAM' })
    return request(`${CONFIG.API_ACCOUNTS}/teams/${teamZUID}`, {
      method: 'PUT',
      json: true,
      body: {
        Name,
        Description
      }
    })
      .then(res => {
        dispatch({ type: 'UPDATING_TEAM_SUCCESS', data: res.data })
        dispatch(
          notify({
            type: 'success',
            message: 'Updated team name successfully'
          })
        )
        return res.data
      })
      .catch(err => {
        dispatch({ type: 'UPDATING_TEAM_FAILURE', err })
        dispatch(
          notify({
            type: 'error',
            message: `Update error, no update was made`
          })
        )
        console.table(err)
        return err
      })
  }
}

export const inviteMember = (teamZUID, inviteeEmail) => {
  // individual invite endpoint
  return dispatch => {
    dispatch({ type: 'INVITING_TEAM_MEMBER' })
    return request(`${CONFIG.API_ACCOUNTS}/teams/invites`, {
      method: 'POST',
      json: true,
      body: {
        teamZUID,
        inviteeEmail
      }
    })
      .then(res => {
        // this needs to add the member to the team
        dispatch({
          type: 'INVITING_TEAM_MEMBER_SUCCESS',
          data: res.data,
          inviteeEmail,
          teamZUID
        })
        dispatch(
          notify({
            type: 'success',
            message: `Invite sent`
          })
        )
        return res.data
      })
      .catch(err => {
        dispatch({ type: 'INVITING_TEAM_MEMBER_FAILURE', err })
        dispatch(
          notify({
            type: 'error',
            message: `Invite error, no invite was sent`
          })
        )
        console.table(err)
        return err
      })
  }
}

export const removeMember = (teamZUID, userZUID) => {
  return dispatch => {
    dispatch({ type: 'DELETING_TEAM_USER' })
    return request(
      `${CONFIG.API_ACCOUNTS}/teams/${teamZUID}/users/${userZUID}`,
      {
        method: 'DELETE'
      }
    )
      .then(res => {
        dispatch({ type: 'REMOVE_TEAM_FROM_STATE', data: res.data })
        return res.data
      })
      .catch(err => {
        dispatch({ type: 'DELETING_TEAM_USER_FAILURE', err })
        console.table(err)
        return err
      })
  }
}

export const deleteTeam = (teamZUID, Name) => {
  return dispatch => {
    dispatch({ type: 'DELETING_TEAM' })
    return request(`${CONFIG.API_ACCOUNTS}/teams/${teamZUID}`, {
      method: 'DELETE',
      json: true,
      body: {
        Name
      }
    })
      .then(res => {
        dispatch({ type: 'REMOVE_TEAM_FROM_STATE', data: { ZUID: teamZUID } })
        return res.data
      })
      .catch(err => {
        dispatch({ type: 'DELETING_TEAM_FAILURE', err })
        console.table(err)
        return err
      })
  }
}

export const getTeamPendingInvites = teamZUID => {
  return dispatch => {
    dispatch({ type: 'FETCH_MEMBERS_PENDING_TEAM' })
    return request(`${CONFIG.API_ACCOUNTS}/teams/${teamZUID}/users/pending`)
      .then(res => {
        dispatch({
          type: 'FETCH_MEMBERS_PENDING_TEAM_SUCCESS',
          data: res.data,
          teamZUID
        })
        return res.data
      })
      .catch(err => {
        dispatch({ type: 'FETCH_MEMBERS_PENDING_TEAM_FAILURE', err })
        console.table(err)
        return err
      })
  }
}

export const getTeamInstances = teamZUID => {
  return dispatch => {
    dispatch({ type: 'FETCH_INSTANCES_TEAM' })
    return request(`${CONFIG.API_ACCOUNTS}/teams/${teamZUID}/instances`)
      .then(res => {
        dispatch({
          type: 'FETCH_INSTANCES_TEAM_SUCCESS',
          data: res.data,
          teamZUID
        })
        return res.data
      })
      .catch(err => {
        dispatch({ type: 'FETCH_INSTANCES_TEAM_FAILURE', err })
        console.table(err)
        return err
      })
  }
}

export const getTeamMembers = teamZUID => {
  return dispatch => {
    dispatch({ type: 'FETCH_MEMBERS_TEAM' })
    return request(`${CONFIG.API_ACCOUNTS}/teams/${teamZUID}/users`)
      .then(res => {
        dispatch({
          type: 'FETCH_MEMBERS_TEAM_SUCCESS',
          data: res.data,
          teamZUID
        })
        return res.data
      })
      .catch(err => {
        dispatch({ type: 'FETCH_MEMBERS_TEAM_FAILURE', err })
        console.table(err)
        return err
      })
  }
}

export const getUserTeamInvites = () => {
  return dispatch => {
    dispatch({ type: 'FETCHING_INVITED_TEAMS' })
    return request(`${CONFIG.API_ACCOUNTS}/teams/invites`)
      .then(res => {
        dispatch({ type: 'FETCH_TEAMS_SUCCESS', data: res.data })
        return res.data
      })
      .catch(err => {
        dispatch({ type: 'FETCHING_INVITED_TEAMS_FAILURE', err })
        console.table(err)
        return err
      })
  }
}

export const modifyUser = (teamZUID, userZUID, admin) => {
  return dispatch => {
    dispatch({ type: 'MODIFYING_USER' })
    return request(
      `${CONFIG.API_ACCOUNTS}/teams/${teamZUID}/users/${userZUID}`,
      {
        method: 'PUT',
        json: true,
        body: { admin }
      }
    ).then(data => {
      dispatch({ type: 'MODIFYING_USER_SUCCESS', data, teamZUID, userZUID })
      return data.data
    })
  }
}

export const handleTeamInvite = (inviteZUID, teamZUID, action) => {
  return dispatch => {
    dispatch({ type: 'RESPONDING_TO_INVITE' })
    return request(
      `${CONFIG.API_ACCOUNTS}/teams/invites/${inviteZUID}?action=${action}`,
      {
        method: 'PUT'
      }
    )
      .then(res => {
        dispatch({ type: 'RESPONDING_TO_INVITE_SUCCESS' })
        if (action === 'decline' || action === 'cancel') {
          // remove the teamZUID from state if declining invite
          if (action === 'decline') {
            dispatch({
              type: 'REMOVE_TEAM_FROM_STATE',
              data: { ZUID: teamZUID }
            })
          }
          dispatch(
            notify({
              type: 'success',
              message: 'Invite has been removed'
            })
          )
        } else {
          dispatch({
            type: 'REMOVE_TEAM_FROM_STATE',
            data: { ZUID: teamZUID }
          })
          // TODO: add team to state (awaiting new invite object)
          dispatch(
            notify({
              type: 'success',
              message: 'Invite accepted'
            })
          )
        }
        return res.data
      })
      .catch(err => {
        dispatch({ type: 'RESPONDING_TO_INVITE_FAILURE', err })
        dispatch(
          notify({
            type: 'error',
            message: 'Invite error'
          })
        )
        console.table(err)
        return err
      })
  }
}

import { request } from '../../../../util/request'


export function sitesUsers(state = {}, action) {
  switch (action.type) {
    case 'FETCHING_USERS':
      return state

    case 'FETCH_USERS_SUCCESS':
      return {
        ...state, // Previous sites
        [action.siteZUID]: {
          ...state[action.siteZUID], // Previous site users
          ...action.users // new site users
        }
      }

    case 'FETCH_USERS_ERROR':
      return state

    case 'FETCHING_USERS_PENDING':
      return state

    case 'DELETE_USER':
      return { ...state, [action.siteZUID]: action.users }

    case 'FETCH_USERS_PENDING_SUCCESS':
      return {
        ...state,
        [action.siteZUID]: { ...state[action.siteZUID], ...action.users }
      }
    case 'FETCH_USERS_PENDING_ERROR':
      return state

    default:
      return state
  }
}

export const fetchSiteUsers = siteZUID => {
  return dispatch => {
    dispatch({
      type: 'FETCHING_USERS'
    })
    return request(
      `${CONFIG.API_ACCOUNTS}/instances/${siteZUID}/users?getRoles=true`
    )
      .then(users => {
        dispatch({
          type: 'FETCH_USERS_SUCCESS',
          siteZUID,
          users: users.data.reduce((acc, user) => {
            acc[user.ZUID] = user
            return acc
          }, {})
        })
      })
      .catch(err => {
        console.error(err)
        dispatch({
          type: 'FETCH_USERS_ERROR',
          err
        })
      })
  }
}

export const fetchSiteUsersPending = siteZUID => {
  return dispatch => {
    dispatch({
      type: 'FETCHING_USERS_PENDING'
    })
    return request(`${CONFIG.API_ACCOUNTS}/instances/${siteZUID}/users/pending`)
      .then(users => {
        dispatch({
          type: 'FETCH_USERS_PENDING_SUCCESS',
          siteZUID,
          users: users.data.reduce((acc, user) => {
            acc[user.inviteZUID] = user
            acc[user.inviteZUID].pending = true
            return acc
          }, {})
        })
      })
      .catch(err => {
        console.error(err)
        dispatch({
          type: 'FETCH_USERS_PENDING_ERROR',
          err
        })
      })
  }
}

export const removeSiteUser = (userZUID, siteZUID) => {
  return (dispatch, getState) => {
    let users = getState().sitesUsers[siteZUID]
    delete users[userZUID]
    return dispatch({
      type: 'DELETE_USER',
      users,
      siteZUID
    })
  }
}

export const updateSiteUserRole = (userZUID, oldRoleZUID, newRoleZUID) => {
  return request(
    `${CONFIG.API_ACCOUNTS}/users/${userZUID}/roles/${oldRoleZUID}`,
    {
      method: 'PUT',
      json: true,
      body: {
        roleZUID: newRoleZUID
      }
    }
  )
    .then(data => data)
    .catch(err => {
      console.log(err)
      return er
    })
}

import { request } from '../../util/request'
import { notify } from '../store/notifications'

export function user(
  state = {
    prefs: {
      favorite_sites: []
    }
  },
  action
) {
  switch (action.type) {
    case 'FETCH_USER_SUCCESS':
      // console.log('Last login for User: ', action.user.lastLogin)
      return {
        ...state,
        ...action.user
      }
    case 'FETCH_AUTH_SUCCESS':
      return {
        ...state,
        ZUID: action.ZUID
      }
    case 'FETCH_VERIFY_SUCCESS':
      return {
        ...state,
        ZUID: action.ZUID
      }

    case 'UPDATE_USER_PROFILE':
      return { ...state, ...action.payload }

    case 'USER_INVITED':
      return { ...state, ...action.invite }

    case 'FAVORITE_SITE':
      const favs = state.prefs.favorite_sites || []

      if (action.action === 'ADD') {
        favs.push(action.ZUID)
      } else if (action.action === 'REMOVE') {
        favs.splice(favs.indexOf(action.ZUID), 1)
      }

      return {
        ...state,
        prefs: {
          ...state.prefs,
          favorite_sites: favs
        }
      }

    case 'INSTANCE_LAYOUT':
      return {
        ...state,
        prefs: {
          ...state.prefs,
          instance_layout: action.layout
        }
      }
    case 'DEV_PREFS':
      return {
        ...state,
        prefs: {
          ...state.prefs,
          hasSelectedDev: 1,
          devOptions: action.payload
        }
      }

    case 'FETCH_USER_EMAILS_SUCCESS':
      return {
        ...state,
        emails: action.emails
      }

    default:
      return state
  }
}

export function fetchUser(ZUID) {
  return dispatch => {
    dispatch({
      type: 'FETCHING_USER'
    })
    return request(`${CONFIG.API_ACCOUNTS}/users/${ZUID}`)
      .then(user => {
        if (user.data) {
          // Parse user data response
          user.data.unverifiedEmails = user.data.unverifiedEmails
            ? user.data.unverifiedEmails.split(',')
            : []
          user.data.verifiedEmails = user.data.verifiedEmails
            ? user.data.verifiedEmails.split(',')
            : []
          user.data.prefs = JSON.parse(user.data.prefs || '{}')
          user.data.prefs.favorite_sites = user.data.prefs.favorite_sites || []

          dispatch({
            type: 'FETCH_USER_SUCCESS',
            user: user.data
          })
        } else {
          throw new Error('API returned missing user data')
        }
      })
      .catch(err => {
        console.table(err)
        dispatch({
          type: 'FETCH_USER_ERROR',
          err
        })
      })
  }
}

export function update2fa(add, payload) {
  if (add) {
    // TODO fix. there should not be a NOOP here
    // start process of adding 2fa
    // payload will have user info
    // have to get authy user ID from somehwere
  } else {
    // call db to remove 2fa and do whatever cleanup is also required
    // PUT update user     "authyEnabled": "false"
    return (dispatch, getState) => {
      dispatch({
        type: 'SAVING_PROFILE'
      })
      const userZUID = getState().user.ZUID
      return request(`${CONFIG.API_ACCOUNTS}/users/${userZUID}`, {
        method: 'PUT',
        json: true,
        body: {
          authyEnabled: false
        }
      })
        .then(data => {
          dispatch({ type: 'SAVING_PROFILE_SUCCESS' })
          return data
        })
        .catch(err => {
          console.table(err)
          dispatch({ type: 'SAVING_PROFILE_ERROR' })
          throw err
        })
    }
  }
}

export function updateProfile(payload) {
  return {
    type: 'UPDATE_USER_PROFILE',
    payload
  }
}

export function saveProfile() {
  return (dispatch, getState) => {
    dispatch({
      type: 'SAVING_PROFILE'
    })

    const user = getState().user
    return request(`${CONFIG.API_ACCOUNTS}/users/${user.ZUID}`, {
      method: 'PUT',
      json: true,
      body: {
        firstName: user.firstName,
        lastName: user.lastName,
        prefs: JSON.stringify(user.prefs)
      }
    })
      .then(data => {
        dispatch({ type: 'SAVING_PROFILE_SUCCESS' })
        return data
      })
      .catch(err => {
        console.table(err)
        dispatch({ type: 'SAVING_PROFILE_ERROR' })
        throw err
      })
  }
}

export function favoriteSite(ZUID, action) {
  return {
    type: 'FAVORITE_SITE',
    ZUID,
    action
  }
}

export function fetchUserEmails() {
  return dispatch => {
    return request(`${CONFIG.API_ACCOUNTS}/users/emails`).then(data => {
      dispatch({
        type: 'FETCH_USER_EMAILS_SUCCESS',
        emails: data.data
      })
    })
  }
}

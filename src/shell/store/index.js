import thunkMiddleware from 'redux-thunk'
import {createLogger} from 'redux-logger'
import {createStore, combineReducers, applyMiddleware} from 'redux'

import {user} from './user'
import {auth} from './auth'
import {sites} from '../../apps/properties/src/store'
import {settings} from '../../apps/settings/src/store'

const loggerMiddleware = createLogger({
  collapsed: true,
  diff: true
})

// const rootReducer = combineReducers({user, sites})
const rootReducer = combineReducers({
  auth,
  user,
  sites,
  settings
})

export const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
)

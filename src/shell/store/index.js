import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import createDebounce from 'redux-debounced'

import { settings } from './settings'
import { user } from './user'
import { auth } from './auth'
import { notifications } from './notifications'
import { modal } from './modal'
import { propertiesReducers } from '../../apps/properties/src/store'

const loggerMiddleware = createLogger({
  collapsed: true,
  diff: true
})

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    state = {}
  }
  return appReducer(state, action)
}

const appReducer = combineReducers({
  ...propertiesReducers,
  settings,
  auth,
  user,
  modal,
  notifications
})

export const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(
    createDebounce(),
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
)

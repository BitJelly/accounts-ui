import { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'

import Login from '../Login'
import Signup from '../Signup'
import ResetPassword from '../ResetPassword'
import VerifyEmail from '../VerifyEmail'

import AppHeader from '../../components/AppHeader'
import styles from './App.less'
import { getUser } from '../../store/user'

// class PrivateRoute extends Component {
//   render() {
//     return this.props.loggedIn ? this.props.children : null
//   }
// }

class Shell extends Component {
  componentDidMount() {
    // TODO how do I get the id?
    this.props.dispatch(getUser(this.props.user.zuid))
  }
  render() {
    return (
      <section className={styles.AppShell}>
        <AppHeader user={this.props.user} dispatch={this.props.dispatch} />
        <section className={styles.AppMain}>
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/properties" component={Properties} />
            <Route path="/account" component={Account} />
            <Route path="/messages" component={Messages} />
            <Redirect from="/" to="/properties" />
            {/* TODO: handle no match */}
          </Switch>
        </section>
      </section>
    )
  }
}
let AppShell = connect(state => state)(Shell)

class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          {/* <PrivateRoute loggedIn={this.props.auth.valid}>
            <Route path="/" component={AppShell} />
          </PrivateRoute> */}
          {this.props.auth.valid ?
            <Route path="/" component={AppShell} />
            : null}
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/reset-password" component={ResetPassword} />
          <Route path="/verify-email" component={VerifyEmail} />
          <Redirect to="/login" />
        </Switch>
      </div>
    )
  }
}
export default connect(state => state)(App)

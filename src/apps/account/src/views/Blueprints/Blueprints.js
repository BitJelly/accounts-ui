import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'

import BlueprintEdit from './components/BlueprintEdit'
import SelectBlueprint from './components/SelectBlueprint'

import { postNewBlueprint } from '../../../../properties/src/store/blueprints'

import styles from './Blueprints.less'

class Blueprints extends Component {
  state = {
    selected: ''
  }
  render() {
    return (
      <section className={styles.Blueprints}>
        <SelectBlueprint
          className={styles.List}
          blueprints={this.props.userBlueprints}
          selection={this.state.selection}
          handleSelect={this.handleSelect}
        />
        <BlueprintEdit
          blueprint={this.state.selected}
        />
      </section>
    )
  }
  handleSelect = blueprint => {
    console.log(blueprint)
    this.setState({ selected: this.props.blueprints[blueprint] })
  }
}

const mapStateToProps = state => {
  const blueprints = state.blueprints
  const userZUID = state.user.ZUID

  const userBlueprints = Object.keys(blueprints).reduce((acc, bp) => {
    if (state.blueprints[bp].createdByUserZUID === userZUID) {
      acc.push(blueprints[bp])
    }
    return acc
  }, [])

  return {
    blueprints,
    userBlueprints,
    userZUID
  }
}

export default withRouter(connect(mapStateToProps)(Blueprints))

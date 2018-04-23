import React, { Component } from 'react'
import { connect } from 'react-redux'

import styles from './Confirm.less'

const Confirm = props => {
  return (
    (props.isOpen && (
      <section className={styles.Confirm}>
        <h1>{props.prompt}</h1>
        <ButtonGroup>
          <Button
            onClick={() => props.dispatch({ type: 'REMOVE_CONFIRM' })}
            text="Continue"
          />
          <Button
            onClick={() => props.dispatch({ type: 'REMOVE_CONFIRM' })}
            text="Cancel"
          />
        </ButtonGroup>
      </section>
    )) ||
    null
  )
}

export default connect(state => state.confirm)(Confirm)

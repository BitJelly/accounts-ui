import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import styles from './WebsiteCreate.less'

class WebsiteCreate extends Component {
  render() {
    return (
      <article className={styles.WebsiteCreate}>
        <header>
          <h1 className={styles.name}>Welcome to Zesty.io</h1>
        </header>
        <main className={styles.WebsiteManage}>
          <p>
            Get started by creating your first Zesty web instance in a few easy
            steps.
          </p>
          <p>
            <em>
              Instances are a way for you to categorize content by a domain.
              This could either be a website or an API to serve managed content.
            </em>
          </p>
        </main>
        <footer>
          <Link to="/instances/create" className={styles.Button}>
            <Button type="save">
              <i className="fa fa-plus" aria-hidden="true" />
              {Object.keys(this.props.sites).length
                ? 'Create An Instance'
                : 'Create Your First Instance'}
            </Button>
          </Link>
        </footer>
      </article>
    )
  }
}

export default connect(state => state)(WebsiteCreate)

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import styles from './WebsiteCard.less'

import config from '../../../../../shell/config'

import { Line } from 'react-chartjs-2'

class WebsiteCard extends PureComponent {
  render() {
    return (
      <article className={styles.WebsiteCard}>
        <header>
          <h1>{this.props.site.name}</h1>
          {this.props.site.domain ? (
            <Url target="_blank" href={`http://${this.props.site.domain}`}>
              <i className="fa fa-globe" aria-hidden="true" />&nbsp;{
                this.props.site.domain
              }
            </Url>
          ) : (
            <Link to={`/properties/${this.props.site.ZUID}`}>
              <i className="fa fa-plus" aria-hidden="true" />
              &nbsp;Set Domain
            </Link>
          )}
        </header>
        <main className={styles.WebsiteManage}>
          <Url
            className={styles.preview}
            target="_blank"
            title={`Preview  ${this.props.site.name}`}
            href={`${config.PREVIEW_URL_PROTOCOL}${
              this.props.site.randomHashID
            }${config.PREVIEW_URL}`}
          > {
            this.props.site.screenshotUrl ?
            <img src={this.props.site.screenshotUrl} />
            : 
            <i className={cx(styles.icon, 'fa fa-globe')} aria-hidden="true" />
          }
            
          </Url>
        </main>
        <footer>
          <ButtonGroup className={styles.controls}>
            <Url
              className={styles.manager}
              target="_blank"
              href={`${config.MANAGER_URL_PROTOCOL}${
                this.props.site.randomHashID
              }${config.MANAGER_URL}`}
            >
              <i className="fa fa-external-link" aria-hidden="true" /> Site
              Manager
            </Url>
            <Link to={`/properties/${this.props.site.ZUID}`}>
              <i
                className={cx(styles.settings, 'fa fa-cog')}
                aria-hidden="true"
              />
            </Link>
          </ButtonGroup>
        </footer>
      </article>
    )
  }
}

export default connect(state => state)(WebsiteCard)

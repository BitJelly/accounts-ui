import React from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import styles from './WebsiteCard.less'

import config from '../../../../../shell/config'

import { Line } from 'react-chartjs-2'

const WebsiteCard = props => {
  const { site } = props
  return (
    <Card className={styles.WebsiteCard}>
      <CardHeader className={styles.CardHeader}>
        <h1>{site.name}</h1>
        {site.domain ? (
          <Url target="_blank" href={`http://${site.domain}`}>
            <i className="fa fa-globe" aria-hidden="true" />&nbsp;{site.domain}
          </Url>
        ) : (
          <AppLink to={`/properties/${site.ZUID}`}>
            <i className="fa fa-plus" aria-hidden="true" />
            &nbsp;Set Domain
          </AppLink>
        )}
      </CardHeader>
      <CardContent className={styles.CardContent}>
        <Url
          className={styles.preview}
          target="_blank"
          title={`Preview  ${site.name}`}
          href={`${config.PREVIEW_URL_PROTOCOL}${site.randomHashID}${
            config.PREVIEW_URL
          }`}
        >
          {site.screenshotUrl ? (
            <img src={site.screenshotUrl} />
          ) : (
            <i className={cx(styles.icon, 'fa fa-globe')} aria-hidden="true" />
          )}
        </Url>
      </CardContent>
      <CardFooter className={styles.CardFooter}>
        <ButtonGroup className={styles.controls}>
          <Url
            className={styles.manager}
            target="_blank"
            href={`${config.MANAGER_URL_PROTOCOL}${site.randomHashID}${
              config.MANAGER_URL
            }`}
          >
            <i className="fa fa-external-link" aria-hidden="true" /> Site
            Manager
          </Url>
          <AppLink to={`/properties/${site.ZUID}`}>
            <i
              className={cx(styles.settings, 'fa fa-cog')}
              aria-hidden="true"
            />
          </AppLink>
        </ButtonGroup>
      </CardFooter>
    </Card>
  )
}

export default WebsiteCard

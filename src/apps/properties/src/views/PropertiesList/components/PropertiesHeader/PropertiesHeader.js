import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import debounce from '../../../../../../../util/debounce'

import styles from './PropertiesHeader.less'

import {
  filter,
  filterEcosystem,
  sortSites
} from '../../../../store/sitesFiltered'
import { saveProfile } from '../../../../../../../shell/store/user'

class PropertiesHeader extends Component {
  state = {
    eco: false,
    sort: 'name',
    delay: null
  }
  render() {
    return (
      <header className={styles.PropertiesHeader}>
        <div className={styles.Actions}>
          {this.props.ecosystems.length ? (
            <Select className={styles.Ecosystem} onSelect={this.filterByEco}>
              <Option key="default" value="" text="All Instances" />
              {this.props.ecosystems.map(eco => {
                return <Option key={eco.id} value={eco.id} text={eco.name} />
              })}
            </Select>
          ) : null}

          <Search
            className={styles.Search}
            placeholder="Search by instance name or domain"
            onKeyUp={evt => {
              evt.persist()
              return this.onSearch(evt)
            }}
            onClick={evt => {
              evt.persist()
              return this.onSearch(evt)
            }}
          />

          <ButtonGroup className={styles.Sort}>
            <Button
              title="Sort alphabetically by name"
              disabled={this.state.sort === 'name'}
              onClick={() => {
                this.setState({ sort: 'name' })
                return this.sort('name')
              }}>
              <i className={`fa fa-sort-alpha-asc`} />
            </Button>
            <Button
              title="Sort by created date"
              disabled={this.state.sort === 'date'}
              onClick={() => {
                this.setState({ sort: 'date' })
                return this.sort('createdAt')
              }}>
              <i className={`fa fa-calendar-o`} />
            </Button>
          </ButtonGroup>

          <ButtonGroup className={styles.Layout}>
            <Button
              title="View instances as a grid"
              disabled={this.props.layout === 'grid'}
              onClick={() => {
                this.props.dispatch({
                  type: 'INSTANCE_LAYOUT',
                  layout: 'grid'
                })
                this.props.dispatch(saveProfile())
              }}>
              <i className={`fa fa-th`} />
            </Button>
            <Button
              title="View instances as a list"
              disabled={this.props.layout === 'list'}
              onClick={() => {
                this.props.dispatch({
                  type: 'INSTANCE_LAYOUT',
                  layout: 'list'
                })
                this.props.dispatch(saveProfile())
              }}>
              <i className={`fa fa-th-list`} />
            </Button>
          </ButtonGroup>

          <Button className={styles.Create} onClick={this.onCreateSite}>
            <i className="fa fa-plus" />Create Instance
          </Button>
        </div>
      </header>
    )
  }

  onSearch = debounce(evt => {
    if (this.state.eco) {
      this.props.dispatch(filterEcosystem(evt.target.value, this.state.eco))
    } else {
      this.props.dispatch(filter(evt.target.value))
    }
  }, 300)

  onCreateSite = evt => {
    evt.preventDefault()
    this.props.history.push('/instances/create')
  }

  filterByEco = evt => {
    if (evt.target.dataset.value === '') {
      this.setState({ eco: false })
      return this.props.dispatch(filter(''))
    }
    this.setState({ eco: evt.target.dataset.value })
    this.props.dispatch(filter(Number(evt.target.dataset.value)))
  }

  sort = by => {
    this.props.dispatch(sortSites(by))
  }
}

export default withRouter(connect(state => state)(PropertiesHeader))

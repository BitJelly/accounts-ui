import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import styles from './PropertiesHeader.less'

import { filter, filterEcosystem, sortSites } from '../../store/sitesFiltered'

class PropertiesHeader extends Component {
  state = {
    eco: false,
    sort: 'name'
  }
  render() {
    return (
      <header className={styles.PropertiesHeader}>
        <div className={styles.Actions}>
          {this.props.ecosystems.length ? (
            this.props.ecosystems.length === 1 ? (
              <Select className={styles.Ecosystem} onSelect={this.filterByEco}>
                {this.props.ecosystems.map(eco => {
                  return <Option key={eco.id} value={eco.id} text={eco.name} />
                })}
              </Select>
            ) : (
              <Select className={styles.Ecosystem} onSelect={this.filterByEco}>
                <Option key="default" value="" text="Select Ecosystem" />
                {this.props.ecosystems.map(eco => {
                  return <Option key={eco.id} value={eco.id} text={eco.name} />
                })}
              </Select>
            )
          ) : null}

          <ButtonGroup>
            <Button
              disabled={this.state.sort === 'date'}
              onClick={() => {
                this.setState({ sort: 'date' })
                return this.sort('createdAt')
              }}>
              <i className={`fa fa-calendar-o`} />
            </Button>
            <Button
              disabled={this.state.sort === 'name'}
              onClick={() => {
                this.setState({ sort: 'name' })
                return this.sort('name')
              }}>
              <i className={`fa fa-sort-alpha-asc`} />
            </Button>
          </ButtonGroup>

          <Search
            className={styles.Search}
            placeholder="Search by instance name or domain"
            onClick={this.onSearch}
            onKeyUp={this.onSearch}
          />

          <Button className={styles.Create} onClick={this.onCreateSite}>
            <i className="fa fa-plus" />Create Instance
          </Button>
        </div>
      </header>
    )
  }

  onSearch = evt => {
    if (this.state.eco) {
      this.props.dispatch(filterEcosystem(evt.target.value, this.state.eco))
    } else {
      this.props.dispatch(filter(evt.target.value))
    }
  }

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

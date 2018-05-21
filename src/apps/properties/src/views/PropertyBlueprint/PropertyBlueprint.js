import { Component } from 'React'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'

import styles from './PropertyBlueprint.less'

import qs from 'qs'
import config from '../../../../../shell/config'
import { updateSite, fetchSite } from '../../store/sites'
import { fetchBlueprints } from '../../store/blueprints'

class PropertyBlueprint extends Component {
  state = {
    selected: ''
  }
  componentDidMount() {
    this.props.dispatch(fetchBlueprints())
  }
  render() {
    return (
      <React.Fragment>
        {Object.keys(this.props.blueprints).length ? (
          <section className={styles.BlueprintView}>
            <header>
              <h1>Select a Blueprint</h1>
              <AppLink type="cancel" to={`/properties`}>
                <i className="fa fa-ban" aria-hidden="true" />&nbsp;Cancel
              </AppLink>
            </header>
            <p className={styles.description}>
              Blueprints are the starting point of your new website. They can
              come pre-built with CSS, HTML, JavaScript, Pages, and Datasets.
              You can find a selection of common community design frameworks
              configured for Zesty.io.
            </p>
            <main className={styles.Blueprints}>
              {this.props.blueprints.map(blueprint => {
                return (
                  <Card key={blueprint.ID} className={styles.Blueprint}>
                    <CardHeader>
                      <h4>{blueprint.name}</h4>
                    </CardHeader>
                    <CardContent>
                      {blueprint.coverImage === '' ? (
                        <div className={styles.noimage} aria-hidden="true">
                          <i className="fa fa-file-code-o" aria-hidden="true" />
                        </div>
                      ) : (
                        <img src={blueprint.coverImage} alt="bp img broked" />
                      )}
                      <p>{blueprint.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        disabled={this.state.selected == blueprint.ID}
                        onClick={() => this.handleSelect(blueprint.ID)}
                      >
                        <i className="fa fa-file-code-o" aria-hidden="true" />
                        Select Blueprint
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </main>
          </section>
        ) : (
          <div className={styles.Loading}>
            <h2>Loading Blueprints</h2>
            <Loader />
          </div>
        )}
      </React.Fragment>
    )
  }
  handleSelect = id => {
    this.setState({ selected: id })
    this.props
      .dispatch(updateSite(this.props.siteZUID, { blueprintID: id }))
      .then(data => {
        if (qs.parse(window.location.search.substr(1)).randomHashID) {
          window
            .open(
              `${config.MANAGER_URL_PROTOCOL}${
                qs.parse(window.location.search.substr(1)).randomHashID
              }${config.MANAGER_URL}`,
              '_blank'
            )
            .focus()
        } else {
          // re-fetch sites before the redirect
          this.props.dispatch(fetchSite(data.data.ZUID)).then(date => {
            return this.props.history.push(`/properties/${data.data.ZUID}`)
          })
        }
      })
  }
}

export default withRouter(
  connect((state, ownProps) => {
    const blueprints = Object.keys(state.blueprints)
      .reduce((acc, key) => {
        acc.push(state.blueprints[key])
        return acc
      }, [])
      .filter(blueprint => !blueprint.trashed)

    return {
      siteZUID: ownProps.match.params.zuid,
      blueprints
    }
  })(PropertyBlueprint)
)

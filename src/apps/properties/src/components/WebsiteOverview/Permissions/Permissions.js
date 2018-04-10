import React, { Component } from "react";
import { connect } from "react-redux";

import EditRole from "./EditRole";
import { notify } from "../../../../../../shell/store/notifications";
import {
  createRole,
  changeCurrentRole,
  removeRole
} from "../../../store/sitesPermissions";

import { fetchSiteRoles } from "../../../store/sitesRoles";

import styles from "./Permissions.less";

const formatDate = date => {
  if (!date) {
    return "";
  }
  const newDate = new Date(date);
  return `${newDate.getMonth() + 1}-${newDate.getDate()}-${newDate.getFullYear()}`;
};

class Permissions extends Component {
  constructor(props) {
    super()
    this.state = {
      submitted: false
    }
  }
  onChange = evt => {
    this.props.dispatch({
      type: "UPDATE_PERMISSIONS",
      payload: {
        [evt.target.name]: evt.target.value
      }
    });
  };
  handleCreate = evt => {
    evt.preventDefault();
    if (
      Object.keys(this.props.sitesPermissions).includes("name") &&
      Object.keys(this.props.sitesPermissions).includes("systemRoleZUID")
    ) {
      this.setState({ submitted: !this.state.submitted})
      this.props
        .dispatch(createRole(this.props.siteZUID, this.props.sitesPermissions))
        .then(data => {
      this.setState({ submitted: !this.state.submitted})          
          this.props.dispatch({
            type: "NEW_MODAL",
            component: EditRole,
            props: {
              siteZUID: this.props.siteZUID
            }
          });
          return this.props.dispatch(
            fetchSiteRoles(this.props.user.ZUID, this.props.siteZUID)
          );
        });
    } else {
      this.props.dispatch(
        notify({
          message: "You must include a name to create a new role.",
          type: "error"
        })
      );
    }
  };

  handleEdit = ZUID => {
    this.props.dispatch(changeCurrentRole(ZUID));
    this.props.dispatch({
      type: "NEW_MODAL",
      component: EditRole,
      props: {
        siteZUID: this.props.siteZUID
      }
    });
  };

  handleRemove = ZUID => {
    if (!confirm("Are you certain you want to delete this role?")) {
      return null;
    } else {
      return this.props.dispatch(removeRole(ZUID)).then(data => {
        this.props.dispatch(
          notify({
            message: "Role successfully removed",
            type: "success"
          })
        );
        return this.props.dispatch(
          fetchSiteRoles(this.props.user.ZUID, this.props.siteZUID)
        );
      });
    }
  };
  render() {
    return (
      <div className={styles.permissionsWrapper}>
        <form className={styles.formGrid}>
          <span className={styles.label}>
            <label>Label</label>
            <Input type="text" name="name" onChange={this.onChange} />
          </span>
          <span className={styles.base}>
            <label>Base Role</label>
            <select name="systemRoleZUID" onChange={this.onChange}>
              <option value="31-71cfc74-s30">SEO</option>
              <option value="31-71cfc74-p0bl1shr">Publisher</option>
              <option value="31-71cfc74-d3v3l0p3r">Developer</option>
              <option value="31-71cfc74-c0ntr1b0t0r">Contributor</option>
              <option value="31-71cfc74-4dm13">Admin</option>
              <option value="31-71cfc74-0wn3r">Owner</option>
            </select>
          </span>
          <span className={styles.expires}>
            <label>Exipres(optional)</label>
            <Input type="date" name="expiry" onChange={this.onChange} />
          </span>
          <Button
            className={styles.createButton}
            onClick={this.handleCreate}
            disabled={this.state.submitted}
          >
            {this.state.submitted
              ? "Creating Role"
              : "Create Role"}
          </Button>
        </form>
        <div className={styles.currentRoles}>
          <header>
            <h3>Role</h3>
            <h3>Created</h3>
            <h3>Expires</h3>
          </header>
          <main>
            {this.props.sitesRoles[this.props.siteZUID] instanceof Object &&
              Object.keys(this.props.sitesRoles[this.props.siteZUID]).map((ZUID, i) => {
                return (
                  <article key={i}>
                    <span>{this.props.sitesRoles[this.props.siteZUID][ZUID].name} </span>
                    <span>{formatDate(this.props.sitesRoles[this.props.siteZUID][ZUID].createdAt)} </span>
                    <span>{formatDate(this.props.sitesRoles[this.props.siteZUID][ZUID].expiry)} </span>
                    <span>
                      <ButtonGroup>
                        <Button
                          text="Edit"
                          onClick={() => this.handleEdit(ZUID)}
                        />
                        <Button
                          text="Remove"
                          onClick={() => this.handleRemove(ZUID)}
                        />
                      </ButtonGroup>
                    </span>
                  </article>
                );
              })}
          </main>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  // likely need to fetch site specific permissions
  return state;
};

export default connect(mapStateToProps)(Permissions);

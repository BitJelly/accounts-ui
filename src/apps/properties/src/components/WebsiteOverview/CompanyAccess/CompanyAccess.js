import React, { Component } from "react";
import { connect } from "react-redux";

import styles from "./CompanyAccess.less";

class CompanyAccess extends Component {
  render() {
    return (
      <div className={styles.companyAccess}>
        <div className={styles.invite}>
          <Select
            name="companyAccess"
            selection={{
              value: "Company",
              html: '<option value="Company">Company</option>'
            }}
            options={[
              {
                value: "company",
                html: '<option value="Company">Company</option>'
              },
              {
                value: "Company2",
                html: '<option value="Company2">Company2</option>'
              }
            ]}
          />
          <Button name="companyAccessSubmit">Grant Access</Button>
        </div>
        <div className={styles.companyTable}>
        <header>
          <h3>#</h3>
          <h3>Company</h3>
          <h3>Contact</h3>
          <h3>Role</h3>
        </header>
        <main>
          {Array.isArray(this.props.sitesCompanies) ? (
            this.props.sitesCompanies.map((company, i) => {
              return (
                <article key={i}>
                  <span>{i}</span>
                  <span>{company.Name}</span>
                  <span>{company.MainContactEmail}</span>
                  <span>{company.Featured}</span>
                </article>
              );
            })
          ) : (
            <p>loading</p>
          )}
        </main>
        </div>
      </div>
    );
  }
}

export default connect(state => state)(CompanyAccess);

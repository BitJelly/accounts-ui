import React from "react";

import Profile from "./Profile";
import Email from "./Email";
import Preferences from "./Preferences";

import styles from "./Account.less";

const Account = () => {
  return (
    <div className={styles.Account}>
      <h1 className={styles.title}>Profile</h1>
      <Profile />
      <h1 className={styles.title}>Emails</h1>
      <Email />
      <h1 className={styles.title}>Preferences</h1>
      <Preferences />
    </div>
  );
};

export default Account;

import { Outlet, Link } from "react-router-dom";
import React from "react";
import styles from "../DashboardLayout/AuthLayout.module.css";

const AuthLayout = () => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <img
          src="src/assests/image.png"
          alt="Space background"
          className={styles.backgroundImage}
        />
        <div className={styles.overlay}></div>
        <div className={styles.logo}>
          <img src="src/assests/logo.png" alt="Logo" />
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.header}>
          <Link to="/signup" className={styles.signupBtn}>
            SignUp
          </Link>
          <Link to="/login" className={styles.loginBtn}>
            Login
          </Link>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;

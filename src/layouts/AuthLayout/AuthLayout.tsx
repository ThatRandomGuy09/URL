import { Outlet, Link } from "react-router-dom";
import React from "react";
import styles from "../DashboardLayout/AuthLayout.module.css";

const AuthLayout = () => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <img
          src="https://res.cloudinary.com/duumc5rqw/image/upload/v1738342069/faqh0dvnpzyfuh9nk57g.png"
          alt="Space background"
          className={styles.backgroundImage}
        />
        <div className={styles.overlay}></div>
        <div className={styles.logo}>
          <img
            src="https://res.cloudinary.com/duumc5rqw/image/upload/v1738342033/dhmm4l95le7inna2pu1g.png"
            alt="Logo"
          />
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

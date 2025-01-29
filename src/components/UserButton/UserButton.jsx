import React, { useState } from "react";
import { LogOut } from "lucide-react";
import styles from "./UserButton.module.css";

const UserButton = ({ username, handleLogout }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  return (
    <div className={styles.userContainer}>
      <div className={styles.avatarContainer} onClick={toggleDropdown}>
        <div className={styles.avatar}>
          {username ? username.charAt(0).toUpperCase() : "U"}
        </div>
      </div>
      {dropdownVisible && (
        <div className={styles.dropdown}>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={20} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserButton;

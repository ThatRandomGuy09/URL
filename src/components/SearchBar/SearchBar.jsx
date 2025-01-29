import React from "react";
import { Search } from "lucide-react";
import styles from "./SearchBar.module.css";

const SearchBar = ({ onSearch }) => {
  const handleInputChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <div className={styles.inputWrapper}>
      <Search size={18} className={styles.searchIcon} />
      <input
        type="text"
        placeholder="Search by remarks"
        className={styles.searchInput}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchBar;

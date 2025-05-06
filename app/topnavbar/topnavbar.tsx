"use client";
import styles from "./topnavbar.module.css";
import { useState } from "react";
import SearchComponent from "./searchcomponent/searchcomponent";

export default function TopNavbar() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <>
      <nav className={styles.navbar}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>Home</li>
          <li className={styles.navItem}>Shop</li>
          <li className={styles.navItem} onClick={() => setShowSearch(true)}>
            Search
          </li>
          <li className={styles.navItem}>Bookmarks</li>
          <li className={styles.navItem}>Profile</li>
        </ul>
      </nav>

      {showSearch && <SearchComponent onClose={() => setShowSearch(false)} />}
    </>
  );
}

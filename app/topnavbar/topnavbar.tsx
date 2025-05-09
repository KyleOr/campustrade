"use client";
import styles from "./topnavbar.module.css";
import { useState } from "react";
import Link from "next/link";
import SearchComponent from "./searchcomponent/searchcomponent";

export default function TopNavbar() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <>
      <nav className={styles.navbar}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link href="/">Home</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/marketplace">Marketplace</Link>
          </li>
          <li
            className={styles.navItem}
            onClick={() => setShowSearch(true)}
            style={{ cursor: "pointer" }}
          >
            Search
          </li>
          <li className={styles.navItem}>
            {/* We'll decide on overlay vs. page later */}
            <span style={{ cursor: "pointer" }}>Bookmarks</span>
          </li>
          <li className={styles.navItem}>My Account</li>
        </ul>
      </nav>

      {showSearch && <SearchComponent onClose={() => setShowSearch(false)} />}
    </>
  );
}

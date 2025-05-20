"use client";
import styles from "./topnavbar.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import SearchComponent from "./searchcomponent/searchcomponent";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function TopNavbar() {
  const [showSearch, setShowSearch] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        const name = user.email.split("@")[0];
        setUsername(name);
      } else {
        setUsername(null);
      }
    });

    return () => unsubscribe();
  }, []);

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
            <span style={{ cursor: "pointer" }}>Bookmarks</span>
          </li>
          <li className={styles.navItem}>
            {username ? (
              <Link href={`/${username}`}>{username}</Link>
            ) : (
              <Link href="/auth">Sign In</Link>
            )}
          </li>
        </ul>
      </nav>

      {showSearch && <SearchComponent onClose={() => setShowSearch(false)} />}
    </>
  );
}

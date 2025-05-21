"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import TopNavbar from "../topnavbar/topnavbar";
import styles from "./accountpage.module.css";

export default function AccountPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/auth");
        return;
      }

      const username = user.email?.split("@")[0];
      if (username !== params.account) {
        router.push(`/${username}`);
      } else {
        setCurrentUser(user);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [params.account]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/auth");
  };

  const handleSubmit = async () => {
    if (!title || !currentUser) return alert("Please enter a title");

    try {
      await addDoc(collection(db, "listings"), {
        title,
        createdAt: serverTimestamp(),
        userId: currentUser.uid,
        userEmail: currentUser.email,
        username: currentUser.email.split("@")[0],
      });

      alert("Listing posted!");
      setTitle("");
    } catch (err: any) {
      alert("Error posting listing: " + err.message);
    }
  };

  if (loading) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.page}>
      <TopNavbar />

      {/* Top Header Section */}
      <div className={styles.headerSection}>
        {/* Left: Profile Picture & Info */}
        <div className={styles.profileInfo}>
          <div className={styles.profilePic}></div>
          <div className={styles.textInfo}>
            <h2 className={styles.profileName}>{params.account}</h2>
            <p className={styles.profileEmail}>{currentUser?.email}</p>
            <div className={styles.buttonRow}>
              <button className={styles.followButton}>Follow</button>
              <button className={styles.messageButton}>Message</button>
            </div>
          </div>
        </div>

        {/* Right: Stats */}
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Followers</span>
            <span className={styles.statValue}>123</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Ratings</span>
            <span className={styles.statValue}>4.5</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Listings</span>
            <span className={styles.statValue}>7</span>
          </div>
        </div>
      </div>
      <div className={styles.headerDivider}></div>

      {/* Main 2-Column Section */}
      <div className={styles.mainSection}>
        {/* Left Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.listingBox}>
            <h3 className={styles.listingTitle}>Post a New Listing</h3>
            <input
              className={styles.input}
              placeholder="Title (e.g. Bike)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button className={styles.postButton} onClick={handleSubmit}>
              Post Listing
            </button>
          </div>
        </div>

        {/* Right Content */}
        <div className={styles.listings}>
          <h2 className={styles.sectionTitle}>Your Listings</h2>
          <div className={styles.listingGrid}>
            {[1, 2, 3].map((item) => (
              <div key={item} className={styles.card}>
                <p>Listing #{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

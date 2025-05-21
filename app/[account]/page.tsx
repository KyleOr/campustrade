"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import TopNavbar from "../topnavbar/topnavbar";
import PostListingcomponent from "./accountcomponents/postlistingcomponent";
import ListingModal from "../components/listingmodal";
import styles from "./accountpage.module.css";
import type { User } from "firebase/auth";

type Listing = {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  username: string;
  createdAt?: Timestamp;
  // Add other fields as needed
};

export default function AccountPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

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

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const q = query(
          collection(db, "listings"),
          where("username", "==", params.account)
        );
        const snapshot = await getDocs(q);
        const data: Listing[] = snapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            title: d.title ?? "",
            price: d.price ?? 0,
            category: d.category ?? "",
            description: d.description ?? "",
            username: d.username ?? "",
            createdAt: d.createdAt,
          };
        });
        setListings(data);
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    };

    fetchListings();
  }, [params.account]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/auth");
  };

  if (loading) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.page}>
      <TopNavbar />

      {/* Header */}
      <div className={styles.headerSection}>
        <div className={styles.profileInfo}>
          <div className={styles.profilePic}></div>
          <div className={styles.textInfo}>
            <h2 className={styles.profileName}>{params.account}</h2>
            <p className={styles.profileEmail}>{currentUser?.email}</p>
            <div className={styles.buttonRow}>
              {currentUser?.email?.split("@")[0] === params.account ? (
                <>
                  <button
                    className={styles.followButton}
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                  <button className={styles.messageButton}>
                    Your Messages
                  </button>
                </>
              ) : (
                <>
                  <button className={styles.followButton}>Follow</button>
                  <button className={styles.messageButton}>Message</button>
                </>
              )}
            </div>
          </div>
        </div>

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
            <span className={styles.statValue}>{listings.length}</span>
          </div>
        </div>
      </div>
      <div className={styles.headerDivider}></div>

      {/* Main Section */}
      <div className={styles.mainSection}>
        {/* Left Sidebar */}
        <div className={styles.sidebar}>
          {currentUser?.email?.split("@")[0] === params.account && (
            <PostListingcomponent />
          )}

          <div className={styles.listingBox}>
            <h3 className={styles.listingTitle}>About</h3>
            <p className={styles.bioText}>
              Just a placeholder bio for now. Here you can write a short
              description about yourself, your interests, or what you usually
              list.
            </p>
          </div>
        </div>

        {/* Right Content */}
        <div className={styles.listings}>
          <h2 className={styles.sectionTitle}>Your Listings</h2>
          <div className={styles.listingGrid}>
            {listings.map((listing) => (
              <div
                key={listing.id}
                className={styles.card}
                onClick={() => setSelectedListing(listing)}
              >
                <h4>{listing.title}</h4>
                <p>${listing.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Listing Modal */}
      {selectedListing && (
        <ListingModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}
    </div>
  );
}

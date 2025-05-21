"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import styles from "./marketplacepage.module.css";
import ListingModal from "../components/listingmodal";
import TopNavbar from "@/app/topnavbar/topnavbar";

export default function MarketplacePage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<any | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const q = query(
          collection(db, "listings"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setListings(data);
      } catch (err) {
        console.error("Error fetching listings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <>
      <TopNavbar />
      <div className={styles.page}>
        <div className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Filter Listings</h2>
          <p className={styles.filterNote}>
            Search bar, category filters, etc.
          </p>
        </div>

        <div className={styles.main}>
          <h1 className={styles.heading}>Marketplace</h1>
          {loading ? (
            <p className={styles.loading}>Loading listings...</p>
          ) : (
            <div className={styles.grid}>
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className={styles.card}
                  onClick={() => setSelectedListing(listing)}
                >
                  <h3 className={styles.cardTitle}>{listing.title}</h3>
                  <p className={styles.cardPrice}>${listing.price}</p>
                  <p className={styles.cardMeta}>
                    Posted by: {listing.username}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedListing && (
          <ListingModal
            listing={selectedListing}
            onClose={() => setSelectedListing(null)}
          />
        )}
      </div>
    </>
  );
}

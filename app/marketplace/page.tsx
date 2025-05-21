"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import styles from "./marketplacepage.module.css";
import ListingModal from "../components/listingmodal";
import TopNavbar from "@/app/topnavbar/topnavbar";

export default function MarketplacePage() {
  const [listings, setListings] = useState<any[]>([]);
  const [filteredListings, setFilteredListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<any | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

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
        setFilteredListings(data); // initial view
      } catch (err) {
        console.error("Error fetching listings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  useEffect(() => {
    const filtered = listings.filter((listing) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        listing.title.toLowerCase().includes(query) ||
        listing.description.toLowerCase().includes(query);

      const matchesCategory =
        !categoryFilter ||
        listing.category?.toLowerCase().includes(categoryFilter.toLowerCase());

      const price = Number(listing.price);
      const min = minPrice ? Number(minPrice) : 0;
      const max = maxPrice ? Number(maxPrice) : Infinity;
      const matchesPrice = price >= min && price <= max;

      return matchesSearch && matchesCategory && matchesPrice;
    });

    setFilteredListings(filtered);
  }, [searchQuery, categoryFilter, minPrice, maxPrice, listings]);

  return (
    <>
      <TopNavbar />
      <div className={styles.page}>
        {/* SIDEBAR FILTERS */}
        <div className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Filter Listings</h2>

          <input
            type="text"
            placeholder="Search keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.input}
          />

          <input
            type="text"
            list="category-options"
            placeholder="Filter by category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={styles.input}
          />

          <datalist id="category-options">
            <option value="books">Books & Notes</option>
            <option value="furniture">Furniture</option>
            <option value="bikes">Bikes</option>
            <option value="tutoring">Tutoring</option>
            <option value="custom">Other (enter manually)</option>
          </datalist>

          <input
            type="text"
            placeholder="Category keywords..."
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={styles.input}
          />

          <div className={styles.priceRange}>
            <input
              type="number"
              placeholder="Min price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className={styles.input}
            />
            <input
              type="number"
              placeholder="Max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className={styles.input}
            />
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className={styles.main}>
          <h1 className={styles.heading}>Marketplace</h1>
          {loading ? (
            <p className={styles.loading}>Loading listings...</p>
          ) : (
            <div className={styles.grid}>
              {filteredListings.map((listing) => (
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

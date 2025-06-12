"use client";
import { useEffect, useState } from "react";
import {
  Timestamp,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import styles from "./marketplacepage.module.css";
import ListingModal from "../components/listingmodal";
import { useSearchParams } from "next/navigation";
import MarketCard from "./marketcard";

type Listing = {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  username: string;
  createdAt?: Timestamp;
};

export default function MarketplaceClient() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    setSearchQuery(search);
    setCategoryFilter(category);
  }, [searchParams]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const q = query(
          collection(db, "listings"),
          orderBy("createdAt", "desc")
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
            createdAt: d.createdAt as Timestamp | undefined,
          };
        });
        setListings(data);
        setFilteredListings(data);
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
          <option value="clothes">Clothes</option>
          <option value="technology">Technology</option>
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
              <MarketCard
                key={listing.id}
                title={listing.title}
                price={listing.price}
                username={listing.username}
                onClick={() => setSelectedListing(listing)}
              />
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
    </>
  );
}

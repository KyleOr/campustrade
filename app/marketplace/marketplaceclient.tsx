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
import MarketplaceFilter from "./marketplacefilter";

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
      <MarketplaceFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
      />

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

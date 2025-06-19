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
import { useSearchParams, useRouter } from "next/navigation";
import MarketCard from "./marketcard";
import MarketplaceFilter from "./marketplacefilter";
import type { listing } from "@/lib/listing";

export default function MarketplaceClient() {
  const [listings, setListings] = useState<listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<listing | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const initialSearch = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

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
        const data: listing[] = snapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            title: d.title ?? "",
            price: d.price ?? 0,
            category: d.category ?? "",
            description: d.description ?? "",
            username: d.username ?? "",
            createdAt: d.createdAt as Timestamp | undefined,
            location: d.location ?? "",
            condition: d.condition ?? "",
            userId: d.userId ?? "",
            userEmail: d.userEmail ?? "",
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

      const matchesLocation =
        !locationFilter ||
        listing.location?.toLowerCase().includes(locationFilter.toLowerCase());

      return (
        matchesSearch && matchesCategory && matchesPrice && matchesLocation
      );
    });

    setFilteredListings(filtered);
  }, [
    searchQuery,
    categoryFilter,
    minPrice,
    maxPrice,
    locationFilter,
    listings,
  ]);

  // Open modal if ?listing= is present
  useEffect(() => {
    const listingId = searchParams.get("listing");
    if (listingId && listings.length > 0) {
      const found = listings.find((l) => l.id === listingId);
      if (found) setSelectedListing(found);
    }
  }, [searchParams, listings]);

  // When closing modal, remove ?listing= from URL
  const handleCloseModal = () => {
    setSelectedListing(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("listing");
    router.replace(`/marketplace?${params.toString()}`, { scroll: false });
  };

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
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
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
        <ListingModal listing={selectedListing} onClose={handleCloseModal} />
      )}
    </>
  );
}

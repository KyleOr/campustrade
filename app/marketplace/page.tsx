"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function MarketplacePage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p className="p-4">Loading listings...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Marketplace</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {listings.map((listing) => (
          <div key={listing.id} className="border rounded p-4 shadow bg-white">
            <h2 className="text-lg font-semibold mb-2">{listing.title}</h2>
            <p className="text-sm text-gray-600">
              Posted by: {listing.username}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

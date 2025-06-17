"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./listingmodal.module.css";
import { Bookmark } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";

interface ListingModalProps {
  listing: {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    location: string;
    userId: string;
    userEmail: string;
    username: string;
    createdAt?: Timestamp;
    condition: string;
  };
  onClose: () => void;
}

export default function ListingModal({ listing, onClose }: ListingModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [alreadyBookmarked, setAlreadyBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookmarkStatus, setBookmarkStatus] = useState("Add to Bookmarks");

  // Close modal handlers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // Check auth and bookmark status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserId(user.uid);
        const bookmarkRef = doc(db, "users", user.uid, "bookmarks", listing.id);
        const snapshot = await getDoc(bookmarkRef);
        if (snapshot.exists()) {
          setAlreadyBookmarked(true);
          setBookmarkStatus("Already Bookmarked");
        }
      } else {
        setUserId(null);
        setAlreadyBookmarked(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [listing.id]);

  const handleViewListing = () => {
    onClose();
    router.push(`/listing/${listing.id}`);
  };

  const handleBookmark = async () => {
    if (!userId) {
      alert("Please sign in to bookmark this listing.");
      return;
    }

    if (alreadyBookmarked) {
      alert("You've already bookmarked this listing.");
      return;
    }

    try {
      const bookmarkRef = doc(db, "users", userId, "bookmarks", listing.id);
      await setDoc(bookmarkRef, {
        id: listing.id,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        category: listing.category,
        bookmarkedAt: new Date().toISOString(),
      });
      setAlreadyBookmarked(true);
      setBookmarkStatus("Bookmarked!");
    } catch (error) {
      console.error("Error bookmarking listing:", error);
      alert("Failed to bookmark listing. Please try again.");
    }
  };

  // Helper to get days ago
  const getDaysAgo = () => {
    if (!listing.createdAt?.toDate) return "";
    const now = new Date();
    const created = listing.createdAt.toDate();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} ref={modalRef}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <div className={styles.contentRow}>
          {/* Left column: images (placeholder for now) */}
          <div className={styles.leftCol}>
            <div className={styles.imagePlaceholder}>
              <span>No images available</span>
            </div>
          </div>

          {/* Right column: info */}
          <div className={styles.rightCol}>
            <h2 className={styles.title}>{listing.title}</h2>
            <p className={styles.price}>
              ${listing.price?.toLocaleString?.() ?? listing.price}
            </p>
            <p className={styles.category}>Category: {listing.category}</p>
            {listing.condition && (
              <p className={styles.condition}>
                Condition:{" "}
                {listing.condition.charAt(0).toUpperCase() +
                  listing.condition.slice(1).toLowerCase()}
              </p>
            )}
            <p className={styles.description}>{listing.description}</p>
            {/* Display all listing info */}
            <div className={styles.meta}>
              <p>
                <strong>Location:</strong> {listing.location ?? "N/A"}
              </p>
              <p>
                <strong>Posted by:</strong> {listing.username || "Unknown user"}
              </p>
              {listing.createdAt?.toDate && (
                <p>
                  <strong>Date:</strong>{" "}
                  {listing.createdAt.toDate().toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  ({getDaysAgo()})
                </p>
              )}
            </div>
            <div className={styles.buttonGroup}>
              <button className={styles.viewButton} onClick={handleViewListing}>
                View Full Listing
              </button>
              <button
                className={styles.bookmarkButton}
                onClick={handleBookmark}
                disabled={loading || alreadyBookmarked}
              >
                <Bookmark size={16} style={{ marginRight: "8px" }} />
                {userId ? bookmarkStatus : "Sign in to Bookmark"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

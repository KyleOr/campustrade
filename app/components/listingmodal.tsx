"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./listingmodal.module.css";
import { Bookmark } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface ListingModalProps {
  listing: {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    userEmail?: string;
    username?: string;
    createdAt?: any;
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
      alert("You’ve already bookmarked this listing.");
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

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} ref={modalRef}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.title}>{listing.title}</h2>
        <p className={styles.price}>${listing.price}</p>
        <p className={styles.category}>Category: {listing.category}</p>
        <p className={styles.description}>{listing.description}</p>
        <div className={styles.meta}>
          <p>Posted by: {listing.username}</p>
          {listing.createdAt?.toDate && (
            <p>
              Date:{" "}
              {listing.createdAt.toDate().toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>

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
  );
}

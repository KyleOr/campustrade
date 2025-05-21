"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./listingmodal.module.css";
import { Bookmark } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

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

  const handleViewListing = () => {
    onClose();
    router.push(`/listing/${listing.id}`);
  };

  const handleBookmark = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please sign in to bookmark this listing.");
      return;
    }

    try {
      const bookmarkRef = doc(db, "users", user.uid, "bookmarks", listing.id);
      await setDoc(bookmarkRef, {
        id: listing.id,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        category: listing.category,
        bookmarkedAt: new Date().toISOString(),
      });
      alert("Listing bookmarked successfully!");
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

        <button className={styles.bookmarkButton} onClick={handleBookmark}>
          <Bookmark size={16} style={{ marginRight: "8px" }} />
          Add to Bookmarks
        </button>
      </div>
    </div>
  );
}

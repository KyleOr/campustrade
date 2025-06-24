"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./listingmodal.module.css";
import { Bookmark, MessageCircle, Share2 } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { useToast } from "./toastnotification";

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
  const [userId, setUserId] = useState<string | null>(null);
  const [alreadyBookmarked, setAlreadyBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const showToast = useToast();

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
        }
      } else {
        setUserId(null);
        setAlreadyBookmarked(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [listing.id]);

  const handleBookmark = async () => {
    if (!userId) {
      showToast("Please sign in to bookmark this listing.");
      return;
    }

    if (alreadyBookmarked) {
      showToast("You've already bookmarked this listing.");
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
      showToast("Listing bookmarked!");
    } catch (error) {
      console.error("Error bookmarking listing:", error);
      showToast("Failed to bookmark listing. Please try again.");
    }
  };

  // Helper to get "Listed x weeks/days ago"
  const getListedAgo = () => {
    if (!listing.createdAt?.toDate) return "";
    const now = new Date();
    const created = listing.createdAt.toDate();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks > 0) {
      return `Listed ${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago${
        diffDays % 7
          ? `, ${diffDays % 7} day${diffDays % 7 > 1 ? "s" : ""} ago`
          : ""
      }`;
    }
    if (diffDays === 0) return "Listed today";
    if (diffDays === 1) return "Listed 1 day ago";
    return `Listed ${diffDays} days ago`;
  };

  // Share handler (simple copy link)
  const handleShare = async () => {
    const url = `${window.location.origin}/listing/${listing.id}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast("Listing link copied to clipboard!");
    } catch {
      showToast("Failed to copy link.");
    }
  };

  // Message handler (placeholder)
  const handleMessage = () => {
    showToast("Messaging feature coming soon!");
  };

  function truncate(str: string, max: number) {
    return str.length > max ? str.slice(0, max - 1) + "…" : str;
  }

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
            <h2 className={styles.title}>{truncate(listing.title, 60)}</h2>
            <p className={styles.price}>
              ${listing.price?.toLocaleString?.() ?? listing.price}
            </p>
            <p className={styles.listedAgo}>
              {getListedAgo()} in {listing.location ?? "N/A"}
            </p>
            <p className={styles.category}>Category: {listing.category}</p>
            {listing.condition && (
              <p className={styles.condition}>
                Condition:{" "}
                {listing.condition.charAt(0).toUpperCase() +
                  listing.condition.slice(1).toLowerCase()}
              </p>
            )}
            <div className={styles.buttonRow}>
              <button className={styles.messageButton} onClick={handleMessage}>
                <MessageCircle size={16} style={{ marginRight: "8px" }} />
                Message
              </button>
              <button
                className={styles.saveButton}
                onClick={handleBookmark}
                disabled={loading || alreadyBookmarked}
              >
                <Bookmark size={16} style={{ marginRight: "8px" }} />
                {userId
                  ? alreadyBookmarked
                    ? "Saved"
                    : "Save"
                  : "Sign in to Save"}
              </button>
              <button className={styles.shareButton} onClick={handleShare}>
                <Share2 size={16} style={{ marginRight: "8px" }} />
                Share
              </button>
            </div>
            <p className={styles.description}>
              {truncate(listing.description, 300)}
            </p>
            <div className={styles.meta}>
              <p>
                <strong>Posted by:</strong> {listing.username || "Unknown user"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

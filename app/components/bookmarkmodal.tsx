"use client";
import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  orderBy,
  DocumentData,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import styles from "./bookmarkmodal.module.css";
import { Trash } from "lucide-react";
import { deleteDoc, doc } from "firebase/firestore";

interface Bookmark {
  id: string;
  title: string;
  price: number;
  bookmarkedAt: string;
}

interface BookmarkModalProps {
  onClose: () => void;
}

export default function BookmarkModal({ onClose }: BookmarkModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (bookmarkId: string) => {
    if (!userId) return;
    try {
      await deleteDoc(doc(db, "users", userId, "bookmarks", bookmarkId));
      setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
    } catch (error) {
      console.error("Error deleting bookmark:", error);
    }
  };

  // Handle outside click / ESC close
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

  // Watch auth state and fetch bookmarks if signed in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const q = query(
          collection(db, "users", user.uid, "bookmarks"),
          orderBy("bookmarkedAt", "desc")
        );
        const snapshot = await getDocs(q);
        const data: Bookmark[] = snapshot.docs.map((doc) => {
          const d = doc.data() as DocumentData;
          return {
            id: doc.id,
            title: d.title,
            price: d.price,
            bookmarkedAt: new Date(d.bookmarkedAt).toLocaleDateString(),
          };
        });
        setBookmarks(data);
      } else {
        setUserId(null);
        setBookmarks([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} ref={modalRef}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        <h2>Bookmarks</h2>

        {loading ? (
          <p>Loading...</p>
        ) : !userId ? (
          <p>Please sign in to view your bookmarks.</p>
        ) : bookmarks.length === 0 ? (
          <p>You have no bookmarks yet.</p>
        ) : (
          <div className={styles.bookmarkList}>
            {bookmarks.map((bookmark) => (
              <div key={bookmark.id} className={styles.bookmarkItem}>
                <button
                  onClick={() => handleDelete(bookmark.id)}
                  className={styles.deleteButton}
                  aria-label="Delete bookmark"
                >
                  <Trash size={18} />
                </button>

                <div className={styles.bookmarkContent}>
                  <div>
                    <strong>{bookmark.title}</strong>
                    <p>${bookmark.price}</p>
                  </div>
                  <small>Saved on {bookmark.bookmarkedAt}</small>
                </div>

                <a
                  href={`/listing/${bookmark.id}`}
                  className={styles.seeListingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  See Listing
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

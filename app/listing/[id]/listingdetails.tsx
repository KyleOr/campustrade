"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import styles from "./listingpage.module.css";
import TopNavbar from "@/app/topnavbar/topnavbar";

interface ListingDetailsProps {
  title: string;
  price: number;
  category: string;
  description: string;
  username: string;
  createdAt?: string;
}

export default function ListingDetails({
  title,
  price,
  category,
  description,
  username,
  createdAt,
}: ListingDetailsProps) {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [alreadyBookmarked, setAlreadyBookmarked] = useState(false);
  const [bookmarkMessage, setBookmarkMessage] = useState("Add to Bookmark");
  const [loading, setLoading] = useState(true);

  const listingId =
    typeof window !== "undefined"
      ? window.location.pathname.split("/").pop()
      : null;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && listingId) {
        setUserId(user.uid);
        const bookmarkRef = doc(db, "users", user.uid, "bookmarks", listingId);
        const docSnap = await getDoc(bookmarkRef);
        setAlreadyBookmarked(docSnap.exists());
      } else {
        setUserId(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [listingId]);

  const handleAddBookmark = async () => {
    if (!userId || !listingId) return;

    if (alreadyBookmarked) {
      setBookmarkMessage("Already bookmarked");
      return;
    }

    try {
      const bookmarkRef = doc(db, "users", userId, "bookmarks", listingId);
      await setDoc(bookmarkRef, {
        title,
        price,
        bookmarkedAt: new Date().toISOString(),
      });
      setAlreadyBookmarked(true);
      setBookmarkMessage("Bookmarked!");
    } catch (err) {
      console.error("Error adding bookmark:", err);
      setBookmarkMessage("Error");
    }
  };

  return (
    <div className={styles.page}>
      <TopNavbar />
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => router.back()}>
          ← Back
        </button>

        <h1 className={styles.title}>{title}</h1>
        <p className={styles.price}>${price}</p>
        <p className={styles.category}>Category: {category}</p>
        <p className={styles.description}>{description}</p>

        <div className={styles.meta}>
          <p>Posted by: {username}</p>
          {createdAt && (
            <p>
              Posted on:{" "}
              {new Date(createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>

        <div className={styles.actions}>
          <button
            className={styles.button}
            onClick={
              !userId
                ? () => alert("Please sign in to bookmark")
                : handleAddBookmark
            }
            disabled={loading}
          >
            {!userId
              ? "Sign in to Bookmark"
              : alreadyBookmarked
              ? "Already Bookmarked"
              : bookmarkMessage}
          </button>

          <button
            className={styles.buttonSecondary}
            onClick={() =>
              !userId
                ? alert("Please sign in to message seller")
                : alert("Message Seller feature coming soon!")
            }
          >
            {!userId ? "Sign in to Message" : "Message Seller"}
          </button>
        </div>
      </div>
    </div>
  );
}

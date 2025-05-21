"use client";

import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { notFound, useRouter } from "next/navigation";
import styles from "./listingpage.module.css";
import TopNavbar from "@/app/topnavbar/topnavbar";
import { useEffect, useState } from "react";

interface ListingPageProps {
  params: {
    id: string;
  };
}

export default function ListingPage({ params }: ListingPageProps) {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      const listingRef = doc(db, "listings", params.id);
      const snapshot = await getDoc(listingRef);

      if (!snapshot.exists()) {
        notFound();
        return;
      }

      setData(snapshot.data());
      setLoading(false);
    };

    fetchListing();
  }, [params.id]);

  if (loading || !data) {
    return <div className={styles.page}>Loading...</div>;
  }

  return (
    <div className={styles.page}>
      <TopNavbar />
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => router.back()}>
          ← Back
        </button>

        <h1 className={styles.title}>{data.title}</h1>
        <p className={styles.price}>${data.price}</p>
        <p className={styles.category}>Category: {data.category}</p>

        <p className={styles.description}>{data.description}</p>

        <div className={styles.meta}>
          <p>Posted by: {data.username}</p>
          {data.createdAt?.toDate && (
            <p>
              Posted on:{" "}
              {data.createdAt.toDate().toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>

        <div className={styles.actions}>
          <button className={styles.button}>Add to Bookmark</button>
          <button className={styles.buttonSecondary}>Message Seller</button>
        </div>
      </div>
    </div>
  );
}

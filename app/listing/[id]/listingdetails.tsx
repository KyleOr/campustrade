"use client";

import { useRouter } from "next/navigation";
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
          <button className={styles.button}>Add to Bookmark</button>
          <button className={styles.buttonSecondary}>Message Seller</button>
        </div>
      </div>
    </div>
  );
}

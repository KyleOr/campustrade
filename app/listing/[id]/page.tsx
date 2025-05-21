import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";
import styles from "./listingpage.module.css";
import TopNavbar from "@/app/topnavbar/topnavbar";

interface ListingPageProps {
  params: {
    id: string;
  };
}

export default async function ListingPage({ params }: ListingPageProps) {
  const listingRef = doc(db, "listings", params.id);
  const snapshot = await getDoc(listingRef);

  if (!snapshot.exists()) {
    return notFound(); // Show 404 if the listing is not found
  }

  const data = snapshot.data();

  return (
    <div className={styles.page}>
      <TopNavbar />
      <div className={styles.container}>
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

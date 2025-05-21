import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";
import ListingDetails from "./listingdetails";

interface ListingPageProps {
  params: {
    id: string;
  };
}

export default async function ListingPage({
  params,
}: {
  params: Promise<ListingPageProps["params"]>;
}) {
  const { id } = await params;
  const docRef = doc(db, "listings", id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) notFound();

  const data = snapshot.data();

  // Convert Firestore timestamp to string to safely pass to client
  const createdAt = data.createdAt?.toDate().toISOString();

  return (
    <ListingDetails
      title={data.title}
      price={data.price}
      category={data.category}
      description={data.description}
      username={data.username}
      createdAt={createdAt}
    />
  );
}

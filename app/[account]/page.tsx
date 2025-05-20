"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function AccountPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/auth");
        return;
      }

      const username = user.email?.split("@")[0];
      if (username !== params.account) {
        router.push(`/${username}`);
      } else {
        setCurrentUser(user);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [params.account]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/auth");
  };

  const handleSubmit = async () => {
    if (!title || !currentUser) return alert("Please enter a title");

    try {
      await addDoc(collection(db, "listings"), {
        title,
        createdAt: serverTimestamp(),
        userId: currentUser.uid,
        userEmail: currentUser.email,
        username: currentUser.email.split("@")[0],
      });

      alert("Listing posted!");
      setTitle("");
    } catch (err: any) {
      alert("Error posting listing: " + err.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        Welcome to your account, {params.account}!
      </h2>
      <button
        className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={handleSignOut}
      >
        Sign Out
      </button>

      <div className="bg-white p-4 rounded shadow max-w-md">
        <h3 className="text-lg font-bold mb-2">Post a New Listing</h3>
        <input
          className="w-full p-2 border mb-2 rounded"
          placeholder="Title (e.g. Bike)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          className="w-full bg-green-600 text-white py-2 rounded"
          onClick={handleSubmit}
        >
          Post Listing
        </button>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./postlistingcomponent.module.css";
import { db, auth } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";

export default function PostListingComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("general");
  const [customCategory, setCustomCategory] = useState("");

  // New fields
  const [condition, setCondition] = useState("new");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState("");

  const boxRef = useRef<HTMLDivElement>(null);

  const triggerClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsOpen(false);
      setIsClosing(false);
      resetForm();
    }, 300);
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setCategory("general");
    setCustomCategory("");
    setCondition("new");
    setLocation("");
    setTags("");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isOpen) setIsVisible(true);
  }, [isOpen]);

  useEffect(() => {
    if (!isVisible) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        triggerClose();
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        triggerClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isVisible, triggerClose]);

  const handleSubmit = async () => {
    if (
      !title ||
      !description ||
      !price ||
      !category ||
      !currentUser ||
      !condition ||
      !location
    ) {
      return alert("Please fill out all fields.");
    }

    try {
      await addDoc(collection(db, "listings"), {
        title,
        description,
        price: parseFloat(price),
        category: category === "custom" ? customCategory : category,
        condition,
        location,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        createdAt: serverTimestamp(),
        userId: currentUser.uid,
        userEmail: currentUser.email ?? "unknown@email.com",
        username: (currentUser.email ?? "unknown").split("@")[0],
      });

      alert("Listing posted!");
      triggerClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert("Error posting listing: " + err.message);
      } else {
        alert("An unknown error occurred while posting the listing.");
      }
    }
  };

  if (loading) return <p className={styles.loading}>Loading...</p>;

  return (
    <>
      <button className={styles.postButton} onClick={() => setIsOpen(true)}>
        Post Listing
      </button>

      {isVisible && (
        <div
          className={`${styles.overlay} ${
            isClosing ? styles.fadeOut : styles.fadeIn
          }`}
        >
          <div className={styles.modalBox} ref={boxRef}>
            <h2>Create a Listing</h2>

            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
            />
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={styles.input}
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={styles.select}
            >
              <option value="">Select a category</option>
              <option value="books">Books & Notes</option>
              <option value="furniture">Furniture</option>
              <option value="bikes">Bikes</option>
              <option value="tutoring">Tutoring</option>
              <option value="custom">Other (enter manually)</option>
            </select>

            {category === "custom" && (
              <input
                type="text"
                placeholder="Enter custom category"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className={styles.input}
              />
            )}

            {/* New fields */}
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className={styles.select}
            >
              <option value="new">Condition: New</option>
              <option value="like new">Condition: Like New</option>
              <option value="used">Condition: Used</option>
              <option value="for parts">Condition: For Parts</option>
            </select>

            <input
              type="text"
              placeholder="Location (e.g. Burwood, Waurn Ponds)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={styles.input}
            />

            <input
              type="text"
              placeholder="Tags (comma separated, e.g. negotiable, delivery)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className={styles.input}
            />

            <div className={styles.buttonGroup}>
              <button className={styles.submitButton} onClick={handleSubmit}>
                Submit
              </button>
              <button className={styles.cancelButton} onClick={triggerClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

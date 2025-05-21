"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./postlistingcomponent.module.css";

export default function PostListingComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const triggerClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsOpen(false);
      setIsClosing(false);
    }, 300);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true); // show modal
    }
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
            <p>This will eventually contain the listing form.</p>
          </div>
        </div>
      )}
    </>
  );
}

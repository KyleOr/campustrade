"use client";
import { useEffect, useRef } from "react";
import styles from "./bookmarkmodal.module.css";

interface BookmarkModalProps {
  onClose: () => void;
}

export default function BookmarkModal({ onClose }: BookmarkModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} ref={modalRef}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Bookmarks</h2>
        <p>This is a placeholder for the bookmark modal content.</p>
      </div>
    </div>
  );
}

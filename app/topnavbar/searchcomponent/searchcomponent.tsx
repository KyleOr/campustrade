"use client";
import { useEffect, useRef, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import styles from "./searchcomponent.module.css";

interface Props {
  onClose: () => void;
}

export default function SearchComponent({ onClose }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false); // track if the results are open or not

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setIsOpen(true); // Open the results when searchTerm is not empty
    } else {
      setIsOpen(false); // Close when empty
    }
  }, [searchTerm]);

  const triggerClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`${styles.overlay} ${isClosing ? styles.fadeOut : ""} ${
        isOpen ? styles.open : ""
      }`}
    >
      <div className={styles.searchBox} ref={boxRef}>
        <div className={styles.searchInputWrapper}>
          <Search size={20} className={styles.icon} />
          <input
            type="text"
            placeholder="Search products, categories..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SlidersHorizontal size={20} className={styles.iconButton} />
        </div>

        <div
          className={`${styles.resultsWrapper} ${isOpen ? styles.open : ""}`}
        >
          {searchTerm && (
            <div className={styles.searchResults}>
              <div className={styles.resultsLeft}>
                <div className={styles.suggestionItem}>
                  Search result for "{searchTerm}"
                </div>
                <div className={styles.suggestionItem}>
                  Autofill suggestion 1
                </div>
                <div className={styles.suggestionItem}>
                  Autofill suggestion 2
                </div>
                <div className={styles.suggestionItem}>
                  Autofill suggestion 3
                </div>
                <div className={styles.suggestionItem}>
                  Autofill suggestion 4
                </div>
                <div className={styles.suggestionItem}>
                  Autofill suggestion 5
                </div>
              </div>
              <div className={styles.resultsRight}>
                <div className={styles.placeholderTopResult}>
                  Top result preview here (coming soon)
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

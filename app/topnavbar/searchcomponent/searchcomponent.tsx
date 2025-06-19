"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Search } from "lucide-react";
import styles from "./searchcomponent.module.css";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  onClose: () => void;
}

type Listing = {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  username?: string;
  createdAt?: { toDate: () => Date };
  // Add other fields as needed
};

export default function SearchComponent({ onClose }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false); // track if the results are open or not
  const [selectedIndex, setSelectedIndex] = useState(0);

  const triggerClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  }, [onClose]);

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
  }, [triggerClose]);

  const [listings, setListings] = useState<Listing[]>([]);
  const [filtered, setFiltered] = useState<Listing[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const q = query(
          collection(db, "listings"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const data: Listing[] = snapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            title: d.title ?? "",
            price: d.price ?? 0,
            category: d.category ?? "",
            description: d.description ?? "",
            username: d.username ?? "",
            createdAt: d.createdAt,
          };
        });
        setListings(data);
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    };
    fetchListings();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      setIsOpen(true);
      const term = searchTerm.toLowerCase();
      const filteredResults = listings.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term) ||
          item.category?.toLowerCase().includes(term)
      );
      setFiltered(filteredResults.slice(0, 5)); // top 5 results
    } else {
      setIsOpen(false);
      setFiltered([]);
    }
  }, [searchTerm, listings]);

  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (searchTerm.trim()) {
        router.push(
          `/marketplace?search=${encodeURIComponent(searchTerm.trim())}`
        );
        onClose(); // close the search overlay
      }
    }
  };

  function truncate(str: string, max: number) {
    return str.length > max ? str.slice(0, max - 1) + "…" : str;
  }

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
            onKeyDown={handleKeyDown}
          />
        </div>

        <div
          className={`${styles.resultsWrapper} ${isOpen ? styles.open : ""}`}
        >
          {searchTerm && (
            <div className={styles.searchResults}>
              <div className={styles.resultsLeft}>
                {filtered.length === 0 ? (
                  <div className={styles.suggestionItem}>
                    No matches found for &quot;{searchTerm}&quot;
                  </div>
                ) : (
                  filtered.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`${styles.suggestionItem} ${
                        selectedIndex === idx ? styles.selected : ""
                      }`}
                      onClick={() => setSelectedIndex(idx)}
                      tabIndex={0}
                      role="button"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          setSelectedIndex(idx);
                      }}
                    >
                      {truncate(item.title, 30)} — ${item.price}
                    </div>
                  ))
                )}
              </div>

              <div className={styles.resultsRight}>
                {filtered.length > 0 ? (
                  <div className={styles.resultCard}>
                    <h3 className={styles.cardTitle}>
                      {truncate(filtered[selectedIndex].title, 40)}
                    </h3>
                    <p className={styles.cardPrice}>
                      ${filtered[selectedIndex].price}
                    </p>
                    <p className={styles.cardDesc}>
                      {truncate(filtered[selectedIndex].description, 120)}
                    </p>
                    <p className={styles.cardMeta}>
                      Category:{" "}
                      {filtered[selectedIndex].category || "Uncategorized"}
                    </p>
                    <Link
                      href={`/marketplace?listing=${filtered[selectedIndex].id}`}
                      className={styles.viewButton}
                      scroll={false}
                    >
                      View Listing
                    </Link>
                  </div>
                ) : (
                  <div className={styles.placeholderTopResult}>
                    No top result to show
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

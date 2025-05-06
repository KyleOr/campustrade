"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./searchcomponent.module.css";

interface Props {
  onClose: () => void;
}

export default function SearchComponent({ onClose }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);

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

  const triggerClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`${styles.overlay} ${isClosing ? styles.fadeOut : ""}`}>
      <div className={styles.searchBox} ref={boxRef}>
        <h2>Search Placeholder</h2>
      </div>
    </div>
  );
}

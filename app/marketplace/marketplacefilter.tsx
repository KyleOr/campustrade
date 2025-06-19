import React, { useState } from "react";
import styles from "./marketplacefilter.module.css";
import {
  Book,
  Sofa,
  Car,
  GraduationCap,
  Shirt,
  Laptop,
  Package,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

const categories = [
  {
    value: "books",
    label: "Books & Notes",
    icon: Book,
    subcategories: ["Textbooks", "Notes", "Other"],
  },
  {
    value: "furniture",
    label: "Furniture",
    icon: Sofa,
    subcategories: ["Desk", "Chair", "Bed", "Other"],
  },
  {
    value: "vehicle",
    label: "Vehicles",
    icon: Car,
    subcategories: ["Bike", "Scooter", "Car", "Other"],
  },
  {
    value: "tutoring",
    label: "Tutoring",
    icon: GraduationCap,
    subcategories: ["Math", "Science", "Language", "Other"],
  },
  {
    value: "clothes",
    label: "Clothes",
    icon: Shirt,
    subcategories: ["Shirts", "Pants", "Shoes", "Other"],
  },
  {
    value: "technology",
    label: "Technology",
    icon: Laptop,
    subcategories: ["Laptop", "Tablet", "Phone", "Other"],
  },
  {
    value: "miscellaneous",
    label: "Miscellaneous",
    icon: Package,
    subcategories: ["Other"],
  },
];

type MarketplaceFilterProps = {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  categoryFilter: string;
  setCategoryFilter: (v: string) => void;
  minPrice: string;
  setMinPrice: (v: string) => void;
  maxPrice: string;
  setMaxPrice: (v: string) => void;
  locationFilter: string;
  setLocationFilter: (v: string) => void;
};

export default function MarketplaceFilter({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  locationFilter,
  setLocationFilter,
}: MarketplaceFilterProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  // Helper to handle animation
  const handleCategoryClick = (catValue: string) => {
    setDirection("forward");
    setAnimating(true);
    setTimeout(() => {
      setActiveCategory(catValue);
      setAnimating(false);
    }, 300); // match animation duration
  };

  const handleBackClick = () => {
    setDirection("backward");
    setAnimating(true);
    setTimeout(() => {
      setActiveCategory(null);
      setAnimating(false);
    }, 300);
  };

  return (
    <div className={styles.sidebar}>
      <h2 className={styles.sidebarTitle}>Filter Listings</h2>

      <input
        type="text"
        placeholder="Search Marketplace"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={styles.input}
      />

      <div className={styles.priceRange}>
        <input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className={styles.input}
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className={styles.input}
        />
      </div>

      <input
        type="text"
        placeholder="Filter by location"
        value={locationFilter}
        onChange={(e) => setLocationFilter(e.target.value)}
        className={styles.input}
      />

      <input
        type="text"
        list="category-options"
        placeholder="Filter by category"
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className={styles.input}
      />

      <datalist id="category-options">
        {categories.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </datalist>

      <div
        className={
          styles.categoryButtonGroup +
          " " +
          (animating
            ? direction === "forward"
              ? styles.slideOutLeft
              : styles.slideOutRight
            : activeCategory
            ? styles.slideInRight
            : styles.slideInLeft)
        }
      >
        {activeCategory === null ? (
          // Show main categories
          categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.value}
                className={styles.categoryButton}
                onClick={() => handleCategoryClick(cat.value)}
                type="button"
              >
                <span className={styles.categoryIcon}>
                  <Icon size={20} />
                </span>
                <span className={styles.categoryLabel}>{cat.label}</span>
                <span className={styles.chevronIcon}>
                  <ChevronRight size={18} />
                </span>
              </button>
            );
          })
        ) : (
          // Show subcategories for the selected category
          <>
            <button
              className={styles.categoryButton}
              onClick={handleBackClick}
              type="button"
            >
              <span className={styles.categoryIcon}>
                <ArrowLeft size={18} />
              </span>
              <span className={styles.categoryLabel}>Back to Categories</span>
            </button>
            {categories
              .find((cat) => cat.value === activeCategory)
              ?.subcategories.map((sub) => (
                <button
                  key={sub}
                  className={styles.categoryButton}
                  onClick={() => {
                    setCategoryFilter(activeCategory);
                    setActiveCategory(null);
                  }}
                  type="button"
                >
                  <span className={styles.categoryLabel}>{sub}</span>
                </button>
              ))}
          </>
        )}
      </div>
    </div>
  );
}

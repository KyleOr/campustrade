import styles from "./marketplacefilter.module.css";
import {
  Book,
  Sofa,
  Car,
  GraduationCap,
  Shirt,
  Laptop,
  MoreHorizontal,
  ChevronRight,
} from "lucide-react";

const categories = [
  { value: "books", label: "Books & Notes", icon: Book },
  { value: "furniture", label: "Furniture", icon: Sofa },
  { value: "vehicle", label: "Vehicles", icon: Car },
  { value: "tutoring", label: "Tutoring", icon: GraduationCap },
  { value: "clothes", label: "Clothes", icon: Shirt },
  { value: "technology", label: "Technology", icon: Laptop },
  { value: "custom", label: "Other", icon: MoreHorizontal },
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

      <div className={styles.categoryButtonGroup}>
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.value}
              className={`${styles.categoryButton} ${
                categoryFilter === cat.value ? styles.activeCategory : ""
              }`}
              onClick={() => setCategoryFilter(cat.value)}
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
        })}
      </div>
    </div>
  );
}

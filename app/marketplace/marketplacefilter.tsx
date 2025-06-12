import styles from "./marketplacefilter.module.css";

type MarketplaceFilterProps = {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  categoryFilter: string;
  setCategoryFilter: (v: string) => void;
  minPrice: string;
  setMinPrice: (v: string) => void;
  maxPrice: string;
  setMaxPrice: (v: string) => void;
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
}: MarketplaceFilterProps) {
  return (
    <div className={styles.sidebar}>
      <h2 className={styles.sidebarTitle}>Filter Listings</h2>

      <input
        type="text"
        placeholder="Search keywords..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
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
        <option value="books">Books & Notes</option>
        <option value="furniture">Furniture</option>
        <option value="bikes">Bikes</option>
        <option value="tutoring">Tutoring</option>
        <option value="clothes">Clothes</option>
        <option value="technology">Technology</option>
        <option value="custom">Other (enter manually)</option>
      </datalist>

      <input
        type="text"
        placeholder="Category keywords..."
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
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
    </div>
  );
}

"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import styles from "./featuredcomponent.module.css";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function FeaturedComponent() {
  const router = useRouter();

  const categories = [
    { label: "Clothes", image: "/clothes-image.jpg" },
    { label: "Technology", image: "/technology-image.jpg" },
    { label: "Furniture", image: "/furniture-image.jpg" },
  ];

  const handleBuyNow = () => {
    router.push("/marketplace");
  };

  const handleCategoryClick = (label: string) => {
    router.push(
      `/marketplace?category=${encodeURIComponent(label.toLowerCase())}`
    );
  };

  return (
    <section className={styles.featured}>
      <div className={styles.banner}>
        <Image
          src="/featuredsectionimage.jpg"
          alt="Featured background"
          fill
          className={styles.bannerImage}
          priority
        />

        <div className={styles.labelContainer}>
          <h2 className={styles.trendingLabel}>Trending Categories</h2>
        </div>

        <div className={styles.buyNowWrapper}>
          <button className={styles.buyNowButton} onClick={handleBuyNow}>
            Buy Now
            <span className={styles.arrowIcon}>
              <ArrowRight size={16} />
            </span>
          </button>
        </div>

        <div className={styles.buttonsContainer}>
          {categories.map((cat, index) => (
            <motion.div
              className={styles.button}
              key={index}
              onClick={() => handleCategoryClick(cat.label)}
              whileHover={{
                scale: 1.1,
                rotate: 5,
                transition: { type: "spring", stiffness: 300 },
              }}
              whileTap={{
                scale: 1.05,
                rotate: 2,
                transition: { type: "spring", stiffness: 250 },
              }}
            >
              <div className={styles.buttonLabel}>{cat.label}</div>
              <div className={styles.buttonPlaceholder}>
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  className={styles.image}
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 120px"
                  priority={index === 0}
                />
                <div className={styles.iconOverlay}>
                  <ArrowRight size={16} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

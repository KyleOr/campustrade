"use client";
import { motion } from "framer-motion";
import styles from "./featuredcomponent.module.css";
import { ArrowRight } from "lucide-react";

export default function FeaturedComponent() {
  // Define the images to be used for each category
  const images = [
    "/clothes-image.jpg",
    "/technology-image.jpg",
    "/furniture-image.jpg",
  ];

  return (
    <section className={styles.featured}>
      <div className={styles.banner}>
        {/* Trending Label */}
        <div className={styles.labelContainer}>
          <h2 className={styles.trendingLabel}>Trending Categories</h2>
        </div>

        {/* CTA Button */}
        <div className={styles.buyNowWrapper}>
          <button className={styles.buyNowButton}>
            Buy Now
            <span className={styles.arrowIcon}>
              <ArrowRight size={16} />
            </span>
          </button>
        </div>

        {/* Category Buttons */}
        <div className={styles.buttonsContainer}>
          <motion.div
            className={styles.button}
            whileHover={{
              scale: 1.1, // Scale up the button on hover
              rotate: 5, // Add slight rotation
              transition: { type: "spring", stiffness: 300 }, // Smooth spring transition
            }}
            whileTap={{
              scale: 1.05, // Slightly reduce the scale on tap (for mobile interaction)
              rotate: 2, // Slight rotation on tap
              transition: { type: "spring", stiffness: 250 },
            }}
          >
            <div className={styles.buttonLabel}>Clothes</div>
            <div
              className={styles.buttonPlaceholder}
              style={{ backgroundImage: `url(${images[0]})` }} // Dynamically set the background image
            >
              <div className={styles.iconOverlay}>
                <ArrowRight size={16} />
              </div>
            </div>
          </motion.div>

          <motion.div
            className={styles.button}
            whileHover={{
              scale: 1.1, // Scale up the button on hover
              rotate: 5, // Add slight rotation
              transition: { type: "spring", stiffness: 300 }, // Smooth spring transition
            }}
            whileTap={{
              scale: 1.1,
              rotate: 2, // Slight rotation on tap
              transition: { type: "spring", stiffness: 250 },
            }}
          >
            <div className={styles.buttonLabel}>Technology</div>
            <div
              className={styles.buttonPlaceholder}
              style={{ backgroundImage: `url(${images[1]})` }} // Dynamically set the background image
            >
              <div className={styles.iconOverlay}>
                <ArrowRight size={16} />
              </div>
            </div>
          </motion.div>

          <motion.div
            className={styles.button}
            whileHover={{
              scale: 1.1, // Scale up the button on hover
              rotate: 5, // Add slight rotation
              transition: { type: "spring", stiffness: 300 }, // Smooth spring transition
            }}
            whileTap={{
              scale: 1.1,
              rotate: 2, // Slight rotation on tap
              transition: { type: "spring", stiffness: 250 },
            }}
          >
            <div className={styles.buttonLabel}>Furniture</div>
            <div
              className={styles.buttonPlaceholder}
              style={{ backgroundImage: `url(${images[2]})` }} // Dynamically set the background image
            >
              <div className={styles.iconOverlay}>
                <ArrowRight size={16} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

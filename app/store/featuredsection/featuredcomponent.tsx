"use client";
import { motion } from "framer-motion";
import styles from "./featuredcomponent.module.css";

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
        <div className={styles.buttonsContainer}>
          <motion.div
            className={styles.button}
            whileHover={{
              scale: 1.1, // Scale up the button on hover
              rotate: 5, // Add slight rotation
              transition: { type: "spring", stiffness: 300 }, // Smooth spring transition
            }}
          >
            <div className={styles.buttonLabel}>Clothes</div>
            <div
              className={styles.buttonPlaceholder}
              style={{ backgroundImage: `url(${images[0]})` }} // Dynamically set the background image
            ></div>
          </motion.div>

          <motion.div
            className={styles.button}
            whileHover={{
              scale: 1.1, // Scale up the button on hover
              rotate: 5, // Add slight rotation
              transition: { type: "spring", stiffness: 300 }, // Smooth spring transition
            }}
          >
            <div className={styles.buttonLabel}>Technology</div>
            <div
              className={styles.buttonPlaceholder}
              style={{ backgroundImage: `url(${images[1]})` }} // Dynamically set the background image
            ></div>
          </motion.div>

          <motion.div
            className={styles.button}
            whileHover={{
              scale: 1.1, // Scale up the button on hover
              rotate: 5, // Add slight rotation
              transition: { type: "spring", stiffness: 300 }, // Smooth spring transition
            }}
          >
            <div className={styles.buttonLabel}>Furniture</div>
            <div
              className={styles.buttonPlaceholder}
              style={{ backgroundImage: `url(${images[2]})` }} // Dynamically set the background image
            ></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

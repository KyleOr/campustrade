"use client";
import styles from "./featuredevents.module.css";
import { motion } from "framer-motion";

interface FeaturedEventsProps {
  isActive?: boolean;
}

export default function FeaturedEvents({
  isActive = true,
}: FeaturedEventsProps) {
  return (
    <motion.section
      className={styles.eventsContainer}
      initial={!isActive ? { opacity: 0 } : undefined}
      animate={isActive ? { opacity: 1 } : { opacity: 0.5 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.eventsContent}>
        <h2 className={styles.eventsTitle}>Upcoming Campus Events</h2>

        <div className={styles.eventsList}>
          <motion.div
            className={styles.eventCard}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <h3>Spring Flea Market</h3>
            <p>April 15, 10AM - 4PM</p>
            <p>Main Quadrangle</p>
          </motion.div>

          <motion.div
            className={styles.eventCard}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <h3>Tech Swap Meet</h3>
            <p>April 22, 12PM - 6PM</p>
            <p>Engineering Building</p>
          </motion.div>

          <motion.div
            className={styles.eventCard}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <h3>Book Exchange Day</h3>
            <p>April 29, 9AM - 3PM</p>
            <p>Library Courtyard</p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

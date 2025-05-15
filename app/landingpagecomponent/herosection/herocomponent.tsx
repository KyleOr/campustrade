"use client";
import styles from "./herocomponent.module.css";
import { motion } from "framer-motion";

export default function HeroComponent() {
  return (
    <div>
      {/* Invisible Spacer Element to keep the screen at 0,0 */}
      <div className={styles.spacer}></div>

      <motion.section
        className={styles.hero}
        initial={{ opacity: 0, y: 300 }}
        animate={{ opacity: 100, y: 0 }}
        transition={{ duration: 1.5, ease: "anticipate" }}
      >
        <h1 className={styles.title}>CampusTrade</h1>
        <div className={styles.subtextContainer}>
          <p className={styles.subtextLeft}>
            Buy & sell with fellow students — books, gadgets, furniture, and
            more.
          </p>
          <p className={styles.subtextRight}>
            Fast. Local. Student-powered. Let&apos;s trade smarter.
          </p>
        </div>
      </motion.section>
    </div>
  );
}

"use client";
import styles from "./footercomponent.module.css";

export default function FooterComponent() {
  return (
    <footer className={styles.footer}>
      <div className={styles.mainContent}>{/* Future content goes here */}</div>

      <div className={styles.marqueeRow}>
        <div className={styles.marqueeContent}>
          {Array(20)
            .fill("CampusTrade")
            .map((text, index) => (
              <span key={index} className={styles.marqueeText}>
                {text}
              </span>
            ))}
        </div>
      </div>
    </footer>
  );
}

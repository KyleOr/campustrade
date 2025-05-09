"use client";
import { ArrowRight } from "lucide-react";
import styles from "./calltoactioncomponent.module.css";
import Image from "next/image";

export default function CallToActionComponent() {
  return (
    <section className={styles.section}>
      {/* Background image using next/image */}
      <Image
        src="/calltoaction.jpg"
        alt="Call to action background"
        layout="fill"
        className={styles.backgroundImage}
        priority
      />

      <div className={styles.content}>
        <h2 className={styles.heading}>Ready to trade on campus?</h2>
        <div className={styles.buttonsWrapper}>
          <div className={styles.buyNowWrapper}>
            <button className={styles.buyNowButton}>
              Sign Up
              <span className={styles.arrowIcon}>
                <ArrowRight size={16} />
              </span>
            </button>
          </div>
          <div className={styles.buyNowWrapper}>
            <button className={styles.buyNowButton}>
              Browse Now
              <span className={styles.arrowIcon}>
                <ArrowRight size={16} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

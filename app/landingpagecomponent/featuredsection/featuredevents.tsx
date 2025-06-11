"use client";
import styles from "./featuredevents.module.css";
import Image from "next/image";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

export default function FeaturedEvents() {
  return (
    <section className={styles.featured}>
      <div className={styles.banner}>
        <Image
          src="/featuredevent.jpg"
          alt="Coffee training event background"
          fill
          className={styles.bannerImage}
          priority
        />
        <div className={styles.content}>
          <h2 className={styles.title}>Coffee Training Workshop</h2>
          <div className={styles.details}>
            Master the art of coffee making!
            <br />
            Join our hands-on barista training and learn latte art, espresso
            basics, and more.
            <br />
            <span className={styles.eventDetail}>
              <Calendar size={18} style={{ marginRight: "8px" }} />
              July 20, 2–5pm
            </span>
            <span className={styles.eventDetail}>
              <MapPin size={18} style={{ marginRight: "8px" }} />
              Campus Café, Building B
            </span>
          </div>
          <div className={styles.buyNowWrapper}>
            <button className={styles.buyNowButton}>
              Join Now
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

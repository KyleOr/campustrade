"use client";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import styles from "./calltoactioncomponent.module.css";
import Image from "next/image";

export default function CallToActionComponent() {
  const router = useRouter();

  const handleSignUp = () => {
    router.push("/auth");
  };

  const handleBrowseNow = () => {
    router.push("/marketplace");
  };

  return (
    <section className={styles.section}>
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
            <button className={styles.buyNowButton} onClick={handleSignUp}>
              Sign Up
              <span className={styles.arrowIcon}>
                <ArrowRight size={16} />
              </span>
            </button>
          </div>
          <div className={styles.buyNowWrapper}>
            <button className={styles.buyNowButton} onClick={handleBrowseNow}>
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

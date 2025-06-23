"use client";
import styles from "./featuredevents.module.css";
import Image from "next/image";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

export interface FeaturedEventData {
  title: string;
  image: string;
  description: string;
  date: string;
  location: string;
  cta: string;
  ctaLink: string;
}

export default function FeaturedEvents(props: FeaturedEventData) {
  return (
    <section className={styles.featured}>
      <div className={styles.banner}>
        <Image
          src={props.image}
          alt={props.title}
          fill
          className={styles.bannerImage}
          priority
        />
        <div className={styles.content}>
          <h2 className={styles.title}>{props.title}</h2>
          <div className={styles.details}>
            {props.description.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
            <span className={styles.eventDetail}>
              <Calendar size={18} style={{ marginRight: "8px" }} />
              {props.date}
            </span>
            <span className={styles.eventDetail}>
              <MapPin size={18} style={{ marginRight: "8px" }} />
              {props.location}
            </span>
          </div>
          <div className={styles.buyNowWrapper}>
            <Link href={props.ctaLink} className={styles.buyNowButton}>
              {props.cta}
              <span className={styles.arrowIcon}>
                <ArrowRight size={16} />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

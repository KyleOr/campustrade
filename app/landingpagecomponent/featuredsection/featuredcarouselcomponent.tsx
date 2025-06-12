"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TrendingCategories from "./trendingcategories";
import FeaturedEvents from "./featuredevents";
import styles from "./featuredcarousel.module.css";

export default function FeaturedCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const carouselItems = [
    <TrendingCategories key="trending" />,
    <FeaturedEvents key="events" />,
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === carouselItems.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? carouselItems.length - 1 : prev - 1
    );
  };

  // Auto-rotate every 8 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.carouselContainer}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.slide}
        >
          {carouselItems[currentIndex]}
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows - modern design */}
      <div className={styles.navigationContainer}>
        <button
          onClick={prevSlide}
          className={styles.navButton}
          aria-label="Previous slide"
        >
          <ChevronLeft size={25} />
        </button>
        <button
          onClick={nextSlide}
          className={styles.navButton}
          aria-label="Next slide"
        >
          <ChevronRight size={25} />
        </button>
      </div>

      {/* Indicators */}
      <div className={styles.indicators}>
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`${styles.indicator} ${
              index === currentIndex ? styles.indicatorActive : ""
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

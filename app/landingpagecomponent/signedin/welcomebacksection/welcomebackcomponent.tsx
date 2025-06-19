"use client";
import styles from "./welcomebackcomponent.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import type { User } from "firebase/auth";

interface WelcomeBackComponentProps {
  user: User;
}

export default function WelcomeBackComponent({
  user,
}: WelcomeBackComponentProps) {
  const username =
    user.displayName || (user.email ? user.email.split("@")[0] : "Student");

  const [showInitial, setShowInitial] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitial(false);
    }, 2300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.rootContainer}>
      <AnimatePresence mode="wait">
        {showInitial ? (
          <InitialView key="initial" />
        ) : (
          <WelcomeView key="welcome" username={username} />
        )}
      </AnimatePresence>
    </div>
  );
}

// Completely separate component for initial view
function InitialView() {
  const variants = {
    hidden: { opacity: 0, y: 300 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.5, ease: "anticipate" },
    },
    exit: {
      opacity: 0,
      x: -300,
      transition: { duration: 0.8, ease: "anticipate" },
    },
  };

  return (
    <motion.section
      className={styles.initialContainer}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
    >
      <motion.h1
        className={styles.initialTitle}
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        CampusTrade
      </motion.h1>
      <motion.div
        className={styles.initialSubtext}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <p className={styles.subtextLeft}>
          Buy & sell with fellow students — books, gadgets, furniture, and more.
        </p>
        <p className={styles.subtextRight}>
          Fast. Local. Student-powered. Let&apos;s trade smarter.
        </p>
      </motion.div>
    </motion.section>
  );
}

// Completely separate component for welcome view
function WelcomeView({ username }: { username: string }) {
  const variants = {
    hidden: { opacity: 0, x: 300 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "anticipate" },
    },
  };

  return (
    <motion.section
      className={styles.welcomeContainer}
      initial="hidden"
      animate="visible"
      variants={variants}
    >
      <h2 className={styles.welcomeText}>Welcome back,</h2>
      <h3 className={styles.username}>{username}</h3>
    </motion.section>
  );
}

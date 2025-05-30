"use client";
import { motion } from "framer-motion";
import styles from "./guidecomponent.module.css";
import Image from "next/image";

const steps = [
  {
    title: "Create an account",
    description:
      "Sign up using your campus email to start trading safely. With just a few clicks, you'll be able to access all the features of the platform and begin listing your items for sale or finding great deals from fellow students.",
    image: "/createaccount.jpg",
  },
  {
    title: "Post your listing",
    description:
      "List items you no longer need and set your own price. Whether it's clothes, electronics, or textbooks, quickly upload photos and write a short description to make your listing stand out to potential buyers.",
    image: "/postlisting.jpg",
  },
  {
    title: "Chat securely",
    description:
      "Message buyers or sellers directly on the platform. Our secure messaging system allows you to communicate without sharing your personal contact details, ensuring your privacy while negotiating or arranging a meet-up.",
    image: "/chatsecurely.jpg",
  },
  {
    title: "Meet up on campus",
    description:
      "Arrange a safe meet-up location right on campus. Choose a public and easily accessible spot to meet with buyers or sellers, ensuring a smooth and secure transaction for both parties.",
    image: "/meetoncampus.jpg",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function GuideComponent() {
  return (
    <motion.section
      className={styles.guideSection}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <motion.h2 className={styles.title} variants={itemVariants}>
        How It Works
      </motion.h2>

      <motion.div className={styles.stepsContainer}>
        {steps.map((step, index) => (
          <motion.div
            className={`${styles.step} ${
              index % 2 === 0 ? styles.normal : styles.reversed
            }`}
            key={index}
            variants={itemVariants}
          >
            <motion.div
              className={`${styles.text} ${
                index % 2 === 0 ? styles.textLeft : styles.textRight
              }`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <motion.h3 transition={{ type: "spring", stiffness: 300 }}>
                {step.title}
              </motion.h3>
              <motion.p>{step.description}</motion.p>
            </motion.div>

            <motion.div
              className={styles.imageWrapper}
              initial={{
                opacity: 0,
                scale: 0.9,
                x: index % 2 === 0 ? 100 : -100,
              }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              viewport={{ once: true }}
            >
              <Image
                src={step.image}
                alt={step.title}
                fill
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index === 0}
              />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

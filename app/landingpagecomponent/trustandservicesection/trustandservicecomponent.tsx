"use client";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  BadgeCheck,
  School,
  PackageCheck,
  ShieldCheck,
  Users,
  Clock,
  Handshake,
  Smartphone,
} from "lucide-react";
import styles from "./trustandservicecomponent.module.css";

const trustPoints = [
  {
    title: "Verified Student Accounts",
    description:
      "Every user is authenticated with a valid campus email address, ensuring a trusted community of real students.",
    icon: <BadgeCheck size={48} strokeWidth={1.5} />,
    color: "#6366f1",
  },
  {
    title: "Campus-Only Marketplace",
    description:
      "All transactions happen face-to-face within your university community, creating a safe local exchange network.",
    icon: <School size={48} strokeWidth={1.5} />,
    color: "#10b981",
  },
  {
    title: "Instant Exchanges",
    description:
      "Meet up and trade items immediately with no shipping delays, handling fees, or delivery uncertainties.",
    icon: <PackageCheck size={48} strokeWidth={1.5} />,
    color: "#f59e0b",
  },
  {
    title: "Secure Platform",
    description:
      "Built-in verification and rating system ensures safe transactions between campus members.",
    icon: <ShieldCheck size={48} strokeWidth={1.5} />,
    color: "#ef4444",
  },
];

export default function TrustAndServiceComponent() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Why CampusTrade?
        </motion.h2>
        <div className={styles.trustItems}>
          {trustPoints.map((point, index) => (
            <TiltCard key={index} color={point.color}>
              <div className={styles.iconWrapper}>{point.icon}</div>
              <h3>{point.title}</h3>
              <p>{point.description}</p>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function TiltCard({
  children,
  color,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  const ref = useRef(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useTransform(y, [0, 1], [10, -10]);
  const rotateY = useTransform(x, [0, 1], [-10, 10]);
  const scale = useTransform(
    [x, y],
    ([xVal, yVal]) => 1 + (xVal - 0.5) * 0.04 + (yVal - 0.5) * 0.04
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;

    const xVal = (e.clientX - bounds.left) / bounds.width;
    const yVal = (e.clientY - bounds.top) / bounds.height;
    x.set(xVal);
    y.set(yVal);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      className={styles.trustItem}
      style={{
        rotateX,
        rotateY,
        scale,
        transformPerspective: 1000,
        background: `linear-gradient(135deg, rgba(255,255,255,0.03) 0%, ${color}20 100%)`,
        borderTop: `1px solid ${color}30`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
}

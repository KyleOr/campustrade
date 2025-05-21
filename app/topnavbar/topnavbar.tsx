"use client";
import styles from "./topnavbar.module.css";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import SearchComponent from "./searchcomponent/searchcomponent";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { motion, AnimatePresence, SVGMotionProps } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import BookmarkModal from "../components/bookmarkmodal";

export default function TopNavbar() {
  const [showSearch, setShowSearch] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        const name = user.email.split("@")[0];
        setUsername(name);
      } else {
        setUsername(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "Search", onClick: () => setShowSearch(true) },
    { name: "Bookmarks", onClick: () => setShowBookmarks(true) },
    {
      name: username ? username : "Sign In",
      href: username ? `/${username}` : "/auth",
    },
  ];

  const sidebarVariants = {
    open: {
      clipPath: `circle(1500px at 40px 40px)`,
      transition: {
        type: "spring",
        stiffness: 20,
      },
    },
    closed: {
      clipPath: "circle(30px at 40px 40px)",
      transition: {
        delay: 0.2,
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const navVariants = {
    open: {
      transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  };

  const itemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
      },
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 },
      },
    },
  };

  const Path = (props: SVGMotionProps<SVGPathElement>) => (
    <motion.path
      fill="transparent"
      strokeWidth="3"
      stroke="hsl(0, 0%, 18%)"
      strokeLinecap="round"
      {...props}
    />
  );

  const MenuToggle = () => (
    <button className={styles.menuToggle} onClick={() => setIsOpen(!isOpen)}>
      <motion.svg
        width="23"
        height="23"
        viewBox="0 0 23 23"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
      >
        <Path
          variants={{
            closed: {
              d: "M 2 2.5 L 20 2.5",
              transition: { duration: 0.4 },
            },
            open: {
              d: "M 3 16.5 L 17 2.5",
              transition: { duration: 0.4 },
            },
          }}
        />
        <Path
          d="M 2 9.423 L 20 9.423"
          variants={{
            closed: {
              opacity: 1,
              transition: { duration: 0.2 },
            },
            open: {
              opacity: 0,
              transition: { duration: 0.2 },
            },
          }}
        />
        <Path
          variants={{
            closed: {
              d: "M 2 16.346 L 20 16.346",
              transition: { duration: 0.4 },
            },
            open: {
              d: "M 3 2.5 L 17 16.346",
              transition: { duration: 0.4 },
            },
          }}
        />
      </motion.svg>
    </button>
  );

  return (
    <>
      <nav className={styles.navbar} ref={containerRef}>
        {isMobile && <MenuToggle />}

        {!isMobile ? (
          <ul className={styles.navList}>
            {navItems.map((item, index) => (
              <li key={index} className={styles.navItem}>
                {item.href ? (
                  <Link href={item.href}>{item.name}</Link>
                ) : (
                  <span onClick={item.onClick}>{item.name}</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className={styles.mobileNav}
                initial="closed"
                animate="open"
                exit="closed"
                variants={sidebarVariants}
              >
                <motion.ul
                  className={styles.mobileNavList}
                  variants={navVariants}
                >
                  {navItems.map((item, index) => (
                    <motion.li
                      key={index}
                      className={styles.mobileNavItem}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.href ? (
                        <Link href={item.href} onClick={() => setIsOpen(false)}>
                          {item.name}
                        </Link>
                      ) : (
                        <span
                          onClick={() => {
                            if (item.onClick) item.onClick();
                            setIsOpen(false);
                          }}
                        >
                          {item.name}
                        </span>
                      )}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </nav>

      {showSearch && <SearchComponent onClose={() => setShowSearch(false)} />}
      {showBookmarks && (
        <BookmarkModal onClose={() => setShowBookmarks(false)} />
      )}
    </>
  );
}

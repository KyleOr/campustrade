"use client";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
} from "firebase/auth";
import { createUserInFirestore } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import styles from "./authpage.module.css";
import Image from "next/image";
import authImage from "/public/auth.jpg";
import { motion, AnimatePresence } from "framer-motion";
import TopNavbar from "../topnavbar/topnavbar";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        const username = email.split("@")[0];
        router.push(`/${username}`);
      } else {
        if (password !== confirmPassword) {
          alert("Passwords do not match");
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        await createUserInFirestore(user.uid, email);
        alert("Registered!");
        const username = email.split("@")[0];
        router.push(`/${username}`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unknown error occurred.");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const additionalUserInfo = getAdditionalUserInfo(result);
      if (additionalUserInfo?.isNewUser) {
        await createUserInFirestore(
          user.uid,
          user.email || "unknown@email.com"
        );
      }

      const username = (user.email || "").split("@")[0];
      router.push(`/${username}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unknown error occurred.");
      }
    }
  };

  return (
    <>
      <TopNavbar />
      <div className={styles.container}>
        <div className={styles.left}>
          <Image
            src={authImage}
            alt="Login illustration"
            className={styles.authImage}
            fill
            style={{ objectFit: "cover" }}
          />

          <div className={styles.overlay}></div>

          <div className={styles.overlayContent}>
            <div className={styles.logo}>CampusTrade</div>

            <div className={styles.bottomContent}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? "loginText" : "registerText"}
                  initial={{ opacity: 0, filter: "blur(6px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(6px)" }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                >
                  <div className={styles.welcomeText}>
                    {isLogin ? "Welcome back!" : "Let's get you registered!"}
                  </div>
                  <div className={styles.welcomeSubtext}>
                    {isLogin
                      ? "Log in to your account to access the marketplace and connect with students."
                      : "Create a new account to start trading with students on campus."}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className={styles.footer}>
                CampusTrade © 2025 — All rights reserved
              </div>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "register"}
              className={styles.right}
              initial={{ x: isLogin ? 50 : -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isLogin ? 50 : -50, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              <h2 className={styles.heading}>
                {isLogin ? "Login" : "Register"}
              </h2>
              <p className={styles.subheading}>
                {isLogin
                  ? "Welcome back! Please log in to your account"
                  : "Create an account to start using the CampusTrade"}
              </p>

              <label className={styles.label} htmlFor="email">
                Email
              </label>
              <input
                className={styles.input}
                id="email"
                placeholder="e.g. john@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label className={styles.label} htmlFor="password">
                Password
              </label>
              <input
                className={styles.input}
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {!isLogin && (
                <>
                  <label className={styles.label} htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <input
                    className={styles.input}
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </>
              )}

              <div className={styles.remember}>
                <input
                  type="checkbox"
                  id="remember"
                  style={{ marginRight: 8 }}
                />
                <label htmlFor="remember">Remember me</label>
              </div>

              <button className={styles.button} onClick={handleSubmit}>
                {isLogin ? "Login" : "Register"}
              </button>

              <p className={styles.toggle}>
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <button
                  className={styles.link}
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Register" : "Sign In"}
                </button>
              </p>

              <p className={styles.divider}>or continue with</p>
              <div className={styles.googleButtonWrapper}>
                <button
                  className={styles.googleButton}
                  onClick={handleGoogleSignIn}
                >
                  <Image
                    src="/continuewithgoogle.svg"
                    alt="Continue with Google"
                    width={240}
                    height={30}
                    priority
                  />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

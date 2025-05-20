"use client";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { createUserInFirestore } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import styles from "./authpage.module.css";
import Image from "next/image";
import authImage from "/public/auth.jpg";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const username = email.split("@")[0];
        router.push(`/${username}`);
      } else {
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
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Image
          src={authImage}
          alt="Login illustration"
          className={styles.authImage}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className={styles.right}>
        <h2 className={styles.heading}>{isLogin ? "Login" : "Register"}</h2>

        <input
          className={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={styles.input}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={styles.button} onClick={handleSubmit}>
          {isLogin ? "Login" : "Register"}
        </button>
        <p className={styles.toggle}>
          {isLogin ? "Need an account?" : "Already have an account?"}{" "}
          <button className={styles.link} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

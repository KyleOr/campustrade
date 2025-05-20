import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB4OFs15LqaNAf3M7mGEqnayurcxGxKMuw",
  authDomain: "campustrade-89529.firebaseapp.com",
  projectId: "campustrade-89529",
  storageBucket: "campustrade-89529.appspot.com",
  messagingSenderId: "625833509581",
  appId: "1:625833509581:web:fda7a1776b34ac06e7df84",
  measurementId: "G-FCRENGHG4H",
};

// Save user to Firestore
const createUserInFirestore = async (uid: string, email: string) => {
  const username = email.split("@")[0];
  await setDoc(doc(db, "users", uid), {
    uid,
    email,
    username,
    createdAt: new Date().toISOString(),
  });
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export { createUserInFirestore };
export const storage = getStorage(app);

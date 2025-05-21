"use client";
import { Suspense } from "react";
import TopNavbar from "@/app/topnavbar/topnavbar";
import styles from "./marketplacepage.module.css";
import MarketplaceClient from "./marketplaceclient";

export default function MarketplacePage() {
  return (
    <>
      <TopNavbar />
      <div className={styles.page}>
        <Suspense fallback={<div>Loading...</div>}>
          <MarketplaceClient />
        </Suspense>
      </div>
    </>
  );
}

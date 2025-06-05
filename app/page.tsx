"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, getAuth, User } from "firebase/auth";
import styles from "./storepage.module.css";

import TopNavbar from "./topnavbar/topnavbar";
import HeroComponent from "./landingpagecomponent/herosection/herocomponent";
import FeaturedComponent from "./landingpagecomponent/featuredsection/featuredcomponent";
import GuideComponent from "./landingpagecomponent/guidesection/guidecomponent";
import TrustAndServiceComponent from "./landingpagecomponent/trustandservicesection/trustandservicecomponent";
import CallToActionComponent from "./landingpagecomponent/calltoactionsection/calltoactioncomponent";
import FooterComponent from "./landingpagecomponent/footersection/footercomponent";

import WelcomeBackComponent from "./landingpagecomponent/signedin/welcomebacksection/welcomebackcomponent";

export default function StorePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <TopNavbar />
      <div className={styles.container}>
        {user ? <WelcomeBackComponent user={user} /> : <HeroComponent />}
        <FeaturedComponent />
        <GuideComponent />
        <TrustAndServiceComponent />
        <CallToActionComponent />
        <FooterComponent />
      </div>
    </>
  );
}

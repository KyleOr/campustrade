import styles from "./storepage.module.css";
import HeroComponent from "./landingpagecomponent/herosection/herocomponent";
import FeaturedComponent from "./landingpagecomponent/featuredsection/featuredcomponent";
import TopNavbar from "./topnavbar/topnavbar";
import GuideComponent from "./landingpagecomponent/guidesection/guidecomponent";
import TrustAndServiceComponent from "./landingpagecomponent/trustandservicesection/trustandservicecomponent";

export default function StorePage() {
  return (
    <div className={styles.container}>
      <TopNavbar />
      <HeroComponent />
      <FeaturedComponent />
      <GuideComponent />
      <TrustAndServiceComponent />
    </div>
  );
}

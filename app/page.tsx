import styles from "./storepage.module.css";
import HeroComponent from "./landingpagecomponent/herosection/herocomponent";
import FeaturedComponent from "./landingpagecomponent/featuredsection/featuredcomponent";
import TopNavbar from "./topnavbar/topnavbar";
import GuideComponent from "./landingpagecomponent/guidesection/guidecomponent";
import TrustAndServiceComponent from "./landingpagecomponent/trustandservicesection/trustandservicecomponent";
import CallToActionComponent from "./landingpagecomponent/calltoactionsection/calltoactioncomponent";
import FooterComponent from "./landingpagecomponent/footersection/footercomponent";

export default function StorePage() {
  return (
    <>
      <TopNavbar />
      <div className={styles.container}>
        <HeroComponent />
        <FeaturedComponent />
        <GuideComponent />
        <TrustAndServiceComponent />
        <CallToActionComponent />
        <FooterComponent />
      </div>
    </>
  );
}

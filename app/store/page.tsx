import styles from "./storepage.module.css";
import HeroComponent from "./herosection/herocomponent";
import FeaturedComponent from "./featuredsection/featuredcomponent";
import TopNavbar from "../topnavbar/topnavbar";

export default function StorePage() {
  return (
    <div className={styles.container}>
      <TopNavbar />
      <HeroComponent />
      <FeaturedComponent />
    </div>
  );
}

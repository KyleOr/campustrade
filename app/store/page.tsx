import styles from "./storepage.module.css";
import HeroComponent from "./herosection/herocomponent";
import FeaturedComponent from "./featuredsection/featuredcomponent";

export default function StorePage() {
  return (
    <div className={styles.container}>
      <HeroComponent />
      <FeaturedComponent />
    </div>
  );
}

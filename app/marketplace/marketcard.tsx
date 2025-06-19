import styles from "./marketcard.module.css";

type MarketCardProps = {
  title: string;
  price: number;
  username: string;
  onClick: () => void;
};

export default function MarketCard({
  title,
  price,
  username,
  onClick,
}: MarketCardProps) {
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.imagePlaceholder} />
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardPrice}>${price}</p>
      <p className={styles.cardMeta}>Posted by: {username}</p>
    </div>
  );
}

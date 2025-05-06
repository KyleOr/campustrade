"use client";
import styles from "./footercomponent.module.css";

export default function FooterComponent() {
  return (
    <footer className={styles.footer}>
      <div className={styles.mainContent}>
        <div className={styles.columns}>
          <div className={styles.column}>
            <h4>Contact</h4>
            <ul>
              <li>
                <a href="mailto:hello@campustrade.com">hello@campustrade.com</a>
              </li>
              <li>
                <a href="mailto:support@campustrade.com">
                  support@campustrade.com
                </a>
              </li>
              <li>
                <a href="tel:+1234567890">+123 456 7890</a>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4>Social Media</h4>
            <ul>
              <li>
                <a href="#">Instagram</a>
              </li>
              <li>
                <a href="#">Twitter/X</a>
              </li>
              <li>
                <a href="#">LinkedIn</a>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4>Company</h4>
            <ul>
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
              <li>
                <a href="#">Press</a>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4>Terms & Policy</h4>
            <ul>
              <li>
                <a href="#">Terms of Service</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Cookie Policy</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.marqueeRow}>
        <div className={styles.marqueeContent}>
          {Array(20)
            .fill("CampusTrade")
            .map((text, index) => (
              <span key={index} className={styles.marqueeText}>
                {text}
              </span>
            ))}
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import styles from "./styles.module.css";

function Footer({ dict }) {
  return (
    <footer className={styles.footer}>
      <nav className={`${styles.footerMenu} container`}>
        <div>
          <h3>{dict.contactUs}</h3>
          <ul>
            <li>email@gmail.com</li>
            <li>+212 6 77 88 99 00</li>
            <li>XYZ Street Agadir</li>
            <li className={styles.icons}></li>
          </ul>
        </div>

        <div>
          <h3>{dict.linkMenu}</h3>
          <ul>
            <li>
              <Link href="/">{dict.homepage}</Link>
            </li>
            <li>
              <Link href="/rooms">{dict.rooms}</Link>
            </li>

            {/* <li>Blog</li> */}
            <li>
              <Link href={"/contact"}>{dict.contactUs}</Link>
            </li>

            <li>
              <Link href="/signin">{dict.guestArea}</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3>{dict.newsletterTitle}</h3>
          <li className={styles.newsletter}>
            <input type="text" placeholder="example@mail.com" />
            <button>{dict.submit}</button>
          </li>
        </div>
      </nav>
    </footer>
  );
}

export default Footer;

import Link from "next/link";
import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHistory, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import { signOutAction } from "../_lib/actions";
import { getLocale } from "../_lib/i18n/getLocale";
import { getDictionary } from "../_lib/i18n";

function Layout({ children }) {
  const dict = getDictionary(getLocale());
  return (
    <section className={styles.accountLayout}>
      <aside className={styles.accountSidebar}>
        <ul className={styles.sidebarList}>
          <li>
            <Link href={"/account/history"} className={styles.sidebarLink}>
              <span>
                <FontAwesomeIcon icon={faHistory} />
              </span>
              <span>{dict.account.history}</span>
            </Link>
          </li>
          <li>
            <Link href={"/account/profile"} className={styles.sidebarLink}>
              <span>
                <FontAwesomeIcon icon={faUser} />
              </span>
              <span>{dict.account.profile}</span>
            </Link>
          </li>
          <li>
            <form action={signOutAction}>
              <button className={styles.sidebarButton}>
                <span>
                  <FontAwesomeIcon icon={faSignOut} />
                </span>
                <span>{dict.account.signOut}</span>
              </button>
            </form>
          </li>
        </ul>
      </aside>
      <div className={styles.content}>{children}</div>
    </section>
  );
}

export default Layout;

"use client";
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import fa_styles from "@fortawesome/fontawesome-svg-core/styles.css";
import { useState } from "react";
import { usePathname } from "next/navigation";
import GuestDropdown from "./GuestDropdown/GuestDropdown";
import LanguageSwitcher from "./LanguageSwitcher";

function Navbar({ user, signOutAction, dict, locale, errors }) {
  const [hideMenu, setHideMenu] = useState(true);
  const pathname = usePathname();
  return (
    <header>
      <div className="container header-items">
        <h2>LOGO</h2>
        <nav className={`navbar ${hideMenu ? "hide-menu" : "show-menu"}`}>
          <ul>
            <li>
              <Link className={pathname === "/" ? "active" : ""} href="/" onClick={() => setHideMenu(true)}>
                {dict.home}
              </Link>
            </li>
            <li>
              <Link
                className={pathname.includes("rooms") ? "active" : ""}
                href="/rooms"
                onClick={() => setHideMenu(true)}
              >
                {dict.rooms}
              </Link>
            </li>
            {/* <li>About</li> */}
            <li>
              <Link
                href={"/contact"}
                className={pathname === "/contact" ? "active" : ""}
                onClick={() => setHideMenu(true)}
              >
                {dict.contact}
              </Link>
            </li>
            <li>
              {user ? (
                <GuestDropdown user={user} signOutAction={signOutAction} dict={dict} />
              ) : (
                <Link
                  className={pathname.includes("account") || pathname === "/signin" ? "active" : ""}
                  href="/signin"
                  onClick={() => setHideMenu(true)}
                >
                  {dict.guestArea}
                </Link>
              )}
            </li>
          </ul>
        </nav>
        <LanguageSwitcher locale={locale} label={dict.language} errorText={errors.languageChangeFailed} />
        <button
          onClick={() => setHideMenu(!hideMenu)}
          className="toggle-menu-button"
          aria-label={dict.toggleMenu}
        >
          <FontAwesomeIcon icon={hideMenu ? faBars : faClose} />
        </button>
      </div>
    </header>
  );
}

export default Navbar;

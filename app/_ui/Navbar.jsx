"use client";
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import fa_styles from "@fortawesome/fontawesome-svg-core/styles.css";
import { useState } from "react";
import { usePathname } from "next/navigation";
import GuestDropdown from "./GuestDropdown/GuestDropdown";
import LanguageSelector from "./LanguageSelector";

function Navbar({ user, signOutAction, locale, dict }) {
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
                {dict.nav.home}
              </Link>
            </li>
            <li>
              <Link
                className={pathname.includes("rooms") ? "active" : ""}
                href="/rooms"
                onClick={() => setHideMenu(true)}
              >
                {dict.nav.rooms}
              </Link>
            </li>
            {/* <li>About</li> */}
            <li>
              <Link
                href={"/contact"}
                className={pathname === "/contact" ? "active" : ""}
                onClick={() => setHideMenu(true)}
              >
                {dict.nav.contact}
              </Link>
            </li>
            <li>
              {user ? (
                <GuestDropdown user={user} signOutAction={signOutAction} />
              ) : (
                <Link
                  className={pathname.includes("account") || pathname === "/signin" ? "active" : ""}
                  href="/signin"
                  onClick={() => setHideMenu(true)}
                >
                  {dict.nav.guestArea}
                </Link>
              )}
            </li>
          </ul>
        </nav>
        <LanguageSelector locale={locale} label={dict.language.label} />
        <button onClick={() => setHideMenu(!hideMenu)} className="toggle-menu-button">
          <FontAwesomeIcon icon={hideMenu ? faBars : faClose} />
        </button>
      </div>
    </header>
  );
}

export default Navbar;

import { auth } from "@/auth";
import Footer from "./_components/Footer";
import Navbar from "./_ui/Navbar";
import styles from "./styles.css";

import { Roboto } from "next/font/google";
import { signOutAction } from "./_lib/actions";
import { getLocale } from "./_lib/i18n";
import { dictionaries } from "./_lib/i18n/dictionaries";

const roboto_font = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  style: "normal",
});

export default async function RootLayout({ children }) {
  const session = await auth();
  const locale = await getLocale();
  const dict = dictionaries[locale];
  return (
    <html lang={locale}>
      <body className={roboto_font.className}>
        <Navbar
          user={session?.user}
          signOutAction={signOutAction}
          dict={dict.navbar}
          locale={locale}
          errors={dict.errors}
        />
        <main>{children}</main>
        <Footer dict={dict.footer} />
      </body>
    </html>
  );
}

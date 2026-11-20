import { signIn } from "@/auth";
import styles from "./styles.module.css";
import { cookies } from "next/headers";
import { getDictionary } from "@/app/_lib/i18n";

async function OAuthProviderButtons() {
  const dict = (await getDictionary()).auth;
  const redirectURL = cookies().has("pending_reservation") ? "/reservations/checkout" : "/account/history";
  return (
    <div>
      <div className={styles.orDivider}>
        <span>{dict.or}</span>
      </div>
      <div className={styles.authProviders}>
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: redirectURL });
          }}
        >
          <button className={styles.googleButton}>
            <img src="https://authjs.dev/img/providers/google.svg" alt="Google logo" height="24" width="24" />
            <span>{dict.continueGoogle}</span>
          </button>
        </form>

        <form
          action={async () => {
            "use server";
            await signIn("facebook", { redirectTo: redirectURL });
          }}
        >
          <button className={styles.facebookBtn}>
            <i className={styles.facebookIcon}></i>
            {dict.continueFacebook}
          </button>
        </form>
      </div>
    </div>
  );
}

export default OAuthProviderButtons;

import { authAction } from "@/app/_lib/actions";
import CredentialsForm from "../CredentialsForm";
import OAuthProviderButtons from "../OAuthProviderButtons";
import styles from "./styles.module.css";
import { getDictionary } from "@/app/_lib/i18n";

async function SigninForm() {
  const dict = (await getDictionary()).auth;
  return (
    <div className={`${styles.formSection} container`}>
      <CredentialsForm authAction={authAction} dict={dict} />

      <OAuthProviderButtons />
    </div>
  );
}

export default SigninForm;

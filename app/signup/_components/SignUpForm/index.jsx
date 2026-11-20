import { authAction, signupAction } from "@/app/_lib/actions";
import CredentialsForm from "../CredentialsForm";
import styles from "./styles.module.css";
import OAuthProviderButtons from "@/app/signin/_components/OAuthProviderButtons";
import { getDictionary } from "@/app/_lib/i18n";

async function SignUpForm() {
  const dict = (await getDictionary()).auth;
  return (
    <div className={`${styles.formSection} container`}>
      <CredentialsForm registerAction={signupAction} authAction={authAction} dict={dict} />

      <OAuthProviderButtons />
    </div>
  );
}

export default SignUpForm;

import styles from "./styles.module.css";
import { useFormStatus } from "react-dom";

function SignInButton({ dict }) {
  const { pending } = useFormStatus();
  return (
    <button className={styles.formButton} disabled={pending}>
      {pending ? dict.checking : dict.signIn}
    </button>
  );
}

export default SignInButton;

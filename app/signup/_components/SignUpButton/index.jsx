import styles from "./styles.module.css";
import { useFormStatus } from "react-dom";

function SignUpButton({ dict }) {
  const { pending } = useFormStatus();
  return (
    <button className={styles.formButton} disabled={pending}>
      {pending ? dict.checking : dict.signUp}
    </button>
  );
}

export default SignUpButton;

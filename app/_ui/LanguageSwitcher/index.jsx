"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLanguageAction } from "../../_lib/i18n/actions";
import { LOCALE_LABELS, SUPPORTED_LOCALES } from "../../_lib/i18n/config";
import styles from "./styles.module.css";

function LanguageSwitcher({ locale, label, errorText }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setError("");
    startTransition(async () => {
      try {
        const res = await setLanguageAction(value);
        if (res.ok) {
          router.refresh();
        } else {
          setError(res.error);
        }
      } catch {
        setError(errorText);
      }
    });
  };

  return (
    <div className={styles.languageSwitcher}>
      <label htmlFor="language-select" className={styles.visuallyHidden}>
        {label}
      </label>
      <select
        id="language-select"
        className={styles.select}
        value={locale}
        onChange={handleChange}
        disabled={isPending}
      >
        {SUPPORTED_LOCALES.map((code) => (
          <option key={code} value={code}>
            {LOCALE_LABELS[code]}
          </option>
        ))}
      </select>
      {error ? (
        <span role="alert" className={styles.error}>
          {error}
        </span>
      ) : null}
    </div>
  );
}

export default LanguageSwitcher;

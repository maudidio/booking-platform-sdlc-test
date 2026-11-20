"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocaleAction } from "../../_lib/actions";
import { LOCALE_LABELS, SUPPORTED_LOCALES } from "../../_lib/i18n/locales";
import styles from "./styles.module.css";

function LanguageSelector({ locale, label }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleChange(e) {
    const value = e.target.value;
    setError("");
    startTransition(async () => {
      try {
        const result = await setLocaleAction(value);
        if (result.ok) router.refresh();
        else setError(result.error);
      } catch (err) {
        setError("Unable to change language.");
      }
    });
  }

  return (
    <div className={styles.languageSelector}>
      <select
        className={styles.select}
        aria-label={label}
        value={locale}
        disabled={pending}
        onChange={handleChange}
      >
        {SUPPORTED_LOCALES.map((code) => (
          <option key={code} value={code}>
            {LOCALE_LABELS[code]}
          </option>
        ))}
      </select>
      {error && (
        <span role="alert" className={styles.error}>
          {error}
        </span>
      )}
    </div>
  );
}

export default LanguageSelector;

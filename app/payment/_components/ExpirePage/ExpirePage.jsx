"use client";
import styles from "./index.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ExpirePage = ({ dict }) => {
  const router = useRouter();
  return (
    <>
      <div className={`container ${styles.expiredCard}`}>
        <div className={styles.expiredIcon}>{/* <Clock size={48} /> */}</div>
        <h2 className={styles.expiredTitle}>{dict.expiredTitle}</h2>
        <p className={styles.expiredMessage}>{dict.expiredMessage}</p>

        <div className={styles.infoBox}>
          {/* <AlertCircle className={styles.infoIcon} size={20} /> */}
          <p>{dict.expiredInfo}</p>
        </div>

        <div className={styles.actionButtons}>
          <Link href={"/rooms"} className={styles.primaryButton}>
            {/* <RefreshCcw size={20} /> */}
            {dict.startNewBooking}
          </Link>
          <button onClick={() => router.back()} className={styles.secondaryButton}>
            {/* <ArrowLeft size={20} /> */}
            {dict.goBack}
          </button>
        </div>
      </div>
    </>
  );
};

export default ExpirePage;

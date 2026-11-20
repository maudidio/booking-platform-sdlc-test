import Image from "next/image";
import styles from "./styles.module.css";
import Link from "next/link";
import { getDictionary } from "@/app/_lib/i18n";

const SUPABASE_ROOMS_URL = process.env.NEXT_PUBLIC_SUPABASE_IMGS_URL;

async function RoomItem({ id, imgPath, price, link, title }) {
  const dict = (await getDictionary()).rooms;
  return (
    <div className={styles.roomsGrid}>
      <div className={styles.roomItem}>
        <div className={styles.imgOverlay}>
          <Image fill src={`${SUPABASE_ROOMS_URL}/${imgPath}`} alt="" />
        </div>
        <div className={styles.roomDescription}>
          <div>
            <h2 className={styles.roomTitle}>{title}</h2>
            <Link href={`rooms/${id}`}>{dict.from} ${price} {dict.perNight}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomItem;

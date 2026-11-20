import styles from "./style.module.css";
import Heading from "@/app/_ui/Heading";
import ReservationCard from "./_components/ReservationCard";
import { getGuestReservations } from "@/app/_lib/supabase/reservations";
import { auth } from "@/auth";
import Link from "next/link";
import { getDictionary } from "@/app/_lib/i18n";

export const metadata = {
  title: "Booking History",
  description: "Reservations history at the Hotel Booking App ",
};

async function History() {
  const dict = (await getDictionary()).history;
  let session = {};
  let reservations = [];
  try {
    session = await auth();
    console.log({ HISTORY_SESSION: session });
    reservations = (await getGuestReservations(session.user?.id)) ?? [];
  } catch (err) {
    console.log(err);
  }

  return (
    <>
      <Heading textClassName={styles.heading}>{dict.heading}</Heading>
      <div>
        {reservations.length ? (
          reservations.reverse().map((item) => <ReservationCard key={item.id} reservation={item} />)
        ) : (
          <div>
            <p>{dict.noBooking}</p>
            <Link href={"/rooms"}>{dict.viewRooms}</Link>
          </div>
        )}
      </div>
    </>
  );
}

export default History;

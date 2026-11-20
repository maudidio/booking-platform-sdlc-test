import FilterSection from "./_components/FilterSection";

import styles from "./styles.module.css";
import Banner from "../_components/Banner";
import RoomsSection from "./_components/RoomsSection";
import { Suspense } from "react";
import Loader from "../_ui/Loader";
import { getDictionary } from "../_lib/i18n";

export const metadata = {
  title: "Rooms",
  description: "Discover and book a room at the Hotel Booking App ",
};

async function Rooms({ searchParams }) {
  const dict = (await getDictionary()).rooms;
  const filter = searchParams?.sort ?? "default";
  const range = searchParams?.range ?? "";
  return (
    <>
      <Banner title={dict.banner} />

      <div className={`container ${styles.roomsHolder}`}>
        <FilterSection filters={{ filter, range }} dict={dict} />

        <Suspense
          key={`${filter}-${range}`}
          fallback={
            <div className={styles.loader}>
              <Loader />
            </div>
          }
        >
          <RoomsSection filter={filter} range={range} />
        </Suspense>
      </div>
    </>
  );
}

export default Rooms;

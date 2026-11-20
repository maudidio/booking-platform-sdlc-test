"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./styles.module.css";
import "react-datepicker/dist/react-datepicker.css";

import Select from "react-select";
import DatePicker from "react-datepicker";
import { useState } from "react";
import { formatISO, formatRFC7231, isBefore, isValid } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from "react-hot-toast";

function FilterSection({ filters, dict }) {
  const options = [
    { value: "default", label: dict.sortDefault },
    { value: "high-price", label: dict.sortHighPrice },
    { value: "low-price", label: dict.sortLowPrice },
    { value: "max-guests", label: dict.sortMaxGuests },
    { value: "min-guests", label: dict.sortMinGuests },
  ];
  const range = { from: filters?.range.split("_")?.at(0), to: filters?.range.split("_")?.at(1) };
  const [startDate, setStartDate] = useState(
    filters?.range && isValid(new Date(range.from)) ? formatRFC7231(new Date(range.from)) : ""
  );
  const [endDate, setEndDate] = useState(
    filters?.range && isValid(new Date(range.to)) ? formatRFC7231(new Date(range.to)) : ""
  );

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSort(e) {
    console.log(e);
    const params = new URLSearchParams(searchParams);
    params.set("sort", e.value);
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function handleStartSelection(date) {
    setStartDate(date);
    console.log(date);
  }

  function handleEndSelection(date) {
    setEndDate(date);
    console.log(date);
  }

  function handleSearch() {
    if (!startDate || !endDate) return;
    const arrival = formatISO(new Date(startDate), { representation: "date" });
    const departure = formatISO(new Date(endDate), { representation: "date" });

    if (!isBefore(arrival, departure)) {
      toast.error(dict.invalidDateRange);
      return;
    }

    const params = new URLSearchParams(searchParams);
    const formatedRange = `${arrival}_${departure}`;
    params.set("range", formatedRange);
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <form className={`${styles.filterSection} roomsForm`}>
      <div className={styles.formControl}>
        <label htmlFor="">{dict.sortRooms}</label>
        <Select
          onChange={(e) => {
            handleSort(e);
          }}
          options={options}
          isSearchable={false}
          className={styles.select}
          defaultValue={options.find((item) => item.value === filters?.filter) ?? options.at(0)}
        />
      </div>

      <div className={styles.formControl}>
        <label>{dict.filterByDate}</label>
        <div className={styles.datesContainer}>
          <DatePicker
            selected={startDate}
            onChange={(date) => handleStartSelection(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className={styles.input}
            dateFormat={"dd/MM/yyyy"}
            excludeDateIntervals={[{ start: new Date("01/01/1970"), end: new Date() }]}
            placeholderText={dict.arrivalDate}
            // onSelect={(date) => handleStartSelection(date)}
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => handleEndSelection(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className={styles.input}
            dateFormat={"dd/MM/yyyy"}
            excludeDateIntervals={[{ start: new Date("01/01/1970"), end: new Date() }]}
            placeholderText={dict.departureDate}
            // onSelect={(date) => handleEndSelection(date)}
          />

          <button className={styles.searchButton} type="button" onClick={handleSearch}>
            <span>
              <FontAwesomeIcon icon={faSearch} />
            </span>
            <span>{dict.search}</span>
          </button>
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </form>
  );
}

export default FilterSection;

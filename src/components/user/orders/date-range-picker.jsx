import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import DateRangeHeader from "./date-range-header";
import CalendarPicker from "./calendar-picker";
import { useNavigate } from "react-router-dom";
import { getServerTime } from "../../../lib/apis";

export default function DateRangePicker() {
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const [serverNow, setServerNow] = useState(null);
  const navigate = useNavigate();

  // Initialize server time on mount
  useEffect(() => {
    (async () => {
      const now = await getServerTime();
      setServerNow(now);
    })();
  }, []);

  const { watch, setValue } = useForm({
    defaultValues: {
      fromDate: null,
      toDate: null,
    },
    mode: "onChange",
  });

  const fromDate = watch("fromDate");
  const toDate = watch("toDate");

  const handleFromDateChange = (date) => {
    setValue("fromDate", date);
    setShowFromCalendar(false);
  };

  const handleToDateChange = (date) => {
    setValue("toDate", date);
    setShowToCalendar(false);
  };

  const formatDateToDDMMYYYY = (dateInput) => {
    const date = new Date(dateInput);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    if (fromDate && toDate && fromDate <= toDate) {
      const dates = `${formatDateToDDMMYYYY(fromDate)}_${formatDateToDDMMYYYY(
        toDate
      )}`;

      // encode the dates segment to be safe in the URL
      navigate(`/user/orders/orderlist/${encodeURIComponent(dates)}`, {
        replace: true,
      });
    }
  }, [fromDate, toDate]);

  return (
    <div className="w-full sm:px-0 md:px-4 py-2 sm:py-3 md:py-4 max-w-full md:max-w-5xl mx-auto">
      <DateRangeHeader
        fromDate={fromDate}
        toDate={toDate}
        onFromClick={() => setShowFromCalendar(!showFromCalendar)}
        onToClick={() => setShowToCalendar(!showToCalendar)}
      />

      {/* Calendars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 md:gap-6 mb-6 w-full">
        {serverNow && (
          <>
            <CalendarPicker
              className={"md:justify-self-start"}
              date={fromDate}
              onChange={handleFromDateChange}
              maxDate={toDate || serverNow}
              isOpen={showFromCalendar}
            />

            <CalendarPicker
              className={"md:justify-self-end md:col-start-2"}
              date={toDate}
              onChange={handleToDateChange}
              minDate={fromDate || serverNow}
              isOpen={showToCalendar}
            />
          </>
        )}
      </div>
    </div>
  );
}

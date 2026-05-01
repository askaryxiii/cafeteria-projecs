import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import DateRangeHeader from "./date-range-header";
import CalendarPicker from "./calendar-picker";
import { useNavigate } from "react-router-dom";
import time from "@/utils/timeClient";

export default function DateRangePicker() {
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const [serverNow, setServerNow] = useState(null);
  const navigate = useNavigate();

  // Initialize server time on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        await time.initTimeSync();
      } catch (error) {
        console.warn("[DateRangePicker] time sync failed", error);
      }
      setServerNow(time.now().toJSDate());
    };
    initialize();
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
    const date = time.parseISO(dateInput);
    return date.toFormat("dd-MM-yyyy");
  };

  useEffect(() => {
    if (fromDate && toDate && fromDate <= toDate) {
      const dates = `${formatDateToDDMMYYYY(fromDate)}_${formatDateToDDMMYYYY(
        toDate,
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

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import DateRangeHeader from "./date-range-header";
import CalendarPicker from "./calendar-picker";
import { useNavigate } from "react-router-dom";

export default function DateRangePicker() {
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const navigate = useNavigate();

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
    <div className="w-full max-w-5xl mx-auto">
      <DateRangeHeader
        fromDate={fromDate}
        toDate={toDate}
        onFromClick={() => setShowFromCalendar(!showFromCalendar)}
        onToClick={() => setShowToCalendar(!showToCalendar)}
      />

      {/* Calendars Grid */}
      <div className="grid grid-cols-2 mb-8 w-full">
        <CalendarPicker
          className={"justify-self-start"}
          date={fromDate}
          onChange={handleFromDateChange}
          maxDate={toDate || new Date()}
          isOpen={showFromCalendar}
        />

        <CalendarPicker
          className={"justify-self-end"}
          date={toDate}
          onChange={handleToDateChange}
          minDate={fromDate || new Date()}
          isOpen={showToCalendar}
        />
      </div>
    </div>
  );
}

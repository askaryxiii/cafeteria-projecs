import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarPicker({
  date,
  onChange,
  minDate,
  maxDate,
  isOpen,
  className,
}) {
  if (!isOpen) {
    return date ? <div className=" "></div> : null;
  }

  return (
    <div className={`calendar-container ${className || ""}`}>
      <Calendar
        className={`custom-calendar `}
        onChange={onChange}
        value={date}
        minDate={minDate}
        maxDate={maxDate}
      />
    </div>
  );
}

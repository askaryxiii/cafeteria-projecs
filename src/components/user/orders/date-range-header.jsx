import DateButton from "./date-button";

const CalendarIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

export default function DateRangeHeader({
  fromDate,
  toDate,
  onFromClick,
  onToClick,
}) {
  return (
    <div className="bg-blue-900 text-white rounded-lg p-4 mb-8 flex items-center justify-between">
      <DateButton
        date={fromDate}
        label="Date selected"
        onClick={onFromClick}
        icon={<CalendarIcon />}
      />

      <h1 className="text-2xl font-bold text-center flex-1 mx-4">MY ORDERS</h1>

      <DateButton
        date={toDate}
        label="Date selected"
        onClick={onToClick}
        icon={<CalendarIcon />}
      />
    </div>
  );
}

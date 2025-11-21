import DateButton from "./date-button";

const CalendarIcon = () => (
  <svg
    className="w-4 sm:w-5 h-4 sm:h-5 shrink-0"
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
    <div className="bg-[#032552] text-white rounded-lg p-2 sm:p-3 md:p-4 mb-4 sm:mb-6 md:mb-8 flex items-center justify-between gap-2 sm:gap-4">
      <DateButton
        date={fromDate}
        label="From"
        onClick={onFromClick}
        icon={<CalendarIcon />}
      />

      <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-center flex-1">
        MY ORDERS
      </h1>

      <DateButton
        date={toDate}
        label="To"
        onClick={onToClick}
        icon={<CalendarIcon />}
      />
    </div>
  );
}

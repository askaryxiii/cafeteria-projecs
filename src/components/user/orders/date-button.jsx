import { format } from "date-fns";

export default function DateButton({ date, label, onClick, icon: Icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 sm:gap-2 hover:bg-[#042b5f] px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded transition text-white text-xs sm:text-sm md:text-base min-h-9 sm:min-h-10 md:min-h-11">
      {Icon && <span className="w-4 sm:w-5 h-4 sm:h-5 shrink-0">{Icon}</span>}
      {date ? format(date, "MMM d, yyyy") : label}
    </button>
  );
}

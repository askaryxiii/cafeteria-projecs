import { format } from "date-fns";

export default function DateButton({ date, label, onClick, icon: Icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 hover:bg-blue-800 px-3 py-2 rounded transition text-white">
      {Icon}
      {date ? format(date, "MMM d, yyyy") : label}
    </button>
  );
}

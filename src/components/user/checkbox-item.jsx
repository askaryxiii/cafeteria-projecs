export default function CheckboxItem({
  item,
  isChecked,
  onChange,
  disabled = false,
}) {
  return (
    <label
      className={`flex items-center gap-2 sm:gap-3 md:gap-4 cursor-pointer hover:bg-gray-100 p-1.5 sm:p-2 md:p-3 rounded transition min-h-11 sm:min-h-11 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className={`w-4 md:w-5 h-4 md:h-5 cursor-pointer accent-navy-light shrink-0 ${disabled ? "cursor-not-allowed" : ""}`}
      />
      <span className="text-navy-dark flex-1 text-sm sm:text-base md:text-lg lg:text-xl font-semibold">
        {item?.item_name} {item.weight_grams && `- ${item.weight_grams} جرام`}
      </span>
      <span className="text-navy-dark text-xs sm:text-sm md:text-base font-semibold whitespace-nowrap">
        {item.price == 0 ? <span className="line-through">0.00 LE</span> : <span>{item.price} LE</span>}
      </span>
    </label>
  );
}

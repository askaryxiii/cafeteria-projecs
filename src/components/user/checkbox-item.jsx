export default function CheckboxItem({ item, isChecked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded transition">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 cursor-pointer accent-blue-950"
      />
      <span className="text-[#02356A] flex-1 text-lg font-semibold">
        {item.item_name} {item.weight_grams && `- ${item.weight_grams} جرام`}
      </span>
      <span className="text-[#02356A] text-sm font-semibold">
        {item.price} LE
      </span>
    </label>
  );
}

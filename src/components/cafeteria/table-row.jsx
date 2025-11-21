import { CheckboxInput } from "./checkbox-input";
import { FaRegCircleUser } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";

export function TableRow({
  item,
  onCheckChange,
  mealType,
  showDelete = false,
  onDelete = null,
}) {
  const items = item?.items || [];

  const getNames = (category) => {
    const group = items.find((i) => i.category?.toLowerCase() === category);
    return (group?.items || []).map((p) => p.item_name).join(" - ");
  };
  return (
    <tr
      className={`relative border-b text-xs sm:text-sm md:text-base ${
        item.checked
          ? "bg-[#DDDBDB] after:content-[''] after:absolute after:left-2 sm:after:left-3 md:after:left-4 after:right-2 sm:after:right-3 md:after:right-4 after:top-1/2 after:h-[1.5px] after:bg-[#948b8b] after:opacity-40"
          : "hover:bg-[#DDDBDB]"
      }`}>
      <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 w-10 sm:w-11 md:w-12">
        <CheckboxInput
          checked={item.checked}
          onChange={() => onCheckChange(item.id)}
        />
      </td>
      <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <FaRegCircleUser className="w-4 sm:w-5 md:w-5 h-4 sm:h-5 md:h-5 shrink-0" />
          <span
            className={`truncate ${
              item.checked ? "text-gray-400 line-through" : "text-gray-900"
            }`}>
            {item.arabic_name}
          </span>
        </div>
      </td>
      {mealType === "lunch" ? (
        <>
          <td
            className={`${
              item.checked ? "text-gray-400" : "text-gray-700"
            } text-center text-base sm:text-lg md:text-xl px-1 sm:px-2 md:px-4 py-2 sm:py-3 md:py-4`}>
            {getNames("protein")}
          </td>
          <td
            className={`${
              item.checked ? "text-gray-400" : "text-gray-700"
            } text-center text-base sm:text-lg md:text-xl px-1 sm:px-2 md:px-4 py-2 sm:py-3 md:py-4`}>
            {getNames("carbs")}
          </td>
          <td
            className={`${
              item.checked ? "text-gray-400" : "text-gray-700"
            } text-center text-base sm:text-lg md:text-xl px-1 sm:px-2 md:px-4 py-2 sm:py-3 md:py-4`}>
            {getNames("side")}
          </td>
          <td
            className={`${
              item.checked ? "text-gray-400" : "text-gray-700"
            } text-center text-base sm:text-lg md:text-xl px-1 sm:px-2 md:px-4 py-2 sm:py-3 md:py-4`}>
            {getNames("salad")}
          </td>
        </>
      ) : (
        <td
          className={`${
            item.checked ? "text-gray-400" : "text-gray-700"
          } text-center text-base sm:text-lg md:text-xl px-1 sm:px-2 md:px-4 py-2 sm:py-3 md:py-4`}>
          {items.map((p) => p.item_name).join(" - ")}
        </td>
      )}
      {showDelete && (
        <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 text-center">
          <button
            onClick={() => onDelete && onDelete(item.id)}
            className="p-1.5 sm:p-2 md:p-2 text-[#072A57] hover:scale-110 rounded-lg transition min-h-9 sm:min-h-10 flex items-center justify-center"
            title="Delete order">
            <MdDelete className="w-4 sm:w-5 md:w-5 h-4 sm:h-5 md:h-5" />
          </button>
        </td>
      )}
    </tr>
  );
}

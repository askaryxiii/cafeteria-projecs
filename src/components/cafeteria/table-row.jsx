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
      className={`relative border-b ${
        item.checked
          ? "bg-[#DDDBDB] after:content-[''] after:absolute after:left-4 after:right-4 after:top-1/2 after:h-[1.5px] after:bg-[#948b8b] after:opacity-40"
          : "hover:bg-[#DDDBDB]"
      }`}>
      <td className="px-4 py-4 w-12">
        <CheckboxInput
          checked={item.checked}
          onChange={() => onCheckChange(item.id)}
        />
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <FaRegCircleUser className="w-5 h-5" />
          <span
            className={`${
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
            } text-center text-xl`}>
            {getNames("protein")}
          </td>
          <td
            className={`${
              item.checked ? "text-gray-400" : "text-gray-700"
            } text-center text-xl`}>
            {getNames("carbs")}
          </td>
          <td
            className={`${
              item.checked ? "text-gray-400" : "text-gray-700"
            } text-center text-xl`}>
            {getNames("side")}
          </td>
          <td
            className={`${
              item.checked ? "text-gray-400" : "text-gray-700"
            } text-center text-xl`}>
            {getNames("salad")}
          </td>
        </>
      ) : (
        <td
          className={`${
            item.checked ? "text-gray-400" : "text-gray-700"
          } text-center text-xl`}>
          {items.map((p) => p.item_name).join(" - ")}
        </td>
      )}
      {showDelete && (
        <td className="px-4 py-4 text-center">
          <button
            onClick={() => onDelete && onDelete(item.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Delete order">
            <MdDelete className="w-5 h-5" />
          </button>
        </td>
      )}
    </tr>
  );
}

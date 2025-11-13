import { CheckboxInput } from "./checkbox-input";
import { FaRegCircleUser } from "react-icons/fa6";

export function TableRow({ item, onCheckChange, mealType }) {
  const items = item.items;

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
          {/* <span className="text-lg">😊</span> */}
          <FaRegCircleUser className="w-5 h-5" />
          <span
            className={`${item.checked ? "text-gray-400" : "text-gray-900"}`}>
            {item.name}
          </span>
        </div>
      </td>
      {mealType === "lunch" ? (
        <>
          <td
            className={`${
              item.checked ? "text-gray-400" : "text-gray-700"
            } text-center text-xl`}>
            {items
              .filter((i) => i.category.toLowerCase() === "protein")[0]
              .items.map((p) => p.item_name)
              .join(" - ")}
          </td>
          <td
            className={`${
              item.checked ? "text-gray-400" : "text-gray-700"
            } text-center text-xl`}>
            {items
              .filter((i) => i.category.toLowerCase() === "carbs")[0]
              .items.map((p) => p.item_name)
              .join(" - ")}
          </td>
          <td
            className={`${
              item.checked ? "text-gray-400" : "text-gray-700"
            } text-center text-xl`}>
            {items
              .filter((i) => i.category.toLowerCase() === "side")[0]
              .items.map((p) => p.item_name)
              .join(" - ")}
          </td>
          <td
            className={`${
              item.checked ? "text-gray-400" : "text-gray-700"
            } text-center text-xl`}>
            {items
              .filter((i) => i.category.toLowerCase() === "salad")[0]
              .items.map((p) => p.item_name)
              .join(" - ")}
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
    </tr>
  );
}

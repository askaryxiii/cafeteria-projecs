import { MdDelete } from "react-icons/md";
import { RiPencilFill } from "react-icons/ri";
import { PiArrowsDownUpLight } from "react-icons/pi";

export default function ItemsTableContent({
  items,
  onEdit,
  onDeleteConfirm,
  sortConfig,
  onSort,
}) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#d6d4d4] border-b border-[#ACA4A4]">
            <th className="px-6 py-4 text-left text-sm font-bold text-[#072A57] cursor-pointer hover:bg-[#c5c3c3] transition">
              <button
                className="flex items-center gap-2 w-full cursor-pointer"
                onClick={() => onSort("item_name")}>
                ITEM NAME
                <PiArrowsDownUpLight
                  className={`w-4 h-4 text-gray-600 transition ${
                    sortConfig?.key === "item_name" &&
                    sortConfig?.direction === "desc"
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>
            </th>
            <th className="px-6 py-4 text-left text-sm font-bold text-[#072A57] cursor-pointer hover:bg-[#c5c3c3] transition">
              <button
                className="flex items-center gap-2 w-full cursor-pointer"
                onClick={() => onSort("category")}>
                CATEGORY
                <PiArrowsDownUpLight
                  className={`w-4 h-4 text-gray-600 transition ${
                    sortConfig?.key === "category" &&
                    sortConfig?.direction === "desc"
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>
            </th>
            <th className="px-6 py-4 text-left text-sm font-bold text-[#072A57] cursor-pointer hover:bg-[#c5c3c3] transition">
              <button
                className="flex items-center gap-2 w-full cursor-pointer"
                onClick={() => onSort("price")}>
                PRICE
                <PiArrowsDownUpLight
                  className={`w-4 h-4 text-gray-600 transition ${
                    sortConfig?.key === "price" &&
                    sortConfig?.direction === "desc"
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>
            </th>
            <th className="px-6 py-4 text-left text-sm font-bold text-[#072A57] cursor-pointer hover:bg-[#c5c3c3] transition">
              <button
                className="flex items-center gap-2 w-full cursor-pointer"
                onClick={() => onSort("weight_grams")}>
                WEIGHT
                <PiArrowsDownUpLight
                  className={`w-4 h-4 text-gray-600 transition ${
                    sortConfig?.key === "weight_grams" &&
                    sortConfig?.direction === "desc"
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>
            </th>
            <th className="px-6 py-4 text-left text-sm font-bold text-[#072A57] cursor-pointer hover:bg-[#c5c3c3] transition">
              <button
                className="flex items-center gap-2 w-full cursor-pointer"
                onClick={() => onSort("meal_type")}>
                TYPE
                <PiArrowsDownUpLight
                  className={`w-4 h-4 text-gray-600 transition ${
                    sortConfig?.key === "meal_type" &&
                    sortConfig?.direction === "desc"
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>
            </th>
            <th className="px-6 py-4 text-left text-sm font-bold text-[#072A57] cursor-pointer hover:bg-[#c5c3c3] transition">
              <button
                className="flex items-center gap-2 w-full cursor-pointer"
                onClick={() => onSort("code")}>
                CODE
                <PiArrowsDownUpLight
                  className={`w-4 h-4 text-gray-600 transition ${
                    sortConfig?.key === "code" &&
                    sortConfig?.direction === "desc"
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>
            </th>
            <th className="px-6 py-4 text-left text-sm font-bold text-[#072A57] cursor-pointer hover:bg-[#c5c3c3] transition">
              <button
                className="flex items-center gap-2 w-full cursor-pointer"
                onClick={() => onSort("protein_type")}>
                PROTEIN
                <PiArrowsDownUpLight
                  className={`w-4 h-4 text-gray-600 transition ${
                    sortConfig?.key === "protein_type" &&
                    sortConfig?.direction === "desc"
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>
            </th>
            <th className="px-6 py-4 text-center text-sm font-bold text-[#072A57]">
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr className="border-b border-t border-[#ACA4A4]">
              <td colSpan="8" className="px-6 py-8 text-center text-[#072A57] ">
                No items found
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-t border-[#ACA4A4] hover:bg-[#d4d4d4] transition-colors">
                <td className="px-6 py-4 text-base font-normal text-[#072A57]">
                  {item.item_name}
                </td>
                <td className="px-6 py-4 text-base font-normal text-[#072A57]">
                  {item.category}
                </td>
                <td className="px-6 py-4 text-base font-normal text-[#072A57]">
                  {item.price}
                </td>
                <td className="px-6 py-4 text-base font-normal text-[#072A57]">
                  {item.weight_grams}
                </td>
                <td className="px-6 py-4 text-base font-normal text-[#072A57]">
                  {item.meal_type}
                </td>
                <td className="px-6 py-4 text-base font-normal text-[#072A57]">
                  {item.code}
                </td>
                <td className="px-6 py-4 text-base font-normal text-[#072A57]">
                  {item.protein_type}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 hover:scale-110"
                      title="Edit item">
                      <RiPencilFill className="w-5 h-5 text-[#072A57]" />
                    </button>
                    <button
                      onClick={() => onDeleteConfirm(item.id)}
                      className="p-2 hover:scale-110"
                      title="Delete item">
                      <MdDelete className="w-5 h-5 text-[#072A57]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

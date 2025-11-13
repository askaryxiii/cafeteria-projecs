import { MdKeyboardArrowDown } from "react-icons/md";
import { MdKeyboardArrowUp } from "react-icons/md";

export function TableHeader({
  onColumnSort,
  sortColumn,
  sortDirection,
  mealType,
}) {
  const renderSortIcon = (column) => {
    if (sortColumn === column) {
      return sortDirection === "asc" ? (
        <MdKeyboardArrowUp className="inline-block w-4.5 h-4.5" />
      ) : (
        <MdKeyboardArrowDown className="inline-block w-4.5 h-4.5" />
      );
    }
    return <MdKeyboardArrowDown className="inline-block w-4.5 h-4.5" />;
  };

  return (
    <thead className="bg-[#DDDBDB]">
      <tr>
        <th className="px-4 py-3 text-center">
          <div className="w-5"></div>
        </th>
        <th
          onClick={() => onColumnSort("name")}
          className="px-4 py-3 text-center text-sm font-medium text-gray-900 cursor-pointer transition">
          Full Name {renderSortIcon("name")}
        </th>
        {mealType === "lunch" ? (
          <>
            <th
              onClick={() => onColumnSort("protein")}
              className="px-4 py-3 text-center text-sm font-medium text-gray-900 cursor-pointer transition">
              Protein {renderSortIcon("protein")}
            </th>
            <th
              onClick={() => onColumnSort("carbs")}
              className="px-4 py-3 text-center text-sm font-medium text-gray-900 cursor-pointer transition">
              Carbs {renderSortIcon("carbs")}
            </th>
            <th
              onClick={() => onColumnSort("side")}
              className="px-4 py-3 text-center text-sm font-medium text-gray-900 cursor-pointer transition">
              Side {renderSortIcon("side")}
            </th>
            <th
              onClick={() => onColumnSort("salad")}
              className="px-4 py-3 text-center text-sm font-medium text-gray-900 cursor-pointer transition">
              Salad {renderSortIcon("salad")}
            </th>
          </>
        ) : (
          <th
            onClick={() => onColumnSort("breakfast")}
            className="px-4 py-3 text-center text-sm font-medium text-gray-900 cursor-pointer transition">
            Breakfast {renderSortIcon("breakfast")}
          </th>
        )}
      </tr>
    </thead>
  );
}

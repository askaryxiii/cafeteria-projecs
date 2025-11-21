import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

export function TableHeader({
  onColumnSort,
  sortColumn,
  sortDirection,
  mealType,
  showDelete = false,
}) {
  const renderSortIcon = (column) => {
    if (sortColumn === column) {
      return sortDirection === "asc" ? (
        <MdKeyboardArrowUp className="inline-block w-4 h-4" />
      ) : (
        <MdKeyboardArrowDown className="inline-block w-4 h-4" />
      );
    }
    return <MdKeyboardArrowDown className="inline-block w-4 h-4" />;
  };

  // Calculate the number of columns to span on mobile
  const mobileColSpan = showDelete
    ? mealType === "lunch"
      ? 7
      : 4
    : mealType === "lunch"
    ? 6
    : 3;

  return (
    <thead className="bg-[#DDDBDB]">
      <tr>
        {/* MOBILE: single full-width header */}
        <th
          className="px-4 py-3 text-center sm:hidden w-full"
          colSpan={mobileColSpan}>
          {mealType === "lunch" ? "Lunch Order" : "Breakfast Order"}
        </th>

        {/* DESKTOP: full table headers */}
        <th className="px-4 py-3 text-center hidden sm:table-cell">
          <div className="w-5"></div>
        </th>

        <th
          onClick={() => onColumnSort("name")}
          className="px-4 py-3 text-center text-sm font-medium text-gray-900 cursor-pointer transition hidden sm:table-cell">
          Full Name {renderSortIcon("name")}
        </th>

        {mealType === "lunch" ? (
          <>
            <th
              onClick={() => onColumnSort("protein")}
              className="px-4 py-3 text-center text-sm font-medium text-gray-900 cursor-pointer transition hidden sm:table-cell">
              Protein {renderSortIcon("protein")}
            </th>
            <th
              onClick={() => onColumnSort("carbs")}
              className="px-4 py-3 text-center text-sm font-medium text-gray-900 cursor-pointer transition hidden sm:table-cell">
              Carbs {renderSortIcon("carbs")}
            </th>
            <th
              onClick={() => onColumnSort("side")}
              className="px-4 py-3 text-center text-sm font-medium text-gray-900 cursor-pointer transition hidden sm:table-cell">
              Side {renderSortIcon("side")}
            </th>
            <th
              onClick={() => onColumnSort("salad")}
              className="px-4 py-3 text-center text-sm font-medium text-gray-900 cursor-pointer transition hidden sm:table-cell">
              Salad {renderSortIcon("salad")}
            </th>
          </>
        ) : (
          <th
            onClick={() => onColumnSort("breakfast")}
            className="px-4 py-3 text-center text-sm font-medium text-gray-900 cursor-pointer transition hidden sm:table-cell">
            Breakfast {renderSortIcon("breakfast")}
          </th>
        )}

        {showDelete && (
          <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 hidden sm:table-cell">
            Actions
          </th>
        )}
      </tr>
    </thead>
  );
}

import { useEffect, useState } from "react";
import { getAllOrdersForToday, getAllOrdersForTomorrow } from "../../lib/apis";
import { TableHeader } from "./table-header";
import { TableRow } from "./table-row";

const getCategoryItem = (order, categoryName) => {
  const category = order.items.find(
    (cat) => cat.category.toLowerCase() === categoryName.toLowerCase()
  );
  return category?.items[0]?.item_name || "-";
};

export function MealTable({
  fetchTomorrow = false,
  showDelete = false,
  onDelete = null,
  refreshTrigger = 0,
}) {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [items, setItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState(() => {
    try {
      const raw = localStorage.getItem("mealTable.checked") || "[]";
      const arr = JSON.parse(raw);
      return new Set(Array.isArray(arr) ? arr : []);
    } catch (e) {
      return new Set();
    }
  });
  const [mealType, setMealType] = useState(null);

  // Fetch orders and set meal type based on current time
  const fetchOrders = async () => {
    const now = new Date();
    const hour = now.getHours();

    const ORDER_WINDOW_BREAKFAST_START = parseInt(
      import.meta.env.VITE_ORDER_WINDOW_BREAKFAST_START
    );
    const ORDER_WINDOW_BREAKFAST_END = parseInt(
      import.meta.env.VITE_ORDER_WINDOW_BREAKFAST_END
    );
    const ORDER_WINDOW_LUNCH_START = parseInt(
      import.meta.env.VITE_ORDER_WINDOW_LUNCH_START
    );
    const ORDER_WINDOW_LUNCH_END = 23;

    // Fetch orders based on fetchTomorrow prop
    const fetchedOrders = fetchTomorrow
      ? await getAllOrdersForTomorrow()
      : await getAllOrdersForToday();

    if (!fetchedOrders?.error) {
      let ordersToShow = [];
      let typeToShow = null;

      if (
        hour >= ORDER_WINDOW_BREAKFAST_START &&
        hour < ORDER_WINDOW_BREAKFAST_END
      ) {
        ordersToShow = fetchedOrders.breakfastOrders || [];
        typeToShow = "breakfast";
      } else if (
        hour >= ORDER_WINDOW_LUNCH_START &&
        hour < ORDER_WINDOW_LUNCH_END
      ) {
        ordersToShow = fetchedOrders.lunchOrders || [];
        typeToShow = "lunch";
      }

      setItems(ordersToShow);
      setMealType(typeToShow);
    }
  };

  // Fetch orders on mount and set up refresh interval
  useEffect(() => {
    fetchOrders();

    // Fetch every 1 minute (60000 ms)
    const interval = setInterval(() => {
      fetchOrders();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchTomorrow, refreshTrigger]);

  // Add checked property to items based on checkedItems Set
  const itemsWithChecked = items.map((item, idx) => ({
    ...item,
    checked: checkedItems.has(item.id),
    originalIndex: idx,
  }));

  // Checked items appear at the bottom
  const sortedItems = [...itemsWithChecked].sort((a, b) => {
    // Unchecked items first
    if (a.checked !== b.checked) return a.checked ? 1 : -1;

    // If a sort column is selected, sort by that column, with originalIndex tie-breaker
    if (sortColumn) {
      const aValue = a[sortColumn] || "";
      const bValue = b[sortColumn] || "";
      if (aValue === bValue) return a.originalIndex - b.originalIndex;
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue, "ar")
        : bValue.localeCompare(aValue, "ar");
    }

    // Otherwise keep original order
    return a.originalIndex - b.originalIndex;
  });

  const handleCheckChange = (id) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      try {
        localStorage.setItem("mealTable.checked", JSON.stringify([...newSet]));
      } catch (e) {
        /* ignore storage errors */
      }
      return newSet;
    });
  };

  const handleColumnSort = (column) => {
    if (sortColumn === column) {
      // Toggle direction if same column clicked again
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new column and reset to ascending
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <div className="bg-[#FDF6F633] border-none rounded-lg shadow p-2 sm:p-3 md:p-4">
      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm md:text-base">
          <TableHeader
            onColumnSort={handleColumnSort}
            mealType={mealType}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            showDelete={showDelete}
          />
          <tbody className="divide-y divide-gray-200">
            {sortedItems.map((item) => (
              <TableRow
                key={item.id}
                item={item}
                mealType={mealType}
                onCheckChange={handleCheckChange}
                showDelete={showDelete}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <table className="w-full">
          <TableHeader
            onColumnSort={handleColumnSort}
            mealType={mealType}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            showDelete={showDelete}
          />
        </table>
        <div className="divide-y divide-gray-200">
          {sortedItems.map((item) => (
            <MobileTableRow
              key={item.id}
              item={item}
              onCheckChange={handleCheckChange}
              showDelete={showDelete}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileTableRow({ item, onCheckChange, showDelete, onDelete }) {
  return (
    <div
      className={`p-3 sm:p-4 space-y-2 sm:space-y-3 ${
        item.checked ? "bg-gray-100 opacity-50" : ""
      }`}>
      <div className="flex items-center gap-2 sm:gap-3">
        <input
          type="checkbox"
          checked={item.checked}
          onChange={() => onCheckChange(item.id)}
          className="w-4 sm:w-5 h-4 sm:h-5 accent-blue-600 cursor-pointer disabled:cursor-not-allowed shrink-0"
        />
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <span
            className={`font-medium text-sm sm:text-base truncate ${
              item.checked ? "line-through text-gray-400" : "text-gray-900"
            }`}>
            {item.name}
          </span>
        </div>
        {showDelete && (
          <button
            onClick={() => onDelete && onDelete(item.id)}
            className="text-red-500 hover:text-red-700 text-xs sm:text-sm md:text-base shrink-0 min-h-9 sm:min-h-10 flex items-center justify-center px-2 sm:px-3">
            🗑️
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
        <div>
          <span className="text-gray-600">Protein:</span>
          <p className="font-medium text-gray-900">
            {getCategoryItem(item, "protein")}
          </p>
        </div>
        <div>
          <span className="text-gray-600">Carbs:</span>
          <p className="font-medium text-gray-900">
            {getCategoryItem(item, "carbs")}
          </p>
        </div>
        <div>
          <span className="text-gray-600">Side:</span>
          <p className="font-medium text-gray-900">
            {getCategoryItem(item, "side")}
          </p>
        </div>
        <div>
          <span className="text-gray-600">Salad:</span>
          <p className="font-medium text-gray-900">
            {getCategoryItem(item, "salad")}
          </p>
        </div>
      </div>
    </div>
  );
}

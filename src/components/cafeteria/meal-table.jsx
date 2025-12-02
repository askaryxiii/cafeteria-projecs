import { useEffect, useState } from "react";
import {
  getAllOrdersForToday,
  getAllOrdersForTomorrow,
  getOrderWindows,
  parseTimeToHours,
  parseTimeToMinutes,
  isTimeInWindow,
} from "../../lib/apis";
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
  mealTypeFilter = null,
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
  const [activeWindows, setActiveWindows] = useState([]);
  const [orderWindows, setOrderWindows] = useState(null);
  const [loading, setLoading] = useState(true);

  // Determine which meal type windows are currently active
  const determineActiveWindows = (hour, minute, windows) => {
    const active = [];

    if (
      isTimeInWindow(
        hour,
        minute,
        windows.breakfast_start,
        windows.breakfast_end
      )
    ) {
      active.push("breakfast");
    }

    if (isTimeInWindow(hour, minute, windows.lunch_start, windows.lunch_end)) {
      active.push("lunch");
    }

    // Drinks are always shown if they overlap with any active window
    if (
      isTimeInWindow(hour, minute, windows.drinks_start, windows.drinks_end)
    ) {
      active.push("drinks");
    }

    return active;
  };

  // Fetch orders and set active windows
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();

      // Get order windows from API
      const windows = await getOrderWindows();
      setOrderWindows(windows);

      console.log(orderWindows);

      if (!windows) {
        console.warn("Could not fetch order windows, using defaults");
        // Fallback to defaults if API fails
        const defaultWindows = {
          breakfast_start: "11:00",
          breakfast_end: "15:00",
          lunch_start: "15:00",
          lunch_end: "23:59",
          drinks_start: "11:00",
          drinks_end: "23:00",
        };
        setOrderWindows(defaultWindows);

        // Determine active windows with defaults
        const active = determineActiveWindows(hour, minute, defaultWindows);
        setActiveWindows(active);
        return;
      }

      // Determine active windows based on current time
      const active = determineActiveWindows(hour, minute, windows);
      setActiveWindows(active);

      // Fetch orders for today or tomorrow
      let orderData;
      if (fetchTomorrow) {
        orderData = await getAllOrdersForTomorrow();
      } else {
        orderData = await getAllOrdersForToday();
      }
      // console.log(orderData);

      if (orderData.error) {
        console.error("Error fetching orders:", orderData.error);
        setItems([]);
        return;
      }

      // Combine orders from active windows
      let combinedOrders = [];

      if (active.includes("breakfast") && orderData.breakfastOrders) {
        combinedOrders = [...combinedOrders, ...orderData.breakfastOrders];
      }

      if (active.includes("lunch") && orderData.lunchOrders) {
        combinedOrders = [...combinedOrders, ...orderData.lunchOrders];
      }

      if (active.includes("drinks") && orderData.drinkOrders) {
        combinedOrders = [...combinedOrders, ...orderData.drinkOrders];
      }

      setItems(combinedOrders);
    } catch (error) {
      console.error("Error in fetchOrders:", error);
      setItems([]);
    } finally {
      setLoading(false);
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
  }, [fetchTomorrow, refreshTrigger, mealTypeFilter]);

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

  if (loading) {
    return (
      <div className="bg-[#FDF6F633] border-none rounded-lg shadow p-4">
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FDF6F633] border-none rounded-lg shadow p-2 sm:p-3 md:p-4">
      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm md:text-base">
          <TableHeader
            onColumnSort={handleColumnSort}
            mealType={activeWindows.join("/")}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            showDelete={showDelete}
          />
          <tbody className="divide-y divide-gray-200">
            {sortedItems.length > 0 ? (
              sortedItems.map((item) => (
                <TableRow
                  key={item.id}
                  item={item}
                  mealType={item.meal_type}
                  onCheckChange={handleCheckChange}
                  showDelete={showDelete}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No orders for active windows
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <table className="w-full">
          <TableHeader
            onColumnSort={handleColumnSort}
            mealType={activeWindows.join("/")}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            showDelete={showDelete}
          />
        </table>
        <div className="divide-y divide-gray-200">
          {sortedItems.length > 0 ? (
            sortedItems.map((item) => (
              <MobileTableRow
                key={item.id}
                item={item}
                onCheckChange={handleCheckChange}
                showDelete={showDelete}
                onDelete={onDelete}
              />
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No orders for active windows
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MobileTableRow({ item, onCheckChange, showDelete, onDelete }) {
  // Determine if this is a lunch order or other meal type
  const isLunch = item.meal_type === "lunch";

  if (isLunch) {
    // Lunch: Show full details (protein, carbs, side, salad)
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
  } else {
    // Breakfast or Drinks: Show only name and checkbox
    return (
      <div
        className={`p-3 sm:p-4 flex items-center gap-2 sm:gap-3 ${
          item.checked ? "bg-gray-100 opacity-50" : ""
        }`}>
        <input
          type="checkbox"
          checked={item.checked}
          onChange={() => onCheckChange(item.id)}
          className="w-4 sm:w-5 h-4 sm:h-5 accent-blue-600 cursor-pointer disabled:cursor-not-allowed shrink-0"
        />
        <div className="flex items-center justify-between gap-2 sm:gap-3 flex-1 min-w-0">
          <span
            className={`font-medium text-lg truncate ${
              item.checked ? "line-through text-gray-400" : "text-gray-900"
            }`}>
            {item.name}
          </span>
          <span
            className={`font-medium text-lg truncate ${
              item.checked ? "line-through text-gray-400" : "text-gray-900"
            }`}>
            {item.items[0].item_name}
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
    );
  }
}

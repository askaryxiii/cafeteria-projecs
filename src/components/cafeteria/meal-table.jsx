import { useEffect, useState } from "react";
import { getAllOrdersForToday } from "../../lib/apis";
import { TableHeader } from "./table-header";
import { TableRow } from "./table-row";

export function MealTable() {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [items, setItems] = useState([]);
  const [mealType, setMealType] = useState(null);

  // Fetch orders and determine meal type
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

    const fetchedOrders = await getAllOrdersForToday();
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

  // Fetch orders on mount and set up 2-minute refresh interval
  useEffect(() => {
    fetchOrders(); // Fetch immediately on mount

    // Fetch every 2 minutes (120000 ms)
    const interval = setInterval(() => {
      fetchOrders();
    }, 60000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const sortedItems = [...items].sort((a, b) => {
    // Keep checked items at the bottom
    if (a.checked !== b.checked) {
      return a.checked ? 1 : -1;
    }

    // If a sort column is selected, sort by that column
    if (sortColumn) {
      const aValue = a[sortColumn] || ""; // Default to empty string if undefined
      const bValue = b[sortColumn] || ""; // Default to empty string if undefined

      if (sortDirection === "asc") {
        return aValue.localeCompare(bValue, "ar");
      } else {
        return bValue.localeCompare(aValue, "ar");
      }
    }

    // Otherwise maintain original order
    return 0;
  });

  // Track checked items locally
  const [checkedItems, setCheckedItems] = useState(new Set());

  const handleCheckChange = (id) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
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
    <div className="bg-[#FDF6F633] border-none rounded-lg shadow p-3">
      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <TableHeader
            onColumnSort={handleColumnSort}
            mealType={mealType}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
          />
          <tbody className="divide-y divide-gray-200">
            {sortedItems.map((item) => (
              <TableRow
                key={item.id}
                item={item}
                mealType={mealType}
                onCheckChange={handleCheckChange}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="divide-y divide-gray-200">
          {sortedItems.map((item) => (
            <MobileTableRow
              key={item.id}
              item={item}
              onCheckChange={handleCheckChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileTableRow({ item, onCheckChange }) {
  return (
    <div
      className={`p-4 space-y-2 ${
        item.checked ? "bg-gray-100 opacity-50" : ""
      }`}>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={item.checked}
          onChange={() => onCheckChange(item.id)}
          className="w-5 h-5 accent-blue-600 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className="flex items-center gap-2 flex-1">
          <span className="text-lg">😊</span>
          <span className="font-medium text-gray-900">{item.name}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-600">Protein:</span>
          <p className="font-medium">{item.protein}</p>
        </div>
        <div>
          <span className="text-gray-600">Carbs:</span>
          <p className="font-medium">{item.carbs}</p>
        </div>
        <div>
          <span className="text-gray-600">Side:</span>
          <p className="font-medium">{item.side}</p>
        </div>
        <div>
          <span className="text-gray-600">Salad:</span>
          <p className="font-medium">{item.salad}</p>
        </div>
      </div>
    </div>
  );
}

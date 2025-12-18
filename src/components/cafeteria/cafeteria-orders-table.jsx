import { useEffect, useState } from "react";
import {
  getAllOrdersForToday,
  getAllOrdersForTomorrow,
  deleteOrder,
} from "../../lib/apis";
import toast from "react-hot-toast";

/**
 * CafeteriaOrdersTable - Shows all orders for cafeteria staff (no window filtering)
 * Displays: Today's breakfast + drinks, Tomorrow's lunch
 * Columns: Full Name, Order, Actions
 */
export function CafeteriaOrdersTable({
  showDelete = false,
  onDelete = null,
  refreshTrigger = 0,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState(() => {
    try {
      const raw = localStorage.getItem("cafeteriaOrdersTable.checked") || "[]";
      const arr = JSON.parse(raw);
      return new Set(Array.isArray(arr) ? arr : []);
    } catch (e) {
      return new Set();
    }
  });

  // Fetch all orders without window filtering
  const fetchOrders = async () => {
    try {
      setLoading(true);

      // Fetch today's orders (breakfast + drinks)
      const todayData = await getAllOrdersForToday();
      // Fetch tomorrow's orders (lunch)
      const tomorrowData = await getAllOrdersForTomorrow();

      if (todayData.error || tomorrowData.error) {
        console.error(
          "Error fetching orders:",
          todayData.error || tomorrowData.error
        );
        setItems([]);
        return;
      }

      // Combine all orders
      let combinedOrders = [];

      // Add today's breakfast orders
      if (todayData.breakfastOrders?.length > 0) {
        combinedOrders = [...combinedOrders, ...todayData.breakfastOrders];
      }

      // Add today's drinks orders
      if (todayData.drinksOrders?.length > 0) {
        combinedOrders = [...combinedOrders, ...todayData.drinksOrders];
      }

      // Add tomorrow's lunch orders
      if (tomorrowData.lunchOrders?.length > 0) {
        combinedOrders = [...combinedOrders, ...tomorrowData.lunchOrders];
      }

      setItems(combinedOrders);
    } catch (error) {
      console.error("Error in fetchOrders:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders on mount and when refresh is triggered
  useEffect(() => {
    fetchOrders();
  }, [refreshTrigger]);

  // Format order details based on meal type
  const formatOrderDetails = (order) => {
    const mealType = order.meal_type?.toLowerCase();

    if (mealType === "breakfast" || mealType === "drinks") {
      // For breakfast/drinks, show the single item name
      return order.items?.[0]?.item_name || "-";
    } else if (mealType === "lunch") {
      // For lunch, combine items by category
      const categories = ["protein", "carbs", "side", "salad"];
      const categoryItems = categories
        .map((cat) => {
          const items = order.items.filter(
            (item) => item.category?.toLowerCase() === cat.toLowerCase()
          );
          if (items.length > 0) {
            const itemNames = items.map((i) => i.item_name).join(", ");
            return itemNames;
          }
          return null;
        })
        .filter((item) => item !== null);

      return categoryItems.join(" | ");
    }

    return "-";
  };

  const handleCheckChange = (id) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      try {
        localStorage.setItem(
          "cafeteriaOrdersTable.checked",
          JSON.stringify([...newSet])
        );
      } catch (e) {
        /* ignore storage errors */
      }
      return newSet;
    });
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
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left border">Checkbox</th>
              <th className="px-4 py-2 text-left border">Full Name</th>
              <th className="px-4 py-2 text-left border">Order</th>
              <th className="px-4 py-2 text-left border">Meal Type</th>
              {showDelete && (
                <th className="px-4 py-2 text-center border">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.length > 0 ? (
              items.map((item) => (
                <tr
                  key={item.id}
                  className={item.checked ? "bg-gray-100 opacity-50" : ""}>
                  <td className="px-4 py-2 border">
                    <input
                      type="checkbox"
                      checked={checkedItems.has(item.id)}
                      onChange={() => handleCheckChange(item.id)}
                      className="w-4 h-4 accent-blue-600 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-2 border font-medium">{item.name}</td>
                  <td className="px-4 py-2 border">
                    {formatOrderDetails(item)}
                  </td>
                  <td className="px-4 py-2 border text-sm capitalize">
                    {item.meal_type}
                  </td>
                  {showDelete && (
                    <td className="px-4 py-2 border text-center">
                      <button
                        onClick={() => onDelete && onDelete(item.id)}
                        className="text-red-500 hover:text-red-700 text-lg">
                        🗑️
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={showDelete ? 5 : 4}
                  className="text-center py-4 text-gray-500">
                  No orders
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-3">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className={`p-3 border border-gray-200 rounded ${
                checkedItems.has(item.id)
                  ? "bg-gray-100 opacity-50"
                  : "bg-white"
              }`}>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={checkedItems.has(item.id)}
                  onChange={() => handleCheckChange(item.id)}
                  className="w-4 h-4 accent-blue-600 cursor-pointer mt-1 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold">Order:</span>{" "}
                    {formatOrderDetails(item)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 capitalize">
                    {item.meal_type}
                  </p>
                </div>
                {showDelete && (
                  <button
                    onClick={() => onDelete && onDelete(item.id)}
                    className="text-red-500 hover:text-red-700 text-lg shrink-0">
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">No orders</div>
        )}
      </div>
    </div>
  );
}

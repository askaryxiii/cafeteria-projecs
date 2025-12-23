import { useEffect, useState } from "react";
import {
  getAllOrdersForToday,
  getServerTimeComponents,
  isTimeInWindow,
} from "../../lib/apis";
import { MdDelete } from "react-icons/md";

const DashboardCafeteria = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [currentWindow, setCurrentWindow] = useState("");

  // Fetch all today's orders on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const timeComponents = await getServerTimeComponents();
      const { hour, minute } = timeComponents;

      // Determine current meal window
      const inBreakfast = isTimeInWindow(hour, minute, "11:00", "15:00");
      const inLunch = isTimeInWindow(hour, minute, "15:00", "23:59");
      // drinks are always available

      let mealTypeFilter = "drinks"; // default to drinks if outside windows

      if (inBreakfast) {
        mealTypeFilter = "breakfast";
        setCurrentWindow("Breakfast");
      } else if (inLunch) {
        mealTypeFilter = "lunch";
        setCurrentWindow("Lunch");
      } else {
        mealTypeFilter = "drinks";
        setCurrentWindow("Drinks");
      }

      const orderData = await getAllOrdersForToday();

      if (orderData.error) {
        console.error("Error fetching orders:", orderData.error);
        setOrders([]);
        return;
      }

      // Get orders only for the current meal type
      let filteredOrders = [];

      if (mealTypeFilter === "breakfast") {
        filteredOrders = orderData.breakfastOrders || [];
      } else if (mealTypeFilter === "lunch") {
        filteredOrders = orderData.lunchOrders || [];
      } else {
        filteredOrders = orderData.drinksOrders || [];
      }

      // Sort by created_at descending (newest first)
      filteredOrders.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setOrders(filteredOrders);
    } catch (error) {
      console.error("Error in fetchOrders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Format order items as comma-separated list with weight_grams if available
  const formatOrderItems = (items) => {
    if (!items || items.length === 0) return "-";
    return items
      .map((item) => {
        let displayText = item.item_name;
        if (item.weight_grams) {
          displayText += ` (${item.weight_grams}جرام )`;
        }
        return displayText;
      })
      .join(" + ");
  };

  // Handle checkbox change
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

  // Handle delete order
  const handleDeleteOrder = (orderId) => {
    // TODO: Implement delete API call
    console.error("Delete not implemented yet for order:", orderId);
  };

  if (loading) {
    return <div className="p-4">Loading orders...</div>;
  }

  return (
    <div className="p-0 md:p-4 lg:p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {currentWindow} Orders
        </h2>
      </div>
      <div className="bg-[#FDF6F633] border-none rounded-lg shadow p-2 sm:p-3 md:p-4">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="px-4 py-3 text-left font-semibold">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-blue-600 cursor-pointer"
                    checked={
                      checkedItems.size === orders.length && orders.length > 0
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCheckedItems(new Set(orders.map((o) => o.id)));
                      } else {
                        setCheckedItems(new Set());
                      }
                    }}
                  />
                </th>
                <th className="px-4 py-3 text-left font-semibold">Full Name</th>
                <th className="px-4 py-3 text-left font-semibold">Order</th>
                <th className="px-4 py-3 text-left font-semibold">Meal Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className={`hover:bg-gray-50 ${
                      checkedItems.has(order.id) ? "bg-gray-100" : ""
                    }`}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={checkedItems.has(order.id)}
                        onChange={() => handleCheckChange(order.id)}
                        className="w-5 h-5 accent-blue-600 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {order.name}
                      <br />
                      <span className="text-xs text-gray-600">
                        {order.arabic_name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {formatOrderItems(order.items)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.meal_type === "breakfast"
                            ? "bg-orange-100 text-orange-800"
                            : order.meal_type === "lunch"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}>
                        {order.meal_type.charAt(0).toUpperCase() +
                          order.meal_type.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    No {currentWindow.toLowerCase()} orders for now
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-3">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order.id}
                className={`p-4 border rounded-lg ${
                  checkedItems.has(order.id)
                    ? "bg-gray-100 border-gray-300"
                    : "bg-white border-gray-200"
                }`}>
                <div className="flex items-start gap-3 mb-2">
                  <input
                    type="checkbox"
                    checked={checkedItems.has(order.id)}
                    onChange={() => handleCheckChange(order.id)}
                    className="w-5 h-5 accent-blue-600 cursor-pointer mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{order.name}</p>
                    <p className="text-xs text-gray-600">{order.arabic_name}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="text-red-500 hover:text-red-700 text-lg">
                    <MdDelete />
                  </button>
                </div>
                <div className="ml-8 space-y-1 text-sm">
                  <p className="text-gray-700">
                    <span className="font-semibold">Order: </span>
                    {formatOrderItems(order.items)}
                  </p>
                  <p>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        order.meal_type === "breakfast"
                          ? "bg-orange-100 text-orange-800"
                          : order.meal_type === "lunch"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}>
                      {order.meal_type.charAt(0).toUpperCase() +
                        order.meal_type.slice(1)}
                    </span>
                  </p>
                  <p className="text-gray-900 font-semibold">
                    Cost: {order.total_cost}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No {currentWindow.toLowerCase()} orders for now
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCafeteria;

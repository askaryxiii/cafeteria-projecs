import { useEffect, useRef, useState } from "react";
import {
  getAllOrdersForToday,
  getServerTimeComponents,
  isTimeInWindow,
} from "../../lib/apis";
import { unlockAudio, playNewOrderSound } from "../../lib/sound";
import { MdArrowUpward, MdArrowDownward } from "react-icons/md";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";

// Add CSS for smooth line animation
const lineAnimationStyle = `
  @keyframes drawLine {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

.line-through-animated::after {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 2px;
  width: 0;
  background-color: #999;
  animation: drawLine 0.6s ease-in-out forwards;
  pointer-events: none;
}
`;

// Inject styles
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = lineAnimationStyle;
  document.head.appendChild(style);
}

const DashboardCafeteria = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [currentWindow, setCurrentWindow] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "arabic_name",
    direction: "asc",
  });
  const previousOrderIdsRef = useRef(new Set());

  // Load checked items from localStorage on mount
  useEffect(() => {
    const savedCheckedItems = localStorage.getItem("cafeteriaCheckedItems");
    if (savedCheckedItems) {
      try {
        const parsed = JSON.parse(savedCheckedItems);
        setCheckedItems(new Set(parsed));
      } catch (error) {
        console.error("Error loading checked items from localStorage:", error);
      }
    }
  }, []);

  // Fetch all today's orders on mount
  useEffect(() => {
    fetchOrders();
    // Fetch every 1 minute (60000 ms)
    const interval = setInterval(() => {
      fetchOrders();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // notification sound for new orders
  useEffect(() => {
    const unlock = () => unlockAudio();

    window.addEventListener("click", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("keydown", unlock);
    };
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

      const orderData = await getAllOrdersForToday();

      if (orderData.error) {
        console.error("Error fetching orders:", orderData.error);
        setOrders([]);
        return;
      }

      // Get orders for current meal type + drinks (drinks always shown)
      let filteredOrders = [];

      if (inBreakfast) {
        filteredOrders = [
          ...(orderData.breakfastOrders || []),
          ...(orderData.drinksOrders || []),
        ];
        setCurrentWindow("Breakfast & Drinks");
      } else if (inLunch) {
        filteredOrders = [
          ...(orderData.lunchOrders || []),
          ...(orderData.drinksOrders || []),
        ];
        setCurrentWindow("Lunch & Drinks");
      } else {
        // Outside meal windows, show drinks only
        filteredOrders = orderData.drinksOrders || [];
        setCurrentWindow("Drinks");
      }

      // Sort by created_at descending (newest first)
      filteredOrders.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      const newIds = new Set(filteredOrders.map((o) => o.id));
      const oldIds = previousOrderIdsRef.current;

      // Only play sound if this is NOT the first load
      if (oldIds.size > 0) {
        const hasNewOrder = [...newIds].some((id) => !oldIds.has(id));

        if (hasNewOrder) {
          playNewOrderSound();
        }
      }

      // Update ref AFTER comparison
      previousOrderIdsRef.current = newIds;

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

  // Handle sort by column
  const handleSort = (key) => {
    let direction = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  // Sort orders based on sort config
  const sortedOrders = [...orders].sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // Handle date comparison
    if (sortConfig.key === "created_at") {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    // Handle string comparison
    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Handle checkbox change
  const handleCheckChange = (id) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      // Save to localStorage
      localStorage.setItem(
        "cafeteriaCheckedItems",
        JSON.stringify(Array.from(newSet))
      );
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
      <div className="border-none rounded-lg shadow ">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto rounded-lg ">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="border-b-2  border-gray-300 align-middle bg-burned-grey">
                <th className="px-4 py-3 text-left font-semibold">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-blue-600 cursor-pointer"
                    checked={
                      checkedItems.size === orders.length && orders.length > 0
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        const newSet = new Set(orders.map((o) => o.id));
                        setCheckedItems(newSet);
                        localStorage.setItem(
                          "cafeteriaCheckedItems",
                          JSON.stringify(Array.from(newSet))
                        );
                      } else {
                        setCheckedItems(new Set());
                        localStorage.setItem(
                          "cafeteriaCheckedItems",
                          JSON.stringify([])
                        );
                      }
                    }}
                  />
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold cursor-pointer align-middle"
                  onClick={() => handleSort("arabic_name")}>
                  <div className="flex items-center gap-2">
                    Full Name
                    {sortConfig.key === "arabic_name" &&
                      (sortConfig.direction === "asc" ? (
                        <IoMdArrowDropup className="w-4 h-4" />
                      ) : (
                        <IoMdArrowDropdown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-semibold">Order</th>
                <th className="px-4 py-3 text-left font-semibold">Meal Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedOrders.length > 0 ? (
                sortedOrders.map((order) => (
                  <tr
                    key={order.id}
                    className={`hover:bg-gray-50 relative ${
                      checkedItems.has(order.id) ? "line-through-animated" : ""
                    }`}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={checkedItems.has(order.id)}
                        onChange={() => handleCheckChange(order.id)}
                        className="w-5 h-5  cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3 text-xl font-medium text-gray-900">
                      {order.arabic_name}
                      <br />
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
          {sortedOrders.length > 0 ? (
            sortedOrders.map((order) => (
              <div
                key={order.id}
                className={`relative p-4 border rounded-lg flex justify-between items-center overflow-hidden ${
                  checkedItems.has(order.id)
                    ? "bg-gray-100 border-gray-300"
                    : "bg-white border-gray-200"
                } ${
                  checkedItems.has(order.id) ? "line-through-animated" : ""
                }`}>
                <div>
                  <div className="flex items-start gap-3 mb-2">
                    <input
                      type="checkbox"
                      checked={checkedItems.has(order.id)}
                      onChange={() => handleCheckChange(order.id)}
                      className="w-5 h-5 accent-blue-600 cursor-pointer mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">
                        {order.arabic_name}
                      </p>
                    </div>
                    {/* <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="text-red-500 hover:text-red-700 text-lg">
                    <MdDelete />
                  </button> */}
                  </div>
                </div>
                <div className="ml-8 space-y-3 text-sm">
                  <p className="text-gray-700">
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

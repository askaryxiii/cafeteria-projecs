import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// Generate chart data from total orders
const generateChartData = (totalOrders, mostOrderedItems = []) => {
  

  const itemCount = mostOrderedItems.length || 6;
  const ordersPerItem = Math.round(totalOrders / itemCount);

  // Create data points based on most ordered items
  if (mostOrderedItems.length > 0) {
    return mostOrderedItems.slice(0, 6).map((item, idx) => ({
      name: String(idx + 1).padStart(2, "0"),
      orders: Math.round(parseInt(item.total_quantity) * 100),
    }));
  }

  // Fallback: distribute total orders across 6 intervals
  return Array.from({ length: 6 }, (_, i) => ({
    name: String(i + 1).padStart(2, "0"),
    orders: Math.round(ordersPerItem * (0.8 + Math.random() * 0.4)), // Add variance
  }));
};

export default function OrderChart({ timePeriod = "24hours", data = null }) {
  const totalOrders = data?.total_orders;
  const mostOrderedItems = data?.most_ordered_items;
  const chartData = generateChartData(totalOrders, mostOrderedItems);
  return (
    <div className="w-full">
      <div className="h-56 md:h-64 w-full">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              fontSize={window.innerWidth < 640 ? 10 : 12}
              stroke="#9ca3af"
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: window.innerWidth < 640 ? "11px" : "12px",
              }}
              formatter={(value) => `${value} orders`}
            />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#6366f1"
              strokeWidth={window.innerWidth < 640 ? 2 : 3}
              dot={{ fill: "#6366f1", r: window.innerWidth < 640 ? 3 : 4 }}
              activeDot={{ r: window.innerWidth < 640 ? 4 : 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between mt-2 sm:mt-3 md:mt-4 text-xs sm:text-xs md:text-sm text-gray-600 gap-2">
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
          <div className="w-1.5 sm:w-2 md:w-2.5 h-1.5 sm:h-2 md:h-2.5 bg-blue-600 rounded-full"></div>
          <span>Last 6 days</span>
        </div>
        <span>Last Month</span>
      </div>
    </div>
  );
}

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
  if (!totalOrders || totalOrders === 0) return defaultData;

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
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" fontSize={12} stroke="#9ca3af" />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
              formatter={(value) => `${value} orders`}
            />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ fill: "#6366f1", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between mt-4 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          <span>Last 6 days</span>
        </div>
        <span>Last Month</span>
      </div>
    </div>
  );
}

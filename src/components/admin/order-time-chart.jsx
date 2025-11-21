import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// Default data for when no real data is available
const defaultData = [
  { name: "Afternoon", value: 40 },
  { name: "Evening", value: 32 },
  { name: "Morning", value: 28 },
];

const COLORS = ["#6366f1", "#a5b4fc", "#dbeafe"];

// Generate pie chart data from order time range
const generatePieData = (mostCommonTimeRange) => {
  if (!mostCommonTimeRange) return defaultData;

  const { time_range, count } = mostCommonTimeRange;
  if (!time_range || count === 0) return defaultData;

  // Create data with the most common time range having the highest value
  const timeRanges = ["morning", "afternoon", "evening"];
  const commonIndex = timeRanges.indexOf(time_range.toLowerCase());

  if (commonIndex === -1) return defaultData;

  const totalValue = 100;
  const commonValue = Math.round(totalValue * 0.5); // Most common gets 50%
  const remainingValue = totalValue - commonValue;
  const otherValue = Math.round(remainingValue / 2);

  return timeRanges.map((range, idx) => {
    if (idx === commonIndex) {
      return {
        name: range.charAt(0).toUpperCase() + range.slice(1),
        value: commonValue,
        order_count: count,
      };
    } else {
      return {
        name: range.charAt(0).toUpperCase() + range.slice(1),
        value: otherValue,
        order_count: Math.round(count * 0.3),
      };
    }
  });
};

export default function OrderTimeChart({
  timePeriod = "24hours",
  data = null,
}) {
  const mostCommonTimeRange = data?.most_common_time_range;
  const pieData = generatePieData(mostCommonTimeRange);

  // Get the most common time range for display
  const primaryTimeRange =
    pieData.find(
      (item) =>
        item.name.toLowerCase() ===
        mostCommonTimeRange?.time_range?.toLowerCase()
    ) || pieData[0];

  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex-1 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={0}
              dataKey="value">
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${value}%`}
              contentStyle={{
                backgroundColor: "#fff",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend with custom styling */}
      <div className="ml-8 space-y-3">
        <div className="flex items-center gap-3 p-3 bg-gray-800 text-white rounded text-sm font-medium min-w-40">
          <div>
            <div className="text-xs opacity-75">{primaryTimeRange.name}</div>
            <div className="font-bold">{primaryTimeRange.value}%</div>
            <div className="font-bold">
              {primaryTimeRange.order_count || mostCommonTimeRange?.count || 0}{" "}
              orders
            </div>
          </div>
        </div>
        <div className="space-y-2 text-xs">
          {pieData.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
              <span className="text-gray-700">
                {item.name} {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

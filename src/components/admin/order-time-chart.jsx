import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// Default data for when no real data is available
const defaultData = [
  { name: "Afternoon", value: 0 },
  { name: "Evening", value: 0 },
  { name: "Morning", value: 0 },
];

const COLORS = ["#6366f1", "#3B82F6", "#a5b4fc"];

// Generate pie chart data from time_range_distribution
const generatePieData = (timeRangeDistribution, mostCommonTimeRange) => {
  if (!timeRangeDistribution) return defaultData;

  // Extract morning, afternoon, evening data
  const morning = timeRangeDistribution.morning || {
    count: 0,
    percentage: 0,
  };
  const afternoon = timeRangeDistribution.afternoon || {
    count: 0,
    percentage: 0,
  };
  const evening = timeRangeDistribution.evening || {
    count: 0,
    percentage: 0,
  };

  // Check if we have valid data
  const totalCount = morning.count + afternoon.count + evening.count;
  if (totalCount === 0) return defaultData;

  return [
    {
      name: "Morning",
      value: Math.round(parseFloat(morning.percentage) || 0),
      percentage: parseFloat(morning.percentage) || 0,
      count: morning.count,
    },
    {
      name: "Afternoon",
      value: Math.round(parseFloat(afternoon.percentage) || 0),
      percentage: parseFloat(afternoon.percentage) || 0,
      count: afternoon.count,
    },
    {
      name: "Evening",
      value: Math.round(parseFloat(evening.percentage) || 0),
      percentage: parseFloat(evening.percentage) || 0,
      count: evening.count,
    },
  ];
};

export default function OrderTimeChart({
  timePeriod = "24hours",
  data = null,
}) {
  const timeRangeDistribution = data?.time_range_distribution;
  const mostCommonTimeRange = data?.most_common_time_range;
  const pieData = generatePieData(timeRangeDistribution, mostCommonTimeRange);

  // Get the most common time range for display (highest percentage)
  const primaryTimeRange =
    pieData.reduce((max, item) => (item.value > max.value ? item : max)) ||
    pieData[0];

  console.log(data);

  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex-1 h-64">
        <ResponsiveContainer width="100%" height={220}>
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
            <div className="font-bold">
              {primaryTimeRange.percentage
                ? primaryTimeRange.percentage.toFixed(2)
                : 0}
              %
            </div>
            <div className="font-bold">
              {primaryTimeRange.count} orders / {data.total_orders}
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
                {primaryTimeRange.percentage ? item.percentage.toFixed(2) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

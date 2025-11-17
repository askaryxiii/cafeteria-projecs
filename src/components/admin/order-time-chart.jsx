import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const data = [
  { name: "Afternoon", value: 40 },
  { name: "Evening", value: 32 },
  { name: "Morning", value: 28 },
];

const COLORS = ["#6366f1", "#a5b4fc", "#dbeafe"];

export default function OrderTimeChart() {
  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex-1 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={0}
              dataKey="value">
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${value}%`}
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend with custom styling to match screenshot */}
      <div className="ml-8 space-y-3">
        <div className="flex items-center gap-3 p-3 bg-gray-800 text-white rounded text-sm font-medium min-w-[160px]">
          <div>
            <div className="text-xs opacity-75">Afternoon</div>
            <div className="font-bold">1pm - 4pm</div>
            <div className="font-bold">100 orders</div>
          </div>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-gray-700">Afternoon 40%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span className="text-gray-700">Evening 32%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-200 rounded-full"></div>
            <span className="text-gray-700">Morning 28%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

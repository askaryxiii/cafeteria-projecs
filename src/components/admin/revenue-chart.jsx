import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const dataByPeriod = {
  "24hours": [
    { name: "01", value: 40 },
    { name: "02", value: 30 },
    { name: "03", value: 35 },
    { name: "04", value: 25 },
    { name: "05", value: 50 },
    { name: "06", value: 60 },
    { name: "07", value: 45 },
    { name: "08", value: 35 },
    { name: "09", value: 40 },
    { name: "10", value: 30 },
    { name: "11", value: 50 },
    { name: "12", value: 65 },
  ],
  weeks: [
    { name: "01", value: 45 },
    { name: "02", value: 35 },
    { name: "03", value: 40 },
    { name: "04", value: 30 },
    { name: "05", value: 55 },
    { name: "06", value: 65 },
    { name: "07", value: 50 },
    { name: "08", value: 40 },
    { name: "09", value: 45 },
    { name: "10", value: 35 },
    { name: "11", value: 55 },
    { name: "12", value: 70 },
  ],
  months: [
    { name: "01", value: 50 },
    { name: "02", value: 40 },
    { name: "03", value: 45 },
    { name: "04", value: 35 },
    { name: "05", value: 60 },
    { name: "06", value: 70 },
    { name: "07", value: 55 },
    { name: "08", value: 45 },
    { name: "09", value: 50 },
    { name: "10", value: 40 },
    { name: "11", value: 60 },
    { name: "12", value: 75 },
  ],
  years: [
    { name: "01", value: 55 },
    { name: "02", value: 45 },
    { name: "03", value: 50 },
    { name: "04", value: 40 },
    { name: "05", value: 65 },
    { name: "06", value: 75 },
    { name: "07", value: 60 },
    { name: "08", value: 50 },
    { name: "09", value: 55 },
    { name: "10", value: 45 },
    { name: "11", value: 65 },
    { name: "12", value: 80 },
  ],
};

export default function RevenueChart({ timePeriod = "24hours" }) {
  const data = dataByPeriod[timePeriod] || dataByPeriod["24hours"];

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" fontSize={12} stroke="#9ca3af" />
          <YAxis hide />
          <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-between mt-4 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          <span>Last 6 days</span>
        </div>
        <span>Last Week</span>
      </div>
    </div>
  );
}

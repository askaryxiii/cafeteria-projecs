import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// Fallback data for when real data is not available
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

// Generate chart data from revenue value
const generateChartData = (revenue, timePeriod) => {
  const revenueValue = parseFloat(revenue || 0);
  if (revenueValue === 0) return dataByPeriod[timePeriod];

  // Distribute revenue across 12 intervals
  const intervals = 12;
  const avgPerInterval = revenueValue / intervals;

  return Array.from({ length: intervals }, (_, i) => ({
    name: String(i + 1).padStart(2, "0"),
    value: Math.round(avgPerInterval * (0.7 + Math.random() * 0.6)), // Add some variance
  }));
};

export default function RevenueChart({
  timePeriod = "24hours",
  revenue = null,
}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const data = revenue
    ? generateChartData(revenue, timePeriod)
    : dataByPeriod[timePeriod] || dataByPeriod["24hours"];
  if (!data || data.length === 0) {
    return <p className="text-gray-400 text-sm text-center">No data</p>;
  }
  return (
    <div className="relative w-full h-[220px] min-h-[220px] md:h-[300px] ">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            fontSize={isMobile ? 10 : 12}
            stroke="#9ca3af"
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: isMobile ? "11px" : "12px",
            }}
            formatter={(value) => `EGP ${value}`}
          />
          <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-between mt-2 sm:mt-3 md:mt-4 text-xs sm:text-xs md:text-sm text-gray-600 gap-2">
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
          <div className="w-1.5 sm:w-2 md:w-2.5 h-1.5 sm:h-2 md:h-2.5 bg-blue-600 rounded-full"></div>
          <span>Last 6 days</span>
        </div>
        <span>Last Week</span>
      </div>
    </div>
  );
}

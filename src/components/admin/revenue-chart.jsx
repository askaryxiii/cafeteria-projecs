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

export default function RevenueChart({ timePeriod = "24hours", data = null }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Transform API data into chart format based on time period
  useEffect(() => {
    if (!data || !data.revenue_by_period) {
      setChartData([]);
      return;
    }

    let formattedData = [];

    switch (timePeriod) {
      case "24hours":
        // 24 hours - hourly data (0-23)
        formattedData = (data.revenue_by_period.hourly || []).map(
          (item, index) => ({
            name: String(index).padStart(2, "0"),
            value: Math.round(parseFloat(item.revenue || 0)),
          })
        );
        break;

      case "weeks":
        // Weekly data (7 days)
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        formattedData = (data.revenue_by_period.daily || []).map(
          (item, index) => ({
            name: dayNames[index % 7],
            value: Math.round(parseFloat(item.revenue || 0)),
          })
        );
        break;

      case "months":
        // Monthly data (days of month, ~30 days)
        formattedData = (data.revenue_by_period.daily || []).map(
          (item, index) => ({
            name: String(index + 1).padStart(2, "0"),
            value: Math.round(parseFloat(item.revenue || 0)),
          })
        );
        break;

      case "years":
        // Yearly data (12 months)
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        formattedData = (data.revenue_by_period.monthly || []).map(
          (item, index) => ({
            name: monthNames[index % 12],
            value: Math.round(parseFloat(item.revenue || 0)),
          })
        );
        break;

      default:
        formattedData = [];
    }

    setChartData(formattedData);
  }, [timePeriod, data]);

  if (!chartData || chartData.length === 0) {
    return (
      <p className="text-gray-400 text-sm text-center py-8">
        No data available
      </p>
    );
  }

  // Calculate the height based on number of data points
  const getChartHeight = () => {
    if (timePeriod === "24hours") return 300;
    if (timePeriod === "weeks") return 250;
    if (timePeriod === "months") return 350;
    if (timePeriod === "years") return 250;
    return 250;
  };

  return (
    <div className="relative w-full">
      <div style={{ height: `${getChartHeight()}px`, minHeight: "220px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              fontSize={isMobile ? 10 : 12}
              stroke="#9ca3af"
              angle={timePeriod === "24hours" ? -45 : 0}
              textAnchor={timePeriod === "24hours" ? "end" : "middle"}
              height={timePeriod === "24hours" ? 60 : 30}
            />
            <YAxis
              stroke="#9ca3af"
              fontSize={isMobile ? 10 : 12}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: isMobile ? "11px" : "12px",
              }}
              formatter={(value) => [`EGP ${value.toFixed(2)}`, "Revenue"]}
              labelFormatter={(label) => `${label}`}
            />
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-between mt-2 sm:mt-3 md:mt-4 text-xs sm:text-xs md:text-sm text-gray-600 gap-2">
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
          <div className="w-1.5 sm:w-2 md:w-2.5 h-1.5 sm:h-2 md:h-2.5 bg-blue-600 rounded-full"></div>
          <span>
            {timePeriod === "24hours"
              ? "24 Hours"
              : timePeriod === "weeks"
              ? "7 Days"
              : timePeriod === "months"
              ? "30 Days"
              : "12 Months"}
          </span>
        </div>
        <span>
          Total: EGP{" "}
          {chartData.reduce((sum, item) => sum + item.value, 0).toFixed(2)}
        </span>
      </div>
    </div>
  );
}

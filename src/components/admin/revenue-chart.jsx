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

  // Format data from API breakdown
  const formatRevenueData = (totalRevenueObj, timePeriod) => {
    if (
      !totalRevenueObj ||
      !totalRevenueObj.breakdown ||
      !totalRevenueObj.breakdown.data
    ) {
      return [];
    }

    const breakdownData = totalRevenueObj.breakdown.data;
    let chartDataArray = [];

    switch (timePeriod) {
      case "24hours": {
        // Convert hourly breakdown to chart format
        chartDataArray = Array.from({ length: 24 }, (_, hour) => {
          const timeKey = String(hour).padStart(2, "0") + ":00";
          const hourData = breakdownData[timeKey];
          return {
            name: String(hour).padStart(2, "0"),
            value: hourData ? Math.round(parseFloat(hourData.revenue || 0)) : 0,
          };
        });
        break;
      }

      case "weeks": {
        // Convert daily breakdown to chart format (7 days)
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const dayMap = {};

        // Group by day name
        Object.values(breakdownData).forEach((dayData) => {
          if (dayData.day_name) {
            if (!dayMap[dayData.day_name]) {
              dayMap[dayData.day_name] = 0;
            }
            dayMap[dayData.day_name] += parseFloat(dayData.revenue || 0);
          }
        });

        // Create chart data with all 7 days
        chartDataArray = dayNames.map((day) => ({
          name: day,
          value: Math.round(dayMap[day] || 0),
        }));
        break;
      }

      case "months": {
        // Convert daily breakdown to chart format (30 days)
        const dayMap = {};

        // Group by day of month
        Object.values(breakdownData).forEach((dayData) => {
          if (dayData.day !== undefined) {
            const dayStr = String(dayData.day).padStart(2, "0");
            if (!dayMap[dayStr]) {
              dayMap[dayStr] = 0;
            }
            dayMap[dayStr] += parseFloat(dayData.revenue || 0);
          }
        });

        // Create chart data with all 30 days
        chartDataArray = Array.from({ length: 30 }, (_, i) => {
          const day = String(i + 1).padStart(2, "0");
          return {
            name: day,
            value: Math.round(dayMap[day] || 0),
          };
        });
        break;
      }

      case "years": {
        // Convert monthly breakdown to chart format (12 months)
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
        const monthMap = {};

        // Group by month
        Object.values(breakdownData).forEach((monthData) => {
          if (monthData.month_label) {
            // Extract month name from label like "January 2026"
            const monthName = monthData.month_label.split(" ")[0];
            monthMap[monthName] = Math.round(
              parseFloat(monthData.revenue || 0)
            );
          }
        });

        // Create chart data with all 12 months
        chartDataArray = monthNames.map((month) => ({
          name: month,
          value: monthMap[month] || 0,
        }));
        break;
      }

      default:
        chartDataArray = [];
    }

    return chartDataArray;
  };

  // Update chart when data or timePeriod changes
  useEffect(() => {
    if (!data || !data.total_revenue) {
      setChartData([]);
      return;
    }

    const revenueData = formatRevenueData(data.total_revenue, timePeriod);
    setChartData(revenueData);
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

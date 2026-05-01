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
import time from "@/utils/timeClient";

export default function RevenueChart({ timePeriod = "24hours", data = null }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [chartData, setChartData] = useState([]);
  const [mounted, setMounted] = useState(false);
  const THEME_COLOR = "#3B82F6"; // Projecs Blue

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Format data from API breakdown
  const formatRevenueData = (totalRevenueObj, timePeriod) => {
    if (
      !totalRevenueObj ||
      !totalRevenueObj.breakdown ||
      !totalRevenueObj.breakdown.data
    ) {
      console.log("Missing breakdown data", totalRevenueObj);
      return [];
    }

    const breakdownData = totalRevenueObj.breakdown.data;
    let chartDataArray = [];

    const weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const fullWeekdayNames = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
    ];

    switch (timePeriod) {
      case "24hours":
      case "weeks": {
        const dayRevenueMap = {};
        const dayOrderCountMap = {};
        const dayDateMap = {};

        // Initialize all weekdays (KEEP empty days)
        weekdayNames.forEach((day) => {
          dayRevenueMap[day] = 0;
          dayOrderCountMap[day] = 0;
          dayDateMap[day] = null;
        });

        // Group backend data
        Object.values(breakdownData).forEach((dayData) => {
          if (!dayData.day_name) return;

          const dayIndex = fullWeekdayNames.indexOf(dayData.day_name.trim());
          if (dayIndex === -1) return;

          const dayKey = weekdayNames[dayIndex];

          dayRevenueMap[dayKey] += parseFloat(dayData.revenue || 0);
          dayOrderCountMap[dayKey] += parseInt(dayData.order_count || 0);

          if (dayData.date && !dayDateMap[dayKey]) {
            dayDateMap[dayKey] = dayData.date.split("-")[2];
          }
        });

        // 🔥 X-axis stays date-based like before
        chartDataArray = weekdayNames.map((day) => ({
          name: dayDateMap[day] ? `${day} ${dayDateMap[day]}` : day,
          value: Math.round(dayRevenueMap[day]),
          orderCount: dayOrderCountMap[day], // 👈 available for tooltip
        }));

        break;
      }

      case "months": {
        // Convert daily breakdown to chart format (days 1-31, only show days with data)
        const dayMap = {};
        const dayOrderMap = {};

        // Group by day of month
        Object.values(breakdownData).forEach((dayData) => {
          let dayNum = dayData.day;

          // If no day property, try to extract from date
          if (dayNum === undefined && dayData.date) {
            dayNum = time.parseISO(dayData.date).day;
          }

          if (dayNum !== undefined) {
            const dayStr = String(dayNum).padStart(2, "0");
            dayMap[dayStr] =
              (dayMap[dayStr] || 0) + parseFloat(dayData.revenue || 0);
            dayOrderMap[dayStr] =
              (dayOrderMap[dayStr] || 0) + parseInt(dayData.order_count || 0);
          }
        });

        // Create chart data, only showing days with data
        chartDataArray = Object.keys(dayMap)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map((day) => ({
            name: `Day ${parseInt(day)}`,
            value: Math.round(dayMap[day]),
            orderCount: dayOrderMap[day],
          }));

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
        const monthOrderMap = {};

        // Initialize all months
        monthNames.forEach((month) => {
          monthMap[month] = 0;
          monthOrderMap[month] = 0;
        });

        // Group by month
        Object.values(breakdownData).forEach((monthData) => {
          let monthNum = monthData.month;
          let monthName = null;

          // Try to get month name from label (e.g., "January 2026" -> "Jan")
          if (monthData.month_label) {
            const fullMonthName = monthData.month_label.split(" ")[0];
            // Convert full month name to 3-letter abbreviation
            const monthAbbreviations = {
              January: "Jan",
              February: "Feb",
              March: "Mar",
              April: "Apr",
              May: "May",
              June: "Jun",
              July: "Jul",
              August: "Aug",
              September: "Sep",
              October: "Oct",
              November: "Nov",
              December: "Dec",
            };
            monthName = monthAbbreviations[fullMonthName];
          }

          // If no month name yet, try to use month number
          if (!monthName && monthNum !== undefined) {
            monthName = monthNames[monthNum - 1];
          }

          if (monthName && monthNames.includes(monthName)) {
            monthMap[monthName] += parseFloat(monthData.revenue || 0);
            monthOrderMap[monthName] += parseInt(monthData.order_count || 0);
          }
        });

        // Create chart data with all 12 months
        chartDataArray = monthNames.map((month) => ({
          name: month,
          value: Math.round(monthMap[month]),
          orderCount: monthOrderMap[month],
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
    if (timePeriod === "24hours") return 250; // 5 weekdays
    if (timePeriod === "weeks") return 250; // 5 weekdays
    if (timePeriod === "months") return 350; // variable weekday count
    if (timePeriod === "years") return 250; // 12 months
    return 250;
  };

  if (!mounted) return null;

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="w-full"
        style={{ height: `${getChartHeight()}px`, minWidth: 0 }}>
        <ResponsiveContainer width="100%" height="100%" debounceEnd={100}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              fontSize={isMobile ? 10 : 12}
              stroke="#9ca3af"
              angle={timePeriod === "months" ? -45 : 0}
              textAnchor={timePeriod === "months" ? "end" : "middle"}
              height={timePeriod === "months" ? 60 : 30}
            />
            <YAxis
              stroke="#9ca3af"
              fontSize={isMobile ? 10 : 12}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              formatter={(value) => [`EGP ${value.toFixed(2)}`, "Revenue"]}
              labelFormatter={(label, payload) => {
                if (!payload || !payload.length) return label;
                return `${payload[0].payload.orderCount} orders`;
              }}
            />
            <Bar dataKey="value" fill={THEME_COLOR} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-between mt-2 sm:mt-3 md:mt-4 text-xs sm:text-xs md:text-sm text-gray-600 gap-2">
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
          <div
            className="w-1.5 sm:w-2 md:w-2.5 h-1.5 sm:h-2 md:h-2.5 rounded-full"
            style={{ backgroundColor: THEME_COLOR }}></div>
          <span>
            {timePeriod === "24hours"
              ? "Current Week (Mon-Fri)"
              : timePeriod === "weeks"
                ? "Last Week (Mon-Fri)"
                : timePeriod === "months"
                  ? "Current Month (Weekdays)"
                  : "Current Year (Months)"}
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

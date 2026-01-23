import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card } from "../../components/ui/card";
import RevenueChart from "../../components/admin/revenue-chart";
import OrderTimeChart from "../../components/admin/order-time-chart";
import FoodList from "../../components/admin/food-list";
import OrderChart from "../../components/admin/order-chart";
import { MdOutlineInsertChartOutlined } from "react-icons/md";
import DashboardHeader from "../../layouts/navbar/admin/DashboardHeader";
import { getStats, readToken } from "../../lib/apis";
import { toast } from "react-hot-toast";

const DashboardAdmin = () => {
  const [activeTab, setActiveTab] = useState("24hours");
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Map tab values to API response keys
  const tabToStatsKey = {
    "24hours": "current_week",
    weeks: "last_week",
    months: "last_month",
    years: "current_year",
  };

  // Update tab labels based on API response
  const tabLabels = {
    "24hours": "Current Week",
    weeks: "Last Week",
    months: "Last Month",
    years: "Current Year",
  };

  // Fetch stats on mount and when tab changes
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = readToken();
        if (!token) {
          toast.error("No auth token found");
          setLoading(false);
          return;
        }

        const stats = await getStats(token);
        if (stats && stats.error) {
          toast.error(stats.error);
          setLoading(false);
          return;
        }

        setStatsData(stats);
      } catch (err) {
        console.error("Error fetching stats:", err);
        toast.error("Failed to fetch dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Get current period data based on active tab
  const getCurrentPeriodData = () => {
    if (!statsData) return null;
    const key = tabToStatsKey[activeTab];
    return statsData[key] || null;
  };

  const currentData = getCurrentPeriodData();

  // Format food items for display
  const formatFoodList = (items) => {
    if (!items) return [];
    return items.map((item) => ({
      name: item.item_name,
      orders: Number(item.total_quantity) || 0,
      weight_grams:
        item.weight_grams !== null && item.weight_grams !== undefined
          ? Number(item.weight_grams)
          : null,
      icon: "🍽️",
    }));
  };

  // Get formatted data based on active tab
  const mostOrderedItems = currentData
    ? formatFoodList(currentData.most_ordered_items)
    : [];
  const leastOrderedItems = currentData
    ? formatFoodList(currentData.least_ordered_items)
    : [];

  return (
    <div className="bg-mid-grey shadow-lg/30 min-h-screen w-full rounded-md">
      {/* Header */}
      <DashboardHeader
        title="Dashboard"
        dist="/"
        icon={
          <MdOutlineInsertChartOutlined className="w-8 h-8 text-[#02356A]" />
        }
      />

      {/* Time Period Tabs */}
      <div className="mx-2.5 md:mx-6  border-b border-dark-grey overflow-x-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-max">
          <TabsList className="bg-transparent gap-3 md:gap-4 ">
            <TabsTrigger
              value="24hours"
              className="bg-transparent text-dark-grey data-[state=active]:text-primary-navy rounded-none px-0 font-base text-xs sm:text-sm md:text-base whitespace-nowrap">
              Current Week
            </TabsTrigger>
            <TabsTrigger
              value="weeks"
              className="bg-transparent text-dark-grey data-[state=active]:text-primary-navy rounded-none px-0 font-base text-xs sm:text-sm md:text-base whitespace-nowrap">
              Last Weeks
            </TabsTrigger>
            <TabsTrigger
              value="months"
              className="bg-transparent text-dark-grey data-[state=active]:text-primary-navy rounded-none px-0 font-base text-xs sm:text-sm md:text-base whitespace-nowrap">
              Last Months
            </TabsTrigger>
            <TabsTrigger
              value="years"
              className="bg-transparent text-dark-grey data-[state=active]:text-primary-navy rounded-none px-0 font-base text-xs sm:text-sm md:text-base whitespace-nowrap">
              Current Year
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
        {loading ? (
          <div className="flex items-center justify-center h-48 sm:h-64 md:h-96">
            <p className="text-gray-600 text-sm sm:text-base">
              Loading dashboard data...
            </p>
          </div>
        ) : (
          <>
            {/* Revenue and Order Time Row */}
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 md:gap-6 ">
              {/* Revenue Card */}
              <Card className="bg-light-grey rounded-none p-3 sm:p-4 md:p-6 flex w-full lg:w-1/2 min-w-0">
                <div className="flex justify-between items-start mb-3 sm:mb-4 md:mb-4">
                  <div>
                    <p className="text-dark-grey text-xs sm:text-sm mb-1 sm:mb-2">
                      Revenue
                    </p>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-dark">
                      EGP{" "}
                      {typeof currentData?.total_revenue === "object"
                        ? currentData?.total_revenue?.total || "0.00"
                        : currentData?.total_revenue || "0.00"}
                    </h2>

                    <p className="text-dark-grey text-xs mt-1 sm:mt-2">
                      {activeTab === "24hours"
                        ? "Current week"
                        : activeTab === "weeks"
                        ? "Last week"
                        : activeTab === "months"
                        ? "Last month"
                        : "Current year"}
                    </p>
                  </div>
                </div>
                <RevenueChart timePeriod={activeTab} data={currentData} />
              </Card>

              {/* Order Time Card */}
              <Card className="bg-light-grey rounded-none p-3 w-full lg:w-1/2 sm:p-4 md:p-6 ">
                <div className="flex justify-between items-start mb-4 sm:mb-5 md:mb-6">
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm mb-0.5 sm:mb-1">
                      Order Time
                    </p>
                    <p className="text-gray-500 text-xs">
                      Most common:{" "}
                      <span className="font-semibold">
                        {(() => {
                          const dist = currentData?.time_range_distribution;
                          if (!dist) return "N/A";

                          const timeRanges = [
                            {
                              name: "Morning",
                              value: parseFloat(dist.morning?.percentage) || 0,
                            },
                            {
                              name: "Afternoon",
                              value:
                                parseFloat(dist.afternoon?.percentage) || 0,
                            },
                            {
                              name: "Evening",
                              value: parseFloat(dist.evening?.percentage) || 0,
                            },
                          ];

                          const mostCommon = timeRanges.reduce((max, curr) =>
                            curr.value > max.value ? curr : max
                          );

                          return `${
                            mostCommon.name
                          } (${mostCommon.value.toFixed(2)}%)`;
                        })()}
                      </span>
                    </p>
                  </div>
                </div>
                <OrderTimeChart timePeriod={activeTab} data={currentData} />
              </Card>
            </div>

            {/* Most and Least Ordered Food Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <Card className="bg-light-grey rounded-none p-3 sm:p-4 md:p-6">
                <span className="text-text-dark text-base sm:text-lg md:text-xl font-bold block">
                  Most Ordered Food
                </span>
                <p className="text-dark-grey text-xs">
                  Top {mostOrderedItems.length} items by order quantity
                </p>
                <FoodList items={mostOrderedItems} />
              </Card>

              <Card className="bg-light-grey rounded-none p-3 sm:p-4 md:p-6">
                <span className="text-text-dark text-base sm:text-lg md:text-xl font-bold block">
                  Least Ordered Food
                </span>
                <p className="text-dark-grey text-xs">
                  Bottom {leastOrderedItems.length} items by order quantity
                </p>
                <FoodList items={leastOrderedItems} />
              </Card>
            </div>

            {/* Order Chart Row */}
            {/* <Card className="bg-[#E2E2E2] rounded-none p-3 sm:p-4 md:p-6">
              <div className="flex justify-between items-start mb-4 sm:mb-5 md:mb-6">
                <div>
                  <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">
                    Total Orders
                  </p>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                    {currentData?.total_orders || 0}
                  </h2>

                  <p className="text-gray-500 text-xs mt-1 sm:mt-2">
                    {activeTab === "24hours"
                      ? "Orders from last 24 hours"
                      : activeTab === "weeks"
                      ? "Orders from last week"
                      : activeTab === "months"
                      ? "Orders from last month"
                      : "Orders from last year"}
                  </p>
                </div>
              </div>
              <OrderChart timePeriod={activeTab} data={currentData} />
            </Card> */}
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardAdmin;

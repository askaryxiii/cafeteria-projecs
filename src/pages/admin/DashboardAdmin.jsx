import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import RevenueChart from "../../components/admin/revenue-chart";
import OrderTimeChart from "../../components/admin/order-time-chart";
import FoodList from "../../components/admin/food-list";
import OrderChart from "../../components/admin/order-chart";
import { ImHome } from "react-icons/im";
import { MdOutlineInsertChartOutlined } from "react-icons/md";
import DashboardHeader from "../../layouts/navbar/admin/DashboardHeader";
import { getStats, readToken } from "../../lib/apis";
import { toast } from "react-hot-toast";

const DashboardAdmin = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("24hours");
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Map tab values to API response keys
  const tabToStatsKey = {
    "24hours": "last_24_hours",
    weeks: "last_week",
    months: "last_month",
    years: "last_year",
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
      orders: parseInt(item.total_quantity),
      icon: "�️",
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
    <div className="bg-[#E2E2E2] min-h-screen w-full">
      {/* Header */}
      <DashboardHeader
        title="Dashboard"
        dist="/"
        icon={
          <MdOutlineInsertChartOutlined className="w-8 h-8 text-[#02356A]" />
        }
      />

      {/* Time Period Tabs */}
      <div className=" px-6 py-4 border-b border-gray-400">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-max">
          <TabsList className="bg-transparent p-0 gap-8 h-auto">
            <TabsTrigger
              value="24hours"
              className="bg-transparent text-[#8A919A] data-[state=active]:text-[#011844B2]  rounded-none px-0 py-2 font-base">
              Last 24 hours
            </TabsTrigger>
            <TabsTrigger
              value="weeks"
              className="bg-transparent text-[#8A919A] data-[state=active]:text-[#011844B2]  rounded-none px-0 py-2 font-base">
              Last Weeks
            </TabsTrigger>
            <TabsTrigger
              value="months"
              className="bg-transparent text-[#8A919A] data-[state=active]:text-[#011844B2]  rounded-none px-0 py-2 font-base">
              Last Months
            </TabsTrigger>
            <TabsTrigger
              value="years"
              className="bg-transparent text-[#8A919A] data-[state=active]:text-[#011844B2]  rounded-none px-0 py-2 font-base">
              Last Years
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        ) : (
          <>
            {/* Revenue and Order Time Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue Card */}
              <Card className="bg-[#E2E2E2] rounded-none p-6 col-span-1 lg:col-span-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-600 text-sm mb-2">Revenue</p>
                    <h2 className="text-3xl font-bold text-gray-900">
                      EGP {currentData?.total_revenue || "0.00"}
                    </h2>

                    <p className="text-gray-500 text-xs mt-2">
                      {activeTab === "24hours"
                        ? "Last 24 hours"
                        : activeTab === "weeks"
                        ? "Last week"
                        : activeTab === "months"
                        ? "Last month"
                        : "Last year"}
                    </p>
                  </div>
                </div>
                <RevenueChart
                  timePeriod={activeTab}
                  revenue={currentData?.total_revenue}
                />
              </Card>

              {/* Order Time Card */}
              <Card className="bg-[#E2E2E2] rounded-none p-6 col-span-1 lg:col-span-2">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Order Time</p>
                    <p className="text-gray-500 text-xs">
                      Most common:{" "}
                      <span className="font-semibold">
                        {currentData?.most_common_time_range?.time_range ||
                          "N/A"}
                      </span>{" "}
                      ({currentData?.most_common_time_range?.count || 0} orders)
                    </p>
                  </div>
                </div>
                <OrderTimeChart timePeriod={activeTab} data={currentData} />
              </Card>
            </div>

            {/* Most and Least Ordered Food Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[#E2E2E2] rounded-none p-6">
                <span className="text-gray-900 text-xl font-bold ">
                  Most Ordered Food
                </span>
                <p className="text-gray-500 text-xs ">
                  Top {mostOrderedItems.length} items by order quantity
                </p>
                <FoodList items={mostOrderedItems} />
              </Card>

              <Card className="bg-[#E2E2E2] rounded-none p-6">
                <span className="text-gray-900 text-xl font-bold">
                  Least Ordered Food
                </span>
                <p className="text-gray-500 text-xs ">
                  Bottom {leastOrderedItems.length} items by order quantity
                </p>
                <FoodList items={leastOrderedItems} />
              </Card>
            </div>

            {/* Order Chart Row */}
            <Card className="bg-[#E2E2E2] rounded-none p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-gray-600 text-sm mb-2">Total Orders</p>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {currentData?.total_orders || 0}
                  </h2>

                  <p className="text-gray-500 text-xs mt-2">
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
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardAdmin;

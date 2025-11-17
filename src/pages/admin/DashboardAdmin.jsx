import React, { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import RevenueChart from "../../components/admin/revenue-chart";
import OrderTimeChart from "../../components/admin/order-time-chart";
import FoodList from "../../components/admin/food-list";
import OrderChart from "../../components/admin/order-chart";
import { ImHome } from "react-icons/im";
import { MdOutlineInsertChartOutlined } from "react-icons/md";

const DashboardAdmin = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("24hours");

  const foodItems = [
    { name: "Fresh Salad Bowl", orders: 100, icon: "🥗" },
    { name: "Chicken Noodles", orders: 75, icon: "🍜" },
    { name: "Smoothie Fruits", orders: 73, icon: "🥤" },
    { name: "Hot Chicken Wings", orders: 60, icon: "🍗" },
  ];

  const leastOrderedItems = [
    { name: "Fresh Salad Bowl", orders: 10, icon: "🥗" },
    { name: "Chicken Noodles", orders: 5, icon: "🍜" },
    { name: "Smoothie Fruits", orders: 3, icon: "🥤" },
    { name: "Hot Chicken Wings", orders: 1, icon: "🍗" },
  ];
  return (
    <div className="bg-[#E2E2E2] min-h-screen w-full">
      {/* Header */}
      <div className=" px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <MdOutlineInsertChartOutlined className="w-9 h-9 p-0.5 text-[#02356A] " />
          <h1 className="text-2xl font-semibold text-[#02356A]">Dashboard</h1>
        </div>
        <ImHome className="w-7 h-7 p-0.5 text-[#02356A] " />
      </div>

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
        {/* Revenue and Order Time Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Card */}
          <Card className="bg-white p-6 col-span-1 lg:col-span-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-600 text-sm mb-2">Revenue</p>
                <h2 className="text-3xl font-bold text-gray-900">
                  EGP 7,852.00
                </h2>
                <p className="text-green-600 text-sm mt-2">
                  ↑ 2.1% vs last Month
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Sales from 1-12 Dec, 2020
                </p>
              </div>
            </div>
            <div className="mb-4">
              <Button variant="outline" className="text-blue-600">
                View Report
              </Button>
            </div>
            <RevenueChart timePeriod={activeTab} />
          </Card>

          {/* Order Time Card */}
          <Card className="bg-white p-6 col-span-1 lg:col-span-2">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-gray-600 text-sm mb-1">Order Time</p>
                <p className="text-gray-500 text-xs">From 21-20 Dec, 2025</p>
              </div>
              <Button variant="outline" className="text-blue-600">
                View Report
              </Button>
            </div>
            <OrderTimeChart />
          </Card>
        </div>

        {/* Most and Least Ordered Food Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white p-6">
            <h3 className="text-gray-900 font-bold mb-2">Most Ordered Food</h3>
            <p className="text-gray-500 text-xs mb-6">
              Adipiscing elit, sed do eiusmod tempor
            </p>
            <FoodList items={foodItems} />
          </Card>

          <Card className="bg-white p-6">
            <h3 className="text-gray-900 font-bold mb-2">Least Ordered Food</h3>
            <p className="text-gray-500 text-xs mb-6">
              Adipiscing elit, sed do eiusmod tempor
            </p>
            <FoodList items={leastOrderedItems} />
          </Card>
        </div>

        {/* Order Chart Row */}
        <Card className="bg-white p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-gray-600 text-sm mb-2">Order</p>
              <h2 className="text-3xl font-bold text-gray-900">2,568</h2>
              <p className="text-red-600 text-sm mt-2">↓ 2.1% vs last week</p>
              <p className="text-gray-500 text-xs mt-2">
                Orders from 1-6 Dec, 2025
              </p>
            </div>
            <Button variant="outline" className="text-blue-600">
              View Report
            </Button>
          </div>
          <OrderChart />
        </Card>
      </div>
    </div>
  );
};

export default DashboardAdmin;

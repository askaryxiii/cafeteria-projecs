import React from "react";
import { OrdersTable } from "../../components/chef/orders-table";
import DashboardHeader from "../../layouts/navbar/admin/DashboardHeader";
import { PiChefHatBold } from "react-icons/pi";

const ChefDashboard = () => {
  return (
    <main className="">
      <DashboardHeader
        title="Chef"
        dist="/"
        icon={<PiChefHatBold className="w-8 h-8 text-[#02356A]" />}
      />
      <OrdersTable />
    </main>
  );
};

export default ChefDashboard;

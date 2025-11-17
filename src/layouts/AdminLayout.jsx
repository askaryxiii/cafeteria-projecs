import React, { useState } from "react";
import AdminLogoNav from "./navbar/admin/AdminLogoNav";
import { Sidebar } from "./navbar/admin/Sidebar";
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import UsersDashboard from "../pages/admin/UsersDashboard";
import ChefDashboard from "../pages/admin/ChefDashboard";
import CafeteriaDashboard from "../pages/admin/CafeteriaDashboard";
import AccountsDashboard from "../pages/admin/AccountsDashboard";
import MenuDashboard from "../pages/admin/MenuDashboard";
import Settings from "../pages/admin/Settings";

const AdminLayout = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState("dashboard");

  // Map menu item IDs to their corresponding components
  const menuComponentMap = {
    dashboard: <DashboardAdmin />,
    users: <UsersDashboard />,
    chef: <ChefDashboard />,
    cafeteria: <CafeteriaDashboard />,
    accounts: <AccountsDashboard />,
    menu: <MenuDashboard />,
    settings: <Settings />,
  };

  const handleSelectMenu = (menuId) => {
    setSelectedMenuItem(menuId);
  };

  return (
    <div className="grid grid-cols-6 min-h-screen">
      {/* Logo Navigation (top bar) */}
      <div className="col-span-6">
        <AdminLogoNav />
      </div>

      {/* Sidebar */}
      <Sidebar
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        onSelectMenu={handleSelectMenu}
        selectedMenuItem={selectedMenuItem}
      />

      {/* Main Content */}
      <main
        className={
          isExpanded ? "col-span-5" : "col-span-5 transition-all duration-300"
        }>
        {menuComponentMap[selectedMenuItem]}
      </main>
    </div>
  );
};

export default AdminLayout;

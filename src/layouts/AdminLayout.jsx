import React, { useState, useEffect } from "react";
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedMenuItem, setSelectedMenuItem] = useState(() => {
    try {
      const saved = localStorage.getItem("adminSelectedMenu");
      return saved || "dashboard";
    } catch (e) {
      return "dashboard";
    }
  });

  useEffect(() => {
    const handleResize = () => {
      const nowMobile = window.innerWidth < 768;
      setIsMobile(nowMobile);
      if (window.innerWidth >= 768) {
        setIsExpanded(true);
      } else {
        setIsExpanded(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // Save selected menu item to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("adminSelectedMenu", selectedMenuItem);
    } catch (e) {
      console.error("Failed to save menu selection:", e);
    }
  }, [selectedMenuItem]);

  const handleSelectMenu = (menuId) => {
    setSelectedMenuItem(menuId);
    if (isMobile) {
      setIsExpanded(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 min-h-screen bg-[#E2E2E2]">
      {/* Logo Navigation (top bar) */}
      <div className="col-span-1 md:col-span-6">
        <AdminLogoNav />
      </div>

      {/* Sidebar - responsive */}
      {(isExpanded || !isMobile) && (
        <div className="col-span-1 fixed md:static bottom-0 left-0 right-0 md:bottom-auto md:left-auto md:right-auto z-40 md:z-auto h-auto md:h-auto">
          <Sidebar
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
            onSelectMenu={handleSelectMenu}
            selectedMenuItem={selectedMenuItem}
            isMobile={isMobile}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="col-span-1 md:col-span-5 overflow-y-auto p-2 sm:p-3 md:p-4 lg:p-6">
        <div className="w-full">
          {children || menuComponentMap[selectedMenuItem]}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobile && isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;

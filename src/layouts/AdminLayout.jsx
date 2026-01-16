import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { FaUserGroup } from "react-icons/fa6";
import { PiChefHatBold, PiForkKnifeFill, PiBankFill } from "react-icons/pi";
import { MdOutlineRateReview } from "react-icons/md";
import { TbMenu3 } from "react-icons/tb";
import { MdSettings, MdDashboard } from "react-icons/md";
import AdminLogoNav from "./navbar/admin/AdminLogoNav";
import { Sidebar } from "./navbar/admin/Sidebar";
import { MobileMenuDrawer } from "./navbar/admin/MobileMenuDrawer";
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import UsersDashboard from "../pages/admin/UsersDashboard";
import ChefDashboard from "../pages/admin/ChefDashboard";
import CafeteriaDashboard from "../pages/admin/CafeteriaDashboard";
import AccountsDashboard from "../pages/admin/AccountsDashboard";
import MenuDashboard from "../pages/admin/MenuDashboard";
import Settings from "../pages/admin/settings/Settings";
import FeedbackDashboard from "../pages/admin/FeedbackDashboard";

const AdminLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();

  // Get the current active menu item from the URL path
  const getActiveMenuItem = () => {
    const path = location.pathname;
    const match = path.match(/\/admin\/([a-z-]+)/);
    return match ? match[1] : "dashboard";
  };

  const activeMenuItem = getActiveMenuItem();

  useEffect(() => {
    const handleResize = () => {
      const nowMobile = window.innerWidth < 768;
      setIsMobile(nowMobile);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Menu items for sidebar
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: MdDashboard,
      path: "/admin/dashboard",
    },
    { id: "users", label: "Users", icon: FaUserGroup, path: "/admin/users" },
    { id: "chef", label: "Chef", icon: PiChefHatBold, path: "/admin/chef" },
    {
      id: "cafeteria",
      label: "Cafeteria",
      icon: PiForkKnifeFill,
      path: "/admin/cafeteria",
    },
    {
      id: "accounts",
      label: "Accounts",
      icon: PiBankFill,
      path: "/admin/accounts",
    },
    { id: "menu", label: "Menu Items", icon: TbMenu3, path: "/admin/menu" },
    {
      id: "feedback",
      label: "Feedback",
      icon: MdOutlineRateReview,
      path: "/admin/feedback",
    },
    {
      id: "settings",
      label: "Settings",
      icon: MdSettings,
      path: "/admin/settings",
    },
  ];

  return (
    <div className="bg-[#E2E2E2]">
      {/* Logo Navigation (top bar) */}
      <div>
        <AdminLogoNav
          isMobile={isMobile}
          onMenuToggle={() => setIsDrawerOpen(!isDrawerOpen)}
        />
      </div>

      {/* Mobile Menu Drawer */}
      <MobileMenuDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedMenuItem={activeMenuItem}
        menuItems={menuItems}
      />

      <div className="flex min-h-screen">
        {/* Sidebar - always visible, fixed width */}
        {!isMobile && (
          <Sidebar
            selectedMenuItem={activeMenuItem}
            isMobile={isMobile}
            menuItems={menuItems}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-0 lg:p-6">
          <Routes>
            <Route path="/dashboard" element={<DashboardAdmin />} />
            <Route path="/users" element={<UsersDashboard />} />
            <Route path="/chef" element={<ChefDashboard />} />
            <Route path="/cafeteria" element={<CafeteriaDashboard />} />
            <Route path="/accounts" element={<AccountsDashboard />} />
            <Route path="/menu" element={<MenuDashboard />} />
            <Route path="/feedback" element={<FeedbackDashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route
              path="/"
              element={<Navigate to="/admin/dashboard" replace />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

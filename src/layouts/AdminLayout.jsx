import React, { useState, useEffect, useContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { FaUserGroup } from "react-icons/fa6";
import { PiChefHatBold, PiForkKnifeFill, PiBankFill } from "react-icons/pi";
import { MdOutlineRateReview } from "react-icons/md";
import { TbMenu3 } from "react-icons/tb";
import { MdSettings, MdDashboard } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";
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
  const { user } = useContext(AuthContext);

  // Get user role
  const userRole = user?.user?.role || user?.role || "employee";

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

  // All menu items
  const allMenuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: MdDashboard,
      path: "/admin/dashboard",
      allowedRoles: ["admin", "accountant"],
    },
    {
      id: "users",
      label: "Users",
      icon: FaUserGroup,
      path: "/admin/users",
      allowedRoles: ["admin"],
    },
    {
      id: "chef",
      label: "Chef",
      icon: PiChefHatBold,
      path: "/admin/chef",
      allowedRoles: ["admin"],
    },
    {
      id: "cafeteria",
      label: "Cafeteria",
      icon: PiForkKnifeFill,
      path: "/admin/cafeteria",
      allowedRoles: ["admin"],
    },
    {
      id: "accounts",
      label: "Accounts",
      icon: PiBankFill,
      path: "/admin/accounts",
      allowedRoles: ["admin", "accountant"],
    },
    {
      id: "menu",
      label: "Menu Items",
      icon: TbMenu3,
      path: "/admin/menu",
      allowedRoles: ["admin", "accountant"],
    },
    {
      id: "feedback",
      label: "Feedback",
      icon: MdOutlineRateReview,
      path: "/admin/feedback",
      allowedRoles: ["admin"],
    },
    {
      id: "settings",
      label: "Settings",
      icon: MdSettings,
      path: "/admin/settings",
      allowedRoles: ["admin", "accountant"],
    },
  ];

  // Filter menu items based on user role
  const menuItems = allMenuItems.filter((item) =>
    item.allowedRoles.includes(userRole),
  );

  // Helper function to check if user can access a route
  const canAccessRoute = (routeId) => {
    const route = allMenuItems.find((item) => item.id === routeId);
    return route && route.allowedRoles.includes(userRole);
  };

  // Route permission map
  const routePermissions = {
    dashboard: ["admin", "accountant"],
    users: ["admin"],
    chef: ["admin"],
    cafeteria: ["admin"],
    accounts: ["admin"],
    menu: ["admin", "accountant"],
    feedback: ["admin"],
    settings: ["admin", "accountant"],
  };

  return (
    <div className="bg-burned-grey">
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
        <main className="flex-1 overflow-y-auto p-0 lg:p-6 rounded-md">
          <Routes>
            <Route
              path="/dashboard"
              element={
                canAccessRoute("dashboard") ? (
                  <DashboardAdmin />
                ) : (
                  <Navigate to="/admin/dashboard" replace />
                )
              }
            />
            <Route
              path="/users"
              element={
                canAccessRoute("users") ? (
                  <UsersDashboard />
                ) : (
                  <Navigate to="/admin/dashboard" replace />
                )
              }
            />
            <Route
              path="/chef"
              element={
                canAccessRoute("chef") ? (
                  <ChefDashboard />
                ) : (
                  <Navigate to="/admin/dashboard" replace />
                )
              }
            />
            <Route
              path="/cafeteria"
              element={
                canAccessRoute("cafeteria") ? (
                  <CafeteriaDashboard />
                ) : (
                  <Navigate to="/admin/dashboard" replace />
                )
              }
            />
            <Route
              path="/accounts"
              element={
                canAccessRoute("accounts") ? (
                  <AccountsDashboard />
                ) : (
                  <Navigate to="/admin/dashboard" replace />
                )
              }
            />
            <Route
              path="/menu"
              element={
                canAccessRoute("menu") ? (
                  <MenuDashboard />
                ) : (
                  <Navigate to="/admin/dashboard" replace />
                )
              }
            />
            <Route
              path="/feedback"
              element={
                canAccessRoute("feedback") ? (
                  <FeedbackDashboard />
                ) : (
                  <Navigate to="/admin/dashboard" replace />
                )
              }
            />
            <Route
              path="/settings"
              element={
                canAccessRoute("settings") ? (
                  <Settings />
                ) : (
                  <Navigate to="/admin/dashboard" replace />
                )
              }
            />
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

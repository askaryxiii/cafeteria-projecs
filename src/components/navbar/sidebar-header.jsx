import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { FaUserGroup } from "react-icons/fa6";
import { MdArrowDropDown } from "react-icons/md";

export function SidebarHeader() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
  };

  const handleAdminPanel = () => {
    navigate("/admin/dashboard");
    setIsDropdownOpen(false);
  };

  const handleUserPanel = () => {
    navigate("/user");
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-full flex items-center gap-1.5 p-3 transition rounded-none">
        <div className="flex items-center gap-1.5 border-b border-dark-grey/50">
          <div className="w-8 h-8 rounded-full  flex items-center justify-center shrink-0">
            <FaUserGroup size={18} className="text-gray-600" />
          </div>
          <span className="block md:hidden lg:block font-semibold text-gray-800 truncate text-base">
            {user.user.name}
          </span>
        </div>
        <MdArrowDropDown
          className={`block md:hidden lg:block text-gray-600 transition-transform ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 bg-white  shadow-lg rounded-lg z-50">
          <button
            onClick={handleAdminPanel}
            className="w-full text-left px-4 py-3 text-sm font-medium text-gray-800 transition">
            Admin Panel
          </button>
          <button
            onClick={handleUserPanel}
            className="w-full text-left px-4 py-3 text-sm font-medium text-gray-800 border-t border-gray-200 transition">
            User Panel
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 text-sm font-medium text-gray-800 border-t border-gray-200 transition">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

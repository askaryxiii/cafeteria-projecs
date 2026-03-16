import { FaPizzaSlice } from "react-icons/fa";
import { FaUnlock } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { MdAdminPanelSettings, MdOutlineRateReview } from "react-icons/md";
import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

const MobileUserMenu = ({ onClose }) => {
  const { logout, user } = useContext(AuthContext);
  const isAdmin = user?.user?.role === "admin";

  return (
    <div className="flex flex-col gap-1">
      {/* My Orders */}
      <Link
        to="/user/orders"
        onClick={onClose}
        className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded transition text-primary-navy font-medium">
        <FaPizzaSlice className="" /> My Orders
      </Link>

      {/* Update Profile / Change Password */}
      <Link
        to="/user/change-password"
        onClick={onClose}
        className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded transition text-primary-navy font-medium">
        <FaUnlock className="" /> Change Password
      </Link>
      <Link
        to="/user/feedback"
        onClick={onClose}
        className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded transition text-primary-navy font-medium">
        <MdOutlineRateReview className="" /> Feedback
      </Link>

      {isAdmin && (
        <Link
          to="/admin/dashboard"
          onClick={onClose}
          className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded transition text-primary-navy font-medium">
          <MdAdminPanelSettings className="w-5 h-5" /> Admin Panel
        </Link>
      )}

      <div className="border-t my-1" />

      {/* Logout */}
      <button
        onClick={() => {
          logout();
          onClose();
        }}
        className="flex items-center gap-2 px-2 text-left rounded hover:bg-gray-200 transition text-primary-navy font-medium">
        <FaSignOutAlt className="" /> Logout
      </button>
    </div>
  );
};

export default MobileUserMenu;

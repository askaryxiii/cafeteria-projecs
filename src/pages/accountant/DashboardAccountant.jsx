import React, { useContext } from "react";
import AuthContext from "../../context/AuthContext";

const DashboardAccountant = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <div className="p-6">
      <h2>Accountant Dashboard</h2>
      <div>Welcome {user.user?.name || user.name || user.email}</div>
      <button
        onClick={logout}
        className="mt-4 bg-gray-700 text-white px-3 py-1">
        Logout
      </button>
    </div>
  );
};

export default DashboardAccountant;

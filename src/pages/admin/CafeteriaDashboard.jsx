import React, { useState } from "react";
import { MealTable } from "../../components/cafeteria/meal-table";
import { deleteOrder } from "../../lib/apis";

import DashboardHeader from "../../layouts/navbar/admin/DashboardHeader";
import { PiForkKnifeFill } from "react-icons/pi";

const CafeteriaDashboard = () => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteOrder = async (orderId) => {
    if (!orderId) return;

    // Optional: Add a confirmation dialog here
    if (!window.confirm("Are you sure you want to delete this order?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteOrder(orderId);
      if (result.error) {
        console.error("Error deleting order:", result.error);
        alert("Failed to delete order: " + result.error);
      } else {
        console.log("Order deleted successfully");
        // Optionally refresh the table here
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="">
      <DashboardHeader
        title="Cafeteria"
        dist="/"
        icon={<PiForkKnifeFill className="w-8 h-8 text-[#02356A]" />}
      />
      <MealTable
        fetchTomorrow={true}
        showDelete={true}
        onDelete={handleDeleteOrder}
      />
    </div>
  );
};

export default CafeteriaDashboard;

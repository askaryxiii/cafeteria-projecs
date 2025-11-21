import React, { useState } from "react";
import { MealTable } from "../../components/cafeteria/meal-table";
import { deleteOrder } from "../../lib/apis";
import DeleteConfirmModal from "../../components/admin/users/delete-confirm-modal";

import DashboardHeader from "../../layouts/navbar/admin/DashboardHeader";
import { PiForkKnifeFill } from "react-icons/pi";
import toast from "react-hot-toast";

const CafeteriaDashboard = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDeleteOrder = (orderId) => {
    if (!orderId) return;
    setDeletingOrderId(orderId);
  };

  const handleConfirmDelete = async () => {
    if (!deletingOrderId) return;

    setIsDeleting(true);
    try {
      const result = await deleteOrder(deletingOrderId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Order deleted successfully");
        // Trigger refresh of the table
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
      setDeletingOrderId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeletingOrderId(null);
  };

  return (
    <div className="">
      <DashboardHeader
        title="Cafeteria"
        dist="/"
        icon={
          <PiForkKnifeFill className="w-7 sm:w-8 md:w-8 h-7 sm:h-8 md:h-8 text-[#02356A]" />
        }
      />
      <MealTable
        fetchTomorrow={true}
        showDelete={true}
        onDelete={handleDeleteOrder}
        refreshTrigger={refreshTrigger}
      />
      {deletingOrderId && (
        <DeleteConfirmModal
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default CafeteriaDashboard;

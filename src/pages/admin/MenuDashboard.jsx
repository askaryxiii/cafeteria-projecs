import React, { useState, useEffect } from "react";
import ItemsTable from "../../components/admin/menu/items-table";
import DashboardHeader from "../../layouts/navbar/admin/DashboardHeader";
import { TbMenu3 } from "react-icons/tb";
import { getAllMenuItems, editMenuItem, deleteMenuItem } from "../../lib/apis";
import toast from "react-hot-toast";

const MenuDashboard = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch menu items on component mount
  useEffect(() => {
    const loadItems = async () => {
      setIsLoading(true);
      const result = await getAllMenuItems();
      if (result.error) {
        toast.error(result.error);
        setItems([]);
      } else {
        setItems(Array.isArray(result) ? result : []);
      }
      setIsLoading(false);
    };
    loadItems();
  }, []);

  // Edit function using editMenuItem API
  const updateItem = async (id, updatedData) => {
    try {
      const result = await editMenuItem(id, updatedData);
      if (result.error) {
        toast.error(result.error);
        return { error: result.error };
      }
      // Refresh the items list after successful edit
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, ...updatedData } : item
        )
      );
      toast.success("Item updated successfully");
      return { success: true };
    } catch (err) {
      toast.error("Failed to update item");
      return { error: err.message };
    }
  };

  // Delete function using deleteMenuItem API
  const deleteItem = async (id) => {
    try {
      const result = await deleteMenuItem(id);
      if (result.error) {
        toast.error(result.error);
        return { error: result.error };
      }
      // Remove item from list after successful delete
      setItems(items.filter((item) => item.id !== id));
      toast.success("Item deleted successfully");
      return { success: true };
    } catch (err) {
      toast.error("Failed to delete item");
      return { error: err.message };
    }
  };

  // Create function (placeholder for now)
  const createItem = async (newData) => {
    // TODO: Implement createMenuItem API call when endpoint is available
    const newItem = { id: Date.now(), ...newData };
    setItems([...items, newItem]);
    toast.success("Item created successfully");
    return newItem;
  };

  return (
    <main className=" p-1.5">
      <DashboardHeader
        title={"Menu Items"}
        icon={<TbMenu3 className="w-7 h-7 text-[#02356A]" />}
        dist="/"
      />
      <ItemsTable
        items={items}
        onUpdate={updateItem}
        onDelete={deleteItem}
        onCreate={createItem}
      />
    </main>
  );
};

export default MenuDashboard;

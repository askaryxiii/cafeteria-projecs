import React, { useState, useEffect } from "react";
import ItemsTable from "../../components/admin/menu/items-table";
import DrinksTable from "../../components/admin/menu/drinks-table";
import DashboardHeader from "../../layouts/navbar/admin/DashboardHeader";
import { Tabs, TabsList, TabsContent } from "../../components/ui/tabs";
import { TbMenu3 } from "react-icons/tb";
import { getAllMenuItems, editMenuItem, deleteMenuItem } from "../../lib/apis";
import toast from "react-hot-toast";
import CustTabList from "../../components/ui/tabs/Tabs_list";

const API_URL = import.meta.env.VITE_API_BASE;

function readToken() {
  try {
    return (
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken") ||
      null
    );
  } catch (e) {
    return null;
  }
}

const MenuDashboard = () => {
  const [items, setItems] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const tabs = [
    {
      title: "Food Items",
      value: "items",
    },
    {
      title: "Drinks",
      value: "drinks",
    },
  ];

  // Fetch menu items and drinks on component mount
  useEffect(() => {
    const loadItems = async () => {
      setIsLoading(true);
      try {
        const token = readToken();
        if (!token) throw new Error("No auth token found");

        // Fetch all menu items
        const response = await fetch(`${API_URL}/menu`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch menu items");

        const data = await response.json();
        // Filter food items - exclude drinks and only include lunch/breakfast types
        const foodItems = data.filter(
          (item) =>
            item.category !== "drink" &&
            item.meal_type &&
            (item.meal_type.toLowerCase() === "lunch" ||
              item.meal_type.toLowerCase() === "breakfast")
        );
        const drinkItems = data.filter(
          (item) => item.meal_type === "drinks" || item.meal_type === "drink"
        );

        setItems(Array.isArray(foodItems) ? foodItems : []);
        setDrinks(Array.isArray(drinkItems) ? drinkItems : []);
      } catch (error) {
        console.error("Error loading items:", error);
        toast.error(error.message || "Failed to load menu items");
        setItems([]);
        setDrinks([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadItems();
  }, []);

  // Create function
  const createItem = async (newData) => {
    console.log(newData);

    try {
      const token = readToken();
      if (!token) throw new Error("No auth token found");

      const response = await fetch(`${API_URL}/menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newData),
      });

      if (!response.ok) throw new Error("Failed to create item");

      const createdItem = await response.json();

      // Add to appropriate list based on category
      if (newData.category === "drink") {
        setDrinks([...drinks, createdItem]);
      } else {
        setItems([...items, createdItem]);
      }

      toast.success("Item created successfully");
      return createdItem;
    } catch (err) {
      toast.error("Failed to create item");
      console.error(err);
      return { error: err.message };
    }
  };

  // Update function
  const updateItem = async (id, updatedData) => {
    try {
      const token = readToken();
      if (!token) throw new Error("No auth token found");

      const response = await fetch(`${API_URL}/menu/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error("Failed to update item");

      const updatedItem = await response.json();

      // Update in appropriate list based on category
      if (updatedData.category === "drink") {
        setDrinks(drinks.map((d) => (d.id === id ? updatedItem : d)));
      } else {
        setItems(items.map((item) => (item.id === id ? updatedItem : item)));
      }

      toast.success("Item updated successfully");
      return { success: true };
    } catch (err) {
      toast.error("Failed to update item");
      console.error(err);
      return { error: err.message };
    }
  };

  // Delete function
  const deleteItem = async (id) => {
    try {
      const token = readToken();
      if (!token) throw new Error("No auth token found");

      const response = await fetch(`${API_URL}/menu/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete item");

      // Remove from both lists (it will only exist in one)
      setItems(items.filter((item) => item.id !== id));
      setDrinks(drinks.filter((d) => d.id !== id));

      toast.success("Item deleted successfully");
      return { success: true };
    } catch (err) {
      toast.error("Failed to delete item");
      console.error(err);
      return { error: err.message };
    }
  };

  return (
    <main className="p-1 sm:p-1.5 md:p-2">
      <DashboardHeader
        title={"Menu Items"}
        icon={
          <TbMenu3 className="w-6 sm:w-7 md:w-7 h-6 sm:h-7 md:h-7 text-[#02356A]" />
        }
        dist="/"
      />
      <Tabs defaultValue="items" className="w-full">
        <TabsList className="bg-transparent p-1 gap-3 w-full md:gap-4 border border-b-[#ACA4A4] border-t-[#ACA4A4] rounded-none ">
          {tabs.map((tab) => (
            <CustTabList tab={tab} />
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent value={tab.value}>
            {tab.value == "items" ? (
              <ItemsTable
                items={items}
                onUpdate={updateItem}
                onDelete={deleteItem}
                onCreate={createItem}
              />
            ) : (
              <DrinksTable
                drinks={drinks}
                onUpdate={updateItem}
                onDelete={deleteItem}
                onCreate={createItem}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </main>
  );
};

export default MenuDashboard;

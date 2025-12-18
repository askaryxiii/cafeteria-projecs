import { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import DropdownButton from "../user/dropdown-button";
import DropdownContent from "../user/dropdown-content";

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

const DrinkDropdown = ({ control }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && items.length === 0) {
      fetchDrinks();
    }
  }, [isOpen, items.length]);

  const fetchDrinks = async () => {
    setLoading(true);
    try {
      const token = readToken();
      if (!token) throw new Error("No auth token found");

      const response = await fetch(`${API_URL}/menu`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch drinks");

      const data = await response.json();
      const drinkItems = data.filter((item) => item.meal_type === "drinks");
      setItems(drinkItems);
    } catch (error) {
      console.error("Error fetching drinks:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Controller
      name="drinks"
      control={control}
      defaultValue={[]}
      render={({ field }) => (
        <div className="space-y-0">
          <DropdownButton
            categoryName="Drinks"
            categoryNameAr="مشروبات"
            isOpen={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          />

          <div
            className={`transition-all duration-600 ease-[cubic-bezier(0.25,0.8,0.25,1)] origin-top overflow-hidden ${
              isOpen
                ? "opacity-100 scale-y-100"
                : "opacity-0 scale-y-95 h-0 -my-2"
            }`}>
            <DropdownContent
              items={items}
              loading={loading}
              selectedIds={field.value}
              onChange={field.onChange}
            />
          </div>
        </div>
      )}
    />
  );
};

export default DrinkDropdown;

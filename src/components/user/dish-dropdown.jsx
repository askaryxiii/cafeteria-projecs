import { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import DropdownButton from "../user/dropdown-button";
import DropdownContent from "../user/dropdown-content";
import { getBreakfast, getTodayMenuByCategory } from "../../lib/apis";

const DishDropdown = ({
  categoryId,
  categoryName,
  categoryNameAr,
  control,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && items.length === 0) {
      fetchItems();
    }
  }, [isOpen, items.length]);

  const fetchItems = async () => {
    setLoading(true);

    if (categoryName.toLowerCase() === "breakfast") {
      const breakfastFetch = await getBreakfast();
      setItems(breakfastFetch);
    } else {
      const fetchedItems = await getTodayMenuByCategory(categoryName);

      setItems(fetchedItems);
    }
    setLoading(false);
  };

  return (
    <Controller
      name={categoryId}
      control={control}
      render={({ field }) => (
        <div className="space-y-0">
          <DropdownButton
            categoryName={categoryName}
            categoryNameAr={categoryNameAr}
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

export default DishDropdown;

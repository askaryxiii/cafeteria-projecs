import { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import DropdownButton from "../user/dropdown-button";
import DropdownContent from "../user/dropdown-content";
import { getBreakfast, getTodayMenuByCategory, isFriday } from "../../lib/apis";

const DishDropdown = ({
  categoryId,
  categoryName,
  categoryNameAr,
  control,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFridayToday, setIsFridayToday] = useState(false);

  useEffect(() => {
    const checkFriday = async () => {
      const fridayCheck = await isFriday();
      setIsFridayToday(fridayCheck);
    };
    checkFriday();
  }, []);

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

  // Disable breakfast dropdown on Friday
  const isDisabled =
    isFridayToday && categoryName.toLowerCase() === "breakfast";

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
            onClick={() => !isDisabled && setIsOpen(!isOpen)}
            disabled={isDisabled}
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
              isOpen={isOpen}
            />
          </div>
        </div>
      )}
    />
  );
};

export default DishDropdown;

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import toast from "react-hot-toast";
import { getServerTime } from "../../../lib/apis";

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

const WEEKDAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"];
const CATEGORIES = ["protein", "carbs", "salad", "side"];

// Helper function to parse ISO date string and create a local date (not UTC)
function parseLocalDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day, 0, 0, 0, 0);
  return date;
}

// Helper function to format date as YYYY-MM-DD in local time (not UTC)
function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Get Monday of the current week
function getMondayOfCurrentWeek(now = new Date()) {
  const day = now.getDay(); // 0 (Sunday) - 6 (Saturday)
  // Calculate days since Monday (Monday = 1, Sunday = 0)
  const daysToMonday = day === 0 ? -6 : 1 - day; // If Sunday, go back 6 days; otherwise go back (day - 1) days
  const monday = new Date(now);
  monday.setDate(now.getDate() + daysToMonday);
  return formatLocalDate(monday);
}

// Calculate dates for the week starting from a given date
function getWeekDates(startDate) {
  const start = parseLocalDate(startDate);
  return WEEKDAYS.map((day, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return formatLocalDate(date);
  });
}

const WeeklyMenuItems = ({ control, watch, menuItems, errors }) => {
  const { fields: itemsFields } = useFieldArray({
    control,
    name: "items",
  });

  return (
    <div className="space-y-8">
      {itemsFields.map((itemField, itemIndex) => (
        <DaySection
          key={itemField.id}
          itemIndex={itemIndex}
          control={control}
          watch={watch}
          menuItems={menuItems}
          errors={errors}
        />
      ))}
    </div>
  );
};

const DaySection = ({ itemIndex, control, watch, menuItems, errors }) => {
  const day = watch(`items.${itemIndex}.day`);
  const date = watch(`items.${itemIndex}.date`);

  return (
    <div className="p-6  border border-[#ACA4A4] rounded-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 capitalize">
        {day} - {date}
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {CATEGORIES.map((category) => (
          <CategorySection
            key={category}
            category={category}
            itemIndex={itemIndex}
            control={control}
            watch={watch}
            menuItems={menuItems[category] || []}
            errors={errors}
          />
        ))}
      </div>
    </div>
  );
};

const CategorySection = ({
  category,
  itemIndex,
  control,
  watch,
  menuItems,
  errors,
}) => {
  const { fields: categoryFields } = useFieldArray({
    control,
    name: `items.${itemIndex}.menu.${category}`,
  });

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700 capitalize">
        {category}
      </h4>

      {categoryFields.map((field, fieldIndex) => {
        const isRequired = fieldIndex < 2;
        return (
          <MenuItemSelect
            key={field.id}
            fieldIndex={fieldIndex}
            itemIndex={itemIndex}
            category={category}
            isRequired={isRequired}
            control={control}
            watch={watch}
            menuItems={menuItems}
            errors={errors}
          />
        );
      })}
    </div>
  );
};

const MenuItemSelect = ({
  fieldIndex,
  itemIndex,
  category,
  isRequired,
  control,
  watch,
  menuItems,
  errors,
}) => {
  const fieldName = `items.${itemIndex}.menu.${category}.${fieldIndex}.code`;
  const value = watch(fieldName);

  // Find the selected item to display its name
  const selectedItem = value
    ? menuItems.find((item) => item.code === value)
    : null;

  return (
    <div>
      <label className="text-xs text-gray-600 mb-1 block">
        Item {fieldIndex + 1} {isRequired ? "*" : "(Optional)"}
      </label>
      <select
        {...control.register(fieldName, {
          required: isRequired
            ? `${category} item ${fieldIndex + 1} is required`
            : false,
        })}
        value={value || ""}
        className="w-full px-3 py-2 border border-[#ACA4A4] rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm">
        <option value="">
          {selectedItem
            ? `${selectedItem.item_name} (${selectedItem.code})`
            : `Select ${category}`}
        </option>
        {menuItems.map((item) => (
          <option key={item.id} value={item.code}>
            {item.item_name}{" "}
            {item.weight_grams && `(${item.weight_grams} جرام)`} {item.code}
          </option>
        ))}
      </select>
      {errors?.items?.[itemIndex]?.menu?.[category]?.[fieldIndex]?.id && (
        <p className="text-red-500 text-xs mt-1">
          {errors.items[itemIndex].menu[category][fieldIndex].id.message}
        </p>
      )}
    </div>
  );
};

const WeeklyMenu = () => {
  const [menuItems, setMenuItems] = useState({
    protein: [],
    carbs: [],
    salad: [],
    side: [],
  });
  const [weekData, setWeekData] = useState({
    mondayOfWeek: "",
    weekDates: [],
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      week_start_date: "",
      items: WEEKDAYS.map((day, index) => ({
        day,
        date: "",
        menu: {
          protein: [{}, {}, {}, {}],
          carbs: [{}, {}, {}, {}],
          salad: [{}, {}, {}, {}],
          side: [{}, {}, {}, {}],
        },
      })),
    },
  });

  useEffect(() => {
    (async () => {
      try {
        const serverTime = await getServerTime();
        const monday = getMondayOfCurrentWeek(serverTime);
        const dates = getWeekDates(monday);
        setWeekData({
          mondayOfWeek: monday,
          weekDates: dates,
        });

        // Update form values with the fetched week data
        setValue("week_start_date", monday);
        WEEKDAYS.forEach((day, index) => {
          setValue(`items.${index}.date`, dates[index]);
        });
      } catch (error) {
        console.error("Failed to get server time:", error);
      }
    })();
  }, [setValue]);
  const [loading, setLoading] = useState(false);
  const [isFetchingWeekly, setIsFetchingWeekly] = useState(false);

  // Function to fetch and autofill existing weekly menu
  const fetchExistingWeeklyMenu = async (dateString) => {
    try {
      setIsFetchingWeekly(true);

      // First, reset all fields to empty
      WEEKDAYS.forEach((day, dayIndex) => {
        ["protein", "carbs", "salad", "side"].forEach((category) => {
          for (let i = 0; i < 4; i++) {
            setValue(`items.${dayIndex}.menu.${category}.${i}.code`, "");
          }
        });
      });

      const token = readToken();
      if (!token) throw new Error("No auth token found");

      const response = await fetch(`${API_URL}/weekly-menu/${dateString}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!response.ok) {
        // If no existing menu, fields are already cleared
        return;
      }

      const data = await response.json();

      // Autofill the form with fetched data - API response uses "menu" array
      if (data && data.menu) {
        data.menu.forEach((dayMenu, dayIndex) => {
          // Fill each category with the fetched data
          ["protein", "carbs", "salad", "side"].forEach((category) => {
            const items = dayMenu.menu?.[category] || [];
            // Fill with fetched data (only first 4 items)
            items.slice(0, 4).forEach((item, itemIndex) => {
              setValue(
                `items.${dayIndex}.menu.${category}.${itemIndex}.code`,
                item.code || ""
              );
            });
          });
        });
      }
    } catch (error) {
      console.error("Error fetching existing weekly menu:", error);
      // Silently fail - user can still create new menu
    } finally {
      setIsFetchingWeekly(false);
    }
  };

  // Watch for changes in week_start_date
  const weekStartDate = watch("week_start_date");

  useEffect(() => {
    if (weekStartDate) {
      const newWeekDates = getWeekDates(weekStartDate);
      WEEKDAYS.forEach((day, index) => {
        setValue(`items.${index}.date`, newWeekDates[index]);
      });

      // Fetch existing weekly menu for this date
      fetchExistingWeeklyMenu(weekStartDate);
    }
  }, [weekStartDate, setValue]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const token = readToken();
        if (!token) throw new Error("No auth token found");

        const response = await fetch(`${API_URL}/menu`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch menu items");

        const data = await response.json();
        const categorized = {
          protein: data.filter((item) => item.category === "protein"),
          carbs: data.filter((item) => item.category === "carbs"),
          salad: data.filter((item) => item.category === "salad"),
          side: data.filter((item) => item.category === "side"),
        };
        setMenuItems(categorized);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };
    fetchMenuItems();
  }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const token = readToken();
      if (!token) throw new Error("No auth token found");

      // Filter out empty codes and construct payload matching backend format
      const cleanedData = {
        week_start_date: data.week_start_date,
        menu: data.items.map((item) => ({
          day: item.day,
          date: item.date,
          menu: {
            protein: item.menu.protein
              .filter((p) => p.code && p.code.trim() !== "")
              .map((p) => ({ code: p.code })),
            carbs: item.menu.carbs
              .filter((c) => c.code && c.code.trim() !== "")
              .map((c) => ({ code: c.code })),
            salad: item.menu.salad
              .filter((s) => s.code && s.code.trim() !== "")
              .map((s) => ({ code: s.code })),
            side: item.menu.side
              .filter((si) => si.code && si.code.trim() !== "")
              .map((si) => ({ code: si.code })),
          },
        })),
      };

      const response = await fetch(`${API_URL}/weekly-menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(cleanedData),
      });
      if (!response.ok) throw new Error("Failed to submit weekly menu");
      toast.success("Weekly menu submitted successfully!");
    } catch (error) {
      console.error("Error submitting weekly menu:", error);
      alert("Error submitting weekly menu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="mb-6">
        <label className="block text-sm font-medium text-[#072A57] mb-2">
          Week Start Date
        </label>
        <input
          type="date"
          {...control.register("week_start_date")}
          className="w-full pl-4 pr-4 py-1.5 rounded-sm border border-[#072A57] bg-[#D9D9D9] focus:outline-none "
        />
      </div>

      {/* Render each day */}
      <WeeklyMenuItems
        control={control}
        watch={watch}
        menuItems={menuItems}
        errors={errors}
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-[#072A57] hover:bg-[#0a3c7e] shadow-lg text-white font-semibold py-1.5 px-4  whitespace-nowrap transition-colors">
        {loading ? "Submitting..." : "Submit Weekly Menu"}
      </button>
    </form>
  );
};

export default WeeklyMenu;

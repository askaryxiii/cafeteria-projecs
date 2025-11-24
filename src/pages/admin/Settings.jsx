import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";
import toast from "react-hot-toast";

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

// Get Monday of the current week
function getMondayOfCurrentWeek() {
  const now = new Date();
  const day = now.getDay(); // 0 (Sunday) - 6 (Saturday)
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split("T")[0];
}

// Calculate dates for the week starting from a given date
function getWeekDates(startDate) {
  const start = new Date(startDate);
  return WEEKDAYS.map((day, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date.toISOString().split("T")[0];
  });
}

const WeeklyMenu = () => {
  const mondayOfWeek = getMondayOfCurrentWeek();
  const weekDates = getWeekDates(mondayOfWeek);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      week_start_date: mondayOfWeek,
      items: WEEKDAYS.map((day, index) => ({
        day,
        date: weekDates[index],
        menu: {
          protein: [{}, {}, {}, {}],
          carbs: [{}, {}, {}, {}],
          salad: [{}, {}, {}, {}],
          side: [{}, {}, {}, {}],
        },
      })),
    },
  });

  const [menuItems, setMenuItems] = useState({
    protein: [],
    carbs: [],
    salad: [],
    side: [],
  });
  const [loading, setLoading] = useState(false);

  // Watch for changes in week_start_date
  const weekStartDate = watch("week_start_date");

  useEffect(() => {
    if (weekStartDate) {
      const newWeekDates = getWeekDates(weekStartDate);
      WEEKDAYS.forEach((day, index) => {
        setValue(`items.${index}.date`, newWeekDates[index]);
      });
    }
  }, [weekStartDate, setValue]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const token = readToken();
        if (!token) throw new Error("No auth token found");

        const response = await fetch(`${API_URL}/menu`, {
          headers: { Authorization: `Bearer ${token}` },
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

      // Filter out empty codes and construct proper payload
      const cleanedData = {
        week_start_date: data.week_start_date,
        items: data.items.map((item) => ({
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Week Start Date
        </label>
        <input
          type="date"
          {...control.register("week_start_date")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
        {loading ? "Submitting..." : "Submit Weekly Menu"}
      </button>
    </form>
  );
};

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
    <div className="p-6 bg-white border border-gray-200 rounded-lg">
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
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm">
        <option value="">Select {category}</option>
        {menuItems.map((item) => (
          <option key={item.id} value={item.code}>
            {item.item_name} ({item.code})
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

const SettingsPanel = () => {
  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Settings</h3>
      <p className="text-gray-600">Settings content will be added here.</p>
    </div>
  );
};

const Settings = () => {
  return (
    <div className="w-full">
      <Tabs defaultValue="weekly-menu" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="weekly-menu">Weekly Menu</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly-menu" className="mt-6">
          <WeeklyMenu />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <SettingsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

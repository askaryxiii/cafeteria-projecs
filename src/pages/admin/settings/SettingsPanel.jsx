import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CustomTimePicker from "./custom-time-picker";

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

const SettingsPanel = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      breakfast_start: "11:00",
      breakfast_end: "15:00",
      lunch_start: "15:00",
      lunch_end: "23:59",
      drinks_start: "11:00",
      drinks_end: "23:00",
    },
  });

  // Fetch order windows on component mount
  useEffect(() => {
    const fetchOrderWindows = async () => {
      try {
        setLoading(true);
        const token = readToken();
        if (!token) throw new Error("No auth token found");

        const response = await fetch(`${API_URL}/order-windows`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch order windows");

        const data = await response.json();

        // Extract from windows object if it exists, otherwise use root level
        const windows = data?.windows || data;

        setValue("breakfast_start", windows.breakfast_start || "11:00");
        setValue("breakfast_end", windows.breakfast_end || "15:00");
        setValue("lunch_start", windows.lunch_start || "15:00");
        setValue("lunch_end", windows.lunch_end || "23:59");
        setValue("drinks_start", windows.drinks_start || "11:00");
        setValue("drinks_end", windows.drinks_end || "23:00");
      } catch (error) {
        console.error("Error fetching order windows:", error);
        toast.error("Failed to load order windows");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderWindows();
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      const token = readToken();
      if (!token) throw new Error("No auth token found");

      const payload = {
        breakfast_start: data.breakfast_start,
        breakfast_end: data.breakfast_end,
        lunch_start: data.lunch_start,
        lunch_end: data.lunch_end,
        drinks_start: data.drinks_start,
        drinks_end: data.drinks_end,
      };

      const response = await fetch(`${API_URL}/order-windows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to update order windows");

      toast.success("Order windows updated successfully!");
    } catch (error) {
      console.error("Error submitting order windows:", error);
      toast.error("Failed to update order windows: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const TimeSection = ({ label, startKey, endKey }) => (
    <div className="space-y-6 p-6">
      <h3 className="font-semibold text-lg text-[#072A57]">{label}</h3>

      <div className="flex flex-col md:grid md:grid-cols-2 gap-8 lg:gap-0">
        <Controller
          name={startKey}
          control={control}
          render={({ field: { value, onChange } }) => (
            <CustomTimePicker value={value} onChange={onChange} label="From" />
          )}
        />

        <Controller
          name={endKey}
          control={control}
          render={({ field: { value, onChange } }) => (
            <CustomTimePicker value={value} onChange={onChange} label="To" />
          )}
        />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full px-6 py-8">
        <p className="text-gray-600">Loading order windows...</p>
      </div>
    );
  }

  return (
    <div className="w-full px-6 ">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <h2 className="text-lg font-medium text-[#072A57]">Meals Hours</h2>
          <p className="text-muted-foreground mt-1">
            Set your open hours for each meal
          </p>
        </div>

        <TimeSection
          label="Breakfast"
          startKey="breakfast_start"
          endKey="breakfast_end"
        />
        <TimeSection label="Lunch" startKey="lunch_start" endKey="lunch_end" />
        <TimeSection
          label="Drinks"
          startKey="drinks_start"
          endKey="drinks_end"
        />

        <button
          type="submit"
          disabled={submitting}
          className="bg-[#072A57] hover:bg-[#0a3c7e] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-white font-semibold py-1.5 px-4  whitespace-nowrap transition-colors">
          {submitting ? "Submitting..." : "Submit Hours"}
        </button>
      </form>
    </div>
  );
};

export default SettingsPanel;

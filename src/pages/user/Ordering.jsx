import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  readToken,
  getVerifiedUser,
  placeOrder,
  getOrderWindows,
} from "../../lib/apis";
import FormFooter from "../../components/user/form-footer";
import DishDropdown from "../../components/user/dish-dropdown";

const Ordering = ({ onOrderPlaced }) => {
  const [isBreakfastWindow, setIsBreakfastWindow] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize windows on mount
  useEffect(() => {
    (async () => {
      const windowsResponse = await getOrderWindows();
      const now = new Date();
      const hour = now.getHours();

      let ORDER_WINDOW_BREAKFAST_START = 11;
      let ORDER_WINDOW_BREAKFAST_END = 15;

      if (windowsResponse?.windows) {
        ORDER_WINDOW_BREAKFAST_START =
          parseInt(windowsResponse.windows.breakfast_start) || 11;
        ORDER_WINDOW_BREAKFAST_END =
          parseInt(windowsResponse.windows.breakfast_end) || 15;
      }

      const isBreakfast =
        hour >= ORDER_WINDOW_BREAKFAST_START &&
        hour < ORDER_WINDOW_BREAKFAST_END;
      setIsBreakfastWindow(isBreakfast);
      setLoading(false);
    })();
  }, []);

  const defaultValues = isBreakfastWindow
    ? { breakfast: [] }
    : { protein: [], carbs: [], side: [], salad: [] };

  const { control, watch, handleSubmit } = useForm({
    defaultValues,
  });

  const selectedItems = watch();
  const [totalPrice, setTotalPrice] = useState(0);

  const onSubmit = () => {
    (async () => {
      try {
        const token = readToken();
        if (!token) {
          toast.error("Sign out and sign in again to place order");
          return;
        }

        const u = await getVerifiedUser(token);
        const user_email = u?.email || null;

        const today = new Date().toISOString().split("T")[0];
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];

        const meal_type = isBreakfastWindow ? "breakfast" : "lunch";
        const selectedDate = isBreakfastWindow ? today : tomorrow;

        const codes = Object.values(selectedItems).flat();
        const items = codes.map((c) => ({ code: c }));

        const orderBody = {
          date: selectedDate,
          meal_type,
          user_email,
          total_cost: Number(totalPrice),
          items,
        };

        const res = await placeOrder(orderBody, token);
        if (res && res.error) {
          toast.error(res.error);
          return;
        }
        toast.success("Order placed successfully");

        if (typeof onOrderPlaced === "function") {
          onOrderPlaced(res);
        }
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Failed to place order");
      }
    })();
  };

  const categories = [
    { id: "protein", name: "Protein", nameAr: "بروتين" },
    { id: "carbs", name: "Carbs", nameAr: "نشويات" },
    { id: "salad", name: "Salad", nameAr: "سلطة" },
    { id: "side", name: "Side", nameAr: "جانبي" },
  ];

  const breakfastCategories = [
    { id: "breakfast", name: "Breakfast", nameAr: "افطار" },
  ];

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="sm:px-6 md:px-12 lg:px-32 xl:px-44 py-4 sm:py-6 md:py-8">
      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal text-[#032552] mb-4 sm:mb-6 md:mb-8 uppercase tracking-wide text-center">
        Select Your Favorite Dishes
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 sm:space-y-8 md:space-y-10">
        {isBreakfastWindow
          ? breakfastCategories.map((category) => (
              <DishDropdown
                key={category.id}
                categoryId={category.id}
                categoryName={category.name}
                categoryNameAr={category.nameAr}
                control={control}
              />
            ))
          : categories.map((category) => (
              <DishDropdown
                key={category.id}
                categoryId={category.id}
                categoryName={category.name}
                categoryNameAr={category.nameAr}
                control={control}
              />
            ))}
        <FormFooter
          selectedItems={selectedItems}
          onTotalChange={setTotalPrice}
        />
      </form>
    </div>
  );
};

export default Ordering;

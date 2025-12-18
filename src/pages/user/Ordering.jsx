import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  readToken,
  getVerifiedUser,
  placeOrder,
  getOrderWindows,
  isTimeInWindow,
} from "../../lib/apis";
import FormFooter from "../../components/user/form-footer";
import DishDropdown from "../../components/user/dish-dropdown";

const Ordering = ({ onOrderPlaced }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [mealType, setMealType] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  // Initialize windows on mount
  useEffect(() => {
    (async () => {
      try {
        const windows = await getOrderWindows();

        if (windows) {
          const now = new Date();
          const hour = now.getHours();
          const minute = now.getMinutes();

          // Determine meal type based on current time
          if (
            isTimeInWindow(
              hour,
              minute,
              windows.breakfast_start,
              windows.breakfast_end
            )
          ) {
            setMealType("breakfast");
          } else if (
            isTimeInWindow(hour, minute, windows.lunch_start, windows.lunch_end)
          ) {
            setMealType("lunch");
          } else {
            setMealType(null); // Outside ordering windows
          }
        } else {
          // Fallback logic
          const hour = new Date().getHours();
          setMealType(
            hour >= 11 && hour < 15 ? "breakfast" : hour >= 15 ? "lunch" : null
          );
        }
      } catch (error) {
        console.error("Error fetching order windows:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const defaultValues =
    mealType === "breakfast"
      ? { breakfast: [] }
      : { protein: [], carbs: [], side: [], salad: [] };

  const { control, watch, handleSubmit } = useForm({
    defaultValues,
  });

  const selectedItems = watch();

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

        const meal_type = mealType === "breakfast" ? "breakfast" : "lunch";
        const selectedDate = mealType === "breakfast" ? today : tomorrow;

        const codes = Object.values(selectedItems).flat();
        const items = codes.map((c) => ({ code: c }));

        const orderBody = {
          date: selectedDate,
          meal_type,
          user_email,
          total_cost: Number(totalPrice),
          items,
        };
        console.log(orderBody);
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

  if (isLoading) {
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
        {mealType === "breakfast"
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

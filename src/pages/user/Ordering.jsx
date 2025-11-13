import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { readToken, getVerifiedUser, placeOrder } from "../../lib/apis";
import FormFooter from "../../components/user/form-footer";
import DishDropdown from "../../components/user/dish-dropdown";
const ORDER_WINDOW_BREAKFAST_START = import.meta.env
  .VITE_ORDER_WINDOW_BREAKFAST_START;

const ORDER_WINDOW_BREAKFAST_END = import.meta.env
  .VITE_ORDER_WINDOW_BREAKFAST_END;

const ORDER_WINDOW_LUNCH_START = import.meta.env.VITE_ORDER_WINDOW_LUNCH_START;
const ORDER_WINDOW_LUNCH_END = import.meta.env.VITE_ORDER_WINDOW_LUNCH_END;

const now = new Date();
const hour = now.getHours();
const isBreakfastWindow =
  hour >= ORDER_WINDOW_BREAKFAST_START && hour < ORDER_WINDOW_BREAKFAST_END;

const Ordering = ({ onOrderPlaced }) => {
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

        // lightweight local parse is sufficient to populate user_email for the
        // order payload. For security-sensitive checks use the async
        // `parseToken` which verifies with the server.
        const u = await getVerifiedUser(token);
        const user_email = u?.email || null;
        const user_id = u?.id || null;

        // date = tomorrow
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
        console.log("order result", res);
        if (typeof onOrderPlaced === "function") onOrderPlaced(res);
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

  return (
    <div className="px-44 ">
      <h2 className="text-2xl font-normal text-[#032552] mb-6 uppercase tracking-wide text-center">
        Select Your Favorite Dishes
      </h2>
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
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

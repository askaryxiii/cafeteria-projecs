import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  readToken,
  getVerifiedUser,
  placeOrder,
  getLunchOrderDate,
  getServerTimeComponents,
} from "../../lib/apis";
import FormFooter from "../../components/user/form-footer";
import DishDropdown from "../../components/user/dish-dropdown";

const Ordering = ({
  onOrderPlaced,
  mealType: propMealType,
  isBreakfastWindow,
  targetWeekday,
  targetDay,
}) => {
  const [totalPrice, setTotalPrice] = useState(0);

  // Use prop mealType if provided, otherwise calculate
  const mealType =
    propMealType !== undefined
      ? propMealType
      : isBreakfastWindow
        ? "breakfast"
        : "lunch";

  // Initialize on mount

  const defaultValues =
    mealType === "breakfast"
      ? { breakfast: [] }
      : { protein: [], carbs: [], side: [], salad: [] };

  const {
    control,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues,
  });

  const selectedItems = watch();

  const onSubmit = async () => {
    try {
      const token = readToken();
      if (!token) {
        toast.error("Sign out and sign in again to place order");
        return;
      }

      const u = await getVerifiedUser(token);
      const user_email = u?.email || null;

      const components = await getServerTimeComponents();
      const meal_type = mealType === "breakfast" ? "breakfast" : "lunch";

      let selectedDate;
      if (mealType === "breakfast") {
        selectedDate = components.dateString;
      } else {
        // For lunch, use the special lunch order date function
        // which returns Monday if today is Fri/Sat/Sun, otherwise tomorrow
        selectedDate = await getLunchOrderDate();
      }

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
  };

  const categories = [
    {
      id: "protein",
      name: "Protein",
      nameAr: "بروتين",
      selectionMode: "multiple",
      maxSelections: null,
    },
    {
      id: "carbs",
      name: "Carbs",
      nameAr: "نشويات",
      selectionMode: "multiple",
      maxSelections: null,
    },
    {
      id: "salad",
      name: "Salad",
      nameAr: "سلطة",
      selectionMode: "multiple",
      maxSelections: null,
    },
    {
      id: "side",
      name: "Side",
      nameAr: "جانبي",
      selectionMode: "multiple",
      maxSelections: null,
    },
  ];

  const breakfastCategories = [
    {
      id: "breakfast",
      name: "Breakfast",
      nameAr: "افطار",
      selectionMode: "multiple",
      maxSelections: null,
    },
  ];

  return (
    <div className="sm:px-6 md:px-12 lg:px-32 xl:px-44 py-4 sm:py-6 md:py-8">
      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal text-primary-navy mb-4 sm:mb-6 md:mb-8 uppercase tracking-wide text-center">
        Select Your Favorite Dishes For{" "}
        <span className="font-bold">{targetDay}</span>
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
                selectionMode={category.selectionMode}
                maxSelections={category.maxSelections}
              />
            ))
          : categories.map((category) => (
              <DishDropdown
                key={category.id}
                categoryId={category.id}
                categoryName={category.name}
                categoryNameAr={category.nameAr}
                control={control}
                selectionMode={category.selectionMode}
                maxSelections={category.maxSelections}
              />
            ))}

        <FormFooter
          selectedItems={selectedItems}
          onTotalChange={setTotalPrice}
          isSubmitting={isSubmitting}
          disabled={mealType === "breakfast"}
          mealType={mealType}
        />
      </form>
    </div>
  );
};

export default Ordering;

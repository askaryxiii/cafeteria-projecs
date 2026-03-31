import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  readToken,
  getVerifiedUser,
  placeOrder,
  getLunchOrderDate,
  getServerTimeComponents,
  getUserOrdersByDate,
} from "../../lib/apis";
import FormFooter from "../../components/user/form-footer";
import DishDropdown from "../../components/user/dish-dropdown";
import { IoCheckmarkCircle } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

const Ordering = ({
  onOrderPlaced,
  mealType: propMealType,
  isBreakfastWindow,
  targetWeekday,
  targetDay,
}) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [open, setOpen] = useState(false);

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
    reset,
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

        // PREVENT DUPLICATE LUNCH ORDERS: Check if user already has a lunch order for this date
        const existingOrders = await getUserOrdersByDate(selectedDate, token);
        if (Array.isArray(existingOrders) && existingOrders.length > 0) {
          const existingLunchOrder = existingOrders.find(
            (order) => order.meal_type === "lunch",
          );
          if (existingLunchOrder) {
            toast.error(
              "You already have a lunch order for this date. Please delete the existing order first if you want to place a new one.",
            );
            return;
          }
        }
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

      // For breakfast, show success modal instead of calling callback immediately
      if (mealType === "breakfast") {
        setOpen(true);
        reset();
      } else {
        // For lunch, call callback immediately
        toast.success("Order placed successfully");
        if (typeof onOrderPlaced === "function") {
          onOrderPlaced(res);
        }
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
                targetDate={targetWeekday}
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
                targetDate={targetWeekday}
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

      {mealType === "breakfast" && (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          center
          classNames={{
            modal: "rounded-lg",
          }}>
          <div className="flex flex-col items-center gap-4 sm:gap-6 py-6 sm:py-8 px-4 sm:px-8">
            <IoCheckmarkCircle className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 text-green-500" />
            <h3 className="text-2xl sm:text-3xl font-bold text-primary-navy text-center">
              Order Placed Successfully!
            </h3>
            <p className="text-base sm:text-lg text-dark-grey text-center">
              Your breakfast order has been placed. You can order more or close
              this.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Ordering;

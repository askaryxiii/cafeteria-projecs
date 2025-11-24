import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { readToken, getVerifiedUser } from "../../lib/apis";
import FormFooter from "../../components/user/form-footer";
import DrinkDropdown from "../../components/user/drink-dropdown";

const API_URL = import.meta.env.VITE_API_BASE;

const Drinks = ({ onOrderPlaced }) => {
  const { control, watch, handleSubmit } = useForm({
    defaultValues: { drinks: [] },
  });

  const selectedDrinks = watch();
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

        const codes = selectedDrinks.drinks || [];
        const items = codes.map((c) => ({ code: c }));

        const orderBody = {
          date: today,
          meal_type: "drinks",
          user_email,
          total_cost: Number(totalPrice),
          items,
        };

        const response = await fetch(`${API_URL}/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderBody),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to place order");
        }

        const result = await response.json();
        toast.success("Drink order placed successfully");

        if (typeof onOrderPlaced === "function") {
          onOrderPlaced(result);
        }
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Failed to place order");
      }
    })();
  };

  return (
    <div className="sm:px-6 md:px-12 lg:px-32 xl:px-44 py-4 sm:py-6 md:py-8">
      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal text-[#032552] mb-4 sm:mb-6 md:mb-8 uppercase tracking-wide text-center">
        Select Your Favorite Drinks
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 sm:space-y-8 md:space-y-10">
        <DrinkDropdown control={control} />
        <FormFooter
          selectedItems={selectedDrinks}
          onTotalChange={setTotalPrice}
        />
      </form>
    </div>
  );
};

export default Drinks;

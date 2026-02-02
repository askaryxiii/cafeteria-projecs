import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  readToken,
  getVerifiedUser,
  getServerTimeComponents,
} from "../../lib/apis";
import FormFooter from "../../components/user/form-footer";
import DrinkDropdown from "../../components/user/drink-dropdown";
import { IoCheckmarkCircle } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

const API_URL = import.meta.env.VITE_API_BASE;

const Drinks = ({ onOrderPlaced }) => {
  const {
    control,
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: { drinks: [] },
  });

  const selectedDrinks = watch();
  const [totalPrice, setTotalPrice] = useState(0);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

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

      const codes = selectedDrinks.drinks || [];
      const items = codes.map((c) => ({ code: c }));

      if (items.length === 0) {
        toast.error("No drinks selected");
        return;
      }

      const orderBody = {
        date: components.dateString,
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
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(orderBody),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Backend error response:", error);
        throw new Error(error.message || "Failed to place order");
      }

      const result = await response.json();
      onOpenModal();

      reset();

      if (typeof onOrderPlaced === "function") {
        onOrderPlaced(result);
      }
    } catch (err) {
      console.error("Full error:", err);
      toast.error(err.message || "Failed to place order");
    }
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
          isSubmitting={isSubmitting}
        />
      </form>

      <Modal
        open={open}
        onClose={onCloseModal}
        center
        classNames={{
          modal:
            "rounded-2xl shadow-2xl relative w-[75%] md:w-[55%] lg:w-[40%]",
          closeButton: "hidden",
          overlay: "flex items-center justify-center",
        }}
        closeIconButtonClassName="hidden"
        styles={{
          modal: {
            padding: "1.5rem",
            maxWidth: "90vw",
            margin: "0 auto",
            backgroundColor: "oklch(0.967 0.0029 264.54)",
          },
          overlay: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }}>
        <div className="flex flex-col items-center justify-center text-center ">
          {/* Success Icon */}
          <div className="mb-2">
            <IoCheckmarkCircle className="w-20 h-20 md:w-28 md:h-28 text-green-500" />
          </div>

          {/* Success Title */}
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
            Order Placed
          </h2>

          {/* Success Message */}
          <p className="text-gray-600 text-sm md:text-base leading-relaxed px-2 sm:px-4">
            Now pick up your order. You can order more.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Drinks;

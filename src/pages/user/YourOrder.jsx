import { useEffect, useState } from "react";
import {
  getOrderWindows,
  isTimeInWindow,
  getServerTimeComponents,
  getTodayWeekday,
  deleteOrder,
  getLunchOrderDate,
} from "../../lib/apis";
import Ordering from "./Ordering";
import DeleteConfirmModal from "../../components/admin/users/delete-confirm-modal";
import OrderSkeleton from "../../components/skeleton/loading/order/OrderSkeleton";
import { MdDeleteOutline } from "react-icons/md";
import toast from "react-hot-toast";

const YourOrder = ({ order, onOrderUpdated, isBreakfastWindow }) => {
  const [currentOrder, setCurrentOrder] = useState(order);
  const [windowsInitialized, setWindowsInitialized] = useState(false);
  const [localBreakfastWindow, setLocalBreakfastWindow] =
    useState(isBreakfastWindow);
  const [todayWeekday, setTodayWeekday] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [targetWeekday, setTargetWeekday] = useState("");

  // Initialize windows on mount
  useEffect(() => {
    (async () => {
      try {
        const windows = await getOrderWindows();
        const components = await getServerTimeComponents();
        const weekday = await getTodayWeekday();
        setTodayWeekday(weekday);

        if (windows) {
          const isBreakfast = isTimeInWindow(
            components.hour,
            components.minute,
            windows.breakfast_start,
            windows.breakfast_end,
          );

          setLocalBreakfastWindow(isBreakfast);
        } else {
          // Fallback to default timing
          setLocalBreakfastWindow(
            components.hour >= 11 && components.hour < 15,
          );
        }
      } catch (error) {
        console.error("Error fetching order windows:", error);
        const components = await getServerTimeComponents();
        setLocalBreakfastWindow(components.hour >= 11 && components.hour < 15);
      } finally {
        setWindowsInitialized(true);
      }
    })();
  }, []);

  // Update when order prop changes
  useEffect(() => {
    setCurrentOrder(order);

    // Calculate target weekday based on meal type
    (async () => {
      if (order && order.meal_type) {
        const mealType = order.meal_type?.toLowerCase();
        const weekday = await getTodayWeekday();

        if (mealType === "breakfast") {
          // Breakfast shows today
          setTargetWeekday(weekday);
        } else if (mealType === "lunch") {
          // Lunch shows tomorrow (or Monday if weekend)
          const lunchDate = await getLunchOrderDate();
          // Parse the lunch date to get the weekday name
          const lunchDateObj = new Date(lunchDate);
          const dayIndex = lunchDateObj.getUTCDay();
          const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
          setTargetWeekday(days[dayIndex]);
        }
      }
    })();
  }, [order]);

  const handleDeleteOrder = (orderId) => {
    if (!orderId) return;
    setDeletingOrderId(orderId);
  };

  const handleConfirmDelete = async () => {
    if (!deletingOrderId) return;

    setIsDeleting(true);
    try {
      const result = await deleteOrder(deletingOrderId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Order deleted successfully");
        // Reset the order to show the ordering form
        setCurrentOrder(null);
        if (typeof onOrderUpdated === "function") {
          onOrderUpdated();
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
      setDeletingOrderId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeletingOrderId(null);
  };

  // Filter order based on current window
  // During breakfast window, only show breakfast orders
  // During lunch window, only show lunch orders
  const displayOrder =
    windowsInitialized && currentOrder
      ? (() => {
          const mealType = currentOrder.meal_type?.toLowerCase();
          const isCorrectWindow =
            (localBreakfastWindow && mealType === "breakfast") ||
            (!localBreakfastWindow && mealType === "lunch");

          return isCorrectWindow ? currentOrder : null;
        })()
      : null;

  if (!displayOrder) {
    if (!windowsInitialized) {
      return <OrderSkeleton />;
    }
    const mealType = isBreakfastWindow ? "breakfast" : "lunch";
    return (
      <Ordering
        onOrderPlaced={onOrderUpdated}
        mealType={mealType}
        isBreakfastWindow={isBreakfastWindow}
      />
    );
  }

  return (
    <div className="flex flex-col items-center w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-3">
      <h2 className="text-2xl sm:text-3xl md:text-4xl text-center font-semibold text-primary-navy drop-shadow-[0_3px_2px_rgba(0,0,0,0.3)] mb-4 sm:mb-6 md:mb-8">
        Your Order For
        {/* <span className="font-bold">{targetWeekday}</span> */}
      </h2>
      <div className="px-3 sm:px-6 md:px-8 lg:px-32 py-4 sm:py-6 md:py-8 your-order w-full sm:w-11/12 md:w-10/12 lg:w-9/12">
        <div className="relative bg-primary-navy text-primary-navy py-6 md:py-8 px-4 sm:px-6 md:px-10 rounded-lg shadow w-full">
          {displayOrder?.meal_type?.toLowerCase() === "lunch" && (
            <button
              onClick={() => handleDeleteOrder(displayOrder.id)}
              className="absolute  top-2 right-4 md:top-5 md:right-10
                  flex items-center justify-center w-8 h-8 rounded-full
                  bg-light-grey text-primary-navy cursor-pointer
                  hover:bg-[#FF0000] hover:text-light-grey transition">
              <MdDeleteOutline size={23} />
            </button>
          )}
          <div className="justify-center flex flex-col items-center">
            <div className="flex flex-col gap-4 md:gap-5 pt-6 sm:pt-8 md:pt-10 pb-3 sm:pb-4 md:pb-5 w-full">
              {displayOrder?.items && displayOrder?.items.length ? (
                displayOrder?.items.map((it, idx) => (
                  <div
                    className="bg-mid-grey text-center  py-1.5 md:py-2 px-2 md:px-4 text-base md:text-lg lg:text-xl font-semibold rounded"
                    key={idx}>
                    <span>{it.item_name}</span> -{" "}
                    <span className="text-xs sm:text-sm md:text-base lg:text-lg font-normal">
                      {it.price}
                    </span>{" "}
                    جنيه
                  </div>
                ))
              ) : (
                <span className="text-sm sm:text-base md:text-lg">
                  No items
                </span>
              )}
            </div>
            <div
              className={`mt-3 inline-flex items-center gap-1.5 pl-1.5 pr-2 py-1.5  font-normal text-base  text-light-grey border-b border-b-light-grey `}>
              {/* <div className="flex items-center justify-center w-7 h-7 rounded-full shrink-0 bg-navy-dark text-light-grey">
                  <PiCurrencyGbpBold size={18} />
                </div> */}
              {displayOrder?.total_cost} LE
            </div>
          </div>
        </div>
      </div>
      {deletingOrderId && (
        <DeleteConfirmModal
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default YourOrder;

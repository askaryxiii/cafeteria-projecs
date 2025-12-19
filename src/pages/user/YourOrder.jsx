import { useEffect, useState } from "react";
import {
  readToken,
  getUserOrdersByDate,
  getOrderWindows,
  parseTimeToHours,
  isTimeInWindow,
  getServerTime,
} from "../../lib/apis";
import Ordering from "./Ordering";

const YourOrder = ({ order, onOrderUpdated, isBreakfastWindow }) => {
  const [currentOrder, setCurrentOrder] = useState(order);
  const [windowsInitialized, setWindowsInitialized] = useState(false);
  const [localBreakfastWindow, setLocalBreakfastWindow] =
    useState(isBreakfastWindow);

  // Initialize windows on mount
  useEffect(() => {
    (async () => {
      try {
        const windows = await getOrderWindows();

        if (windows) {
          const now = await getServerTime();
          const hour = now.getHours();
          const minute = now.getMinutes();

          const isBreakfast = isTimeInWindow(
            hour,
            minute,
            windows.breakfast_start,
            windows.breakfast_end
          );

          setLocalBreakfastWindow(isBreakfast);
        } else {
          // Fallback to default timing
          const now = await getServerTime();
          setLocalBreakfastWindow(now.getHours() >= 11 && now.getHours() < 15);
        }
      } catch (error) {
        console.error("Error fetching order windows:", error);
        const now = await getServerTime();
        setLocalBreakfastWindow(now.getHours() >= 11 && now.getHours() < 15);
      } finally {
        setWindowsInitialized(true);
      }
    })();
  }, []);

  // Update when order prop changes
  useEffect(() => {
    setCurrentOrder(order);
  }, [order]);

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
      : currentOrder;

  if (!displayOrder) {
    return <Ordering onOrderPlaced={onOrderUpdated} />;
  }

  return (
    <div className="flex flex-col items-center w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <h2 className="text-2xl sm:text-3xl md:text-4xl text-center font-semibold text-[#032552] drop-shadow-[0_3px_2px_rgba(0,0,0,0.3)] mb-4 sm:mb-6 md:mb-8">
        Your Order
      </h2>
      <div className="px-3 sm:px-6 md:px-8 lg:px-32 py-4 sm:py-6 md:py-8 your-order w-full sm:w-11/12 md:w-10/12 lg:w-9/12">
        <div className="bg-[#032552] text-white py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-10 rounded-lg shadow w-full">
          <div className="justify-center flex flex-col items-center">
            <div className="flex flex-col gap-4 sm:gap-5 md:gap-7 pt-6 sm:pt-8 md:pt-10 pb-3 sm:pb-4 md:pb-5 w-full">
              {displayOrder?.items && displayOrder?.items.length ? (
                displayOrder?.items.map((it, idx) => (
                  <div
                    className="bg-[#D9D9D9B2] text-center py-1.5 sm:py-2 md:py-2.5 px-2 sm:px-3 md:px-4 text-sm sm:text-base md:text-lg lg:text-xl font-medium rounded"
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
            <span className="bg-[#D9D9D9B2] text-center py-1.5 sm:py-2 md:py-2.5 px-3 sm:px-4 md:px-6 text-base sm:text-lg md:text-xl lg:text-2xl rounded">
              {displayOrder?.total_cost} LE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourOrder;

import { useEffect, useState } from "react";
import {
  readToken,
  getUserOrdersByDate,
  getOrderWindows,
  isTimeInWindow,
  getServerTimeComponents,
  getLunchCheckDate,
  isOrderWindowActive,
} from "../../lib/apis";
import Ordering from "./Ordering";
import YourOrder from "./YourOrder";
import NoOrderWindow from "../../components/user/no-order-window";
import { toast } from "react-hot-toast";
import OrderSkeleton from "../../components/skeleton/loading/order/OrderSkeleton";

const DashboardUser = () => {
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [isBreakfastWindow, setIsBreakfastWindow] = useState(null);
  const [windowsInitialized, setWindowsInitialized] = useState(false);
  const [targetWeekday, setTargetWeekday] = useState("");
  const [targetDay, setTargetDay] = useState("");
  const [hasActiveWindow, setHasActiveWindow] = useState(true);

  // Initialize windows on mount - MUST complete before fetching order
  useEffect(() => {
    (async () => {
      try {
        const components = await getServerTimeComponents();
        const windows = await getOrderWindows();

        // Check if there's an active order window
        const windowStatus = await isOrderWindowActive();
        setHasActiveWindow(windowStatus.active);

        if (windows && windows.breakfast_start && windows.breakfast_end) {
          const isBreakfast = isTimeInWindow(
            components.hour,
            components.minute,
            windows.breakfast_start,
            windows.breakfast_end,
          );
          setIsBreakfastWindow(isBreakfast);
        } else {
          // Fallback to default timing if API fails
          // Breakfast: 11:00-15:00, Lunch: 15:00-23:59
          const isBreakfast = components.hour >= 11 && components.hour < 15;
          setIsBreakfastWindow(isBreakfast);
        }
      } catch (error) {
        console.error("Error in window initialization:", error);
        // Fallback default
        const components = await getServerTimeComponents();
        const isBreakfast = components.hour >= 11 && components.hour < 15;
        setIsBreakfastWindow(isBreakfast);
        setHasActiveWindow(false);
      } finally {
        setWindowsInitialized(true);
      }
    })();
  }, []);

  const fetchOrder = async (isBreakfast) => {
    try {
      const token = readToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const components = await getServerTimeComponents();

      let dateToCheck;
      let dayName;
      const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      if (isBreakfast) {
        // Breakfast shows today
        dateToCheck = components.dateString;
        setTargetWeekday(dateToCheck);
        dayName = dayNames[components.day];
        setTargetDay(dayName);
      } else {
        // Lunch shows tomorrow (or Monday if weekend)
        dateToCheck = await getLunchCheckDate();
        setTargetWeekday(dateToCheck);
        // Parse the lunch date to get the correct day of week
        const lunchDateObj = new Date(dateToCheck);
        const lunchDayOfWeek = lunchDateObj.getUTCDay();
        dayName = dayNames[lunchDayOfWeek];
        setTargetDay(dayName);
      }

      const res = await getUserOrdersByDate(dateToCheck, token);
      if (res && res.error) {
        toast.error(res.error);
        setLoading(false);
        return;
      }
      if (Array.isArray(res) && res.length > 0) {
        // Filter out drinks and breakfast orders, only show lunch orders
        // Breakfast orders should not block the ordering form (they show success modal instead)
        const foodOrder = res.find((order) => order.meal_type === "lunch");
        setOrder(foodOrder || null);
      } else {
        setOrder(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Only fetch order after windows are initialized AND isBreakfastWindow is set
  useEffect(() => {
    if (windowsInitialized && isBreakfastWindow !== null) {
      setLoading(true);
      fetchOrder(isBreakfastWindow);
    }
  }, [windowsInitialized, isBreakfastWindow]);

  const handleOrderPlaced = (createdOrder) => {
    // Add a small delay to ensure backend has processed the order
    setTimeout(async () => {
      if (windowsInitialized && isBreakfastWindow !== null) {
        await fetchOrder(isBreakfastWindow);
      }
    }, 200);
  };

  if (loading) return <OrderSkeleton />;

  // If no active order window, show the NoOrderWindow component
  if (!hasActiveWindow) {
    return <NoOrderWindow />;
  }

  const passedMealType =
    isBreakfastWindow === true
      ? "breakfast"
      : isBreakfastWindow === false
        ? "lunch"
        : undefined;

  return order ? (
    <YourOrder
      order={order}
      onOrderUpdated={handleOrderPlaced}
      isBreakfastWindow={isBreakfastWindow}
      targetDay={targetDay}
    />
  ) : (
    <Ordering
      onOrderPlaced={handleOrderPlaced}
      mealType={passedMealType}
      isBreakfastWindow={isBreakfastWindow}
      targetWeekday={targetWeekday}
      targetDay={targetDay}
    />
  );
};

export default DashboardUser;

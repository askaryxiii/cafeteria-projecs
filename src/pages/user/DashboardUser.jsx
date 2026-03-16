import { useEffect, useState } from "react";
import {
  readToken,
  getUserOrdersByDate,
  getOrderWindows,
  isTimeInWindow,
  getServerTimeComponents,
  getLunchCheckDate,
} from "../../lib/apis";
import Ordering from "./Ordering";
import YourOrder from "./YourOrder";
import { toast } from "react-hot-toast";
import OrderSkeleton from "../../components/skeleton/loading/order/OrderSkeleton";

const DashboardUser = () => {
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [isBreakfastWindow, setIsBreakfastWindow] = useState(null);
  const [windowsInitialized, setWindowsInitialized] = useState(false);

  // Initialize windows on mount - MUST complete before fetching order
  useEffect(() => {
    (async () => {
      try {
        const components = await getServerTimeComponents();
        const windows = await getOrderWindows();

        if (windows) {
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

      if (isBreakfast) {
        // For breakfast, always check today
        dateToCheck = components.dateString;
      } else {
        // For lunch, use the special lunch check date function
        // which returns Monday if today is Fri/Sat/Sun, otherwise tomorrow
        dateToCheck = await getLunchCheckDate();
      }

      const res = await getUserOrdersByDate(dateToCheck, token);
      if (res && res.error) {
        toast.error(res.error);
        setLoading(false);
        return;
      }
      if (Array.isArray(res) && res.length > 0) {
        // Filter out drinks orders, only show breakfast/lunch orders
        const foodOrder = res.find((order) => order.meal_type !== "drinks");
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

  return order ? (
    <YourOrder
      order={order}
      onOrderUpdated={handleOrderPlaced}
      isBreakfastWindow={isBreakfastWindow}
    />
  ) : (
    <Ordering
      onOrderPlaced={handleOrderPlaced}
      mealType={isBreakfastWindow ? "breakfast" : "lunch"}
      isBreakfastWindow={isBreakfastWindow}
    />
  );
};

export default DashboardUser;

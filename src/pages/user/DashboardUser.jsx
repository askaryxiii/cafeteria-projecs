import { useEffect, useState } from "react";
import {
  readToken,
  getUserOrdersByDate,
  getOrderWindows,
  parseTimeToHours,
  isTimeInWindow,
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
        const windows = await getOrderWindows();

        if (windows) {
          const now = new Date();
          const hour = now.getHours();
          const minute = now.getMinutes();

          const isBreakfast = isTimeInWindow(
            hour,
            minute,
            windows.breakfast_start,
            windows.breakfast_end
          );

          setIsBreakfastWindow(isBreakfast);
        } else {
          // Fallback to default timing if API fails
          setIsBreakfastWindow(hour >= 11 && hour < 15);
        }
      } catch (error) {
        console.error("Error fetching order windows:", error);
        // Fallback default
        const hour = new Date().getHours();
        setIsBreakfastWindow(hour >= 11 && hour < 15);
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

      const today = new Date().toISOString().split("T")[0];
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      const dateToCheck = isBreakfast ? today : tomorrow;

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
    <Ordering onOrderPlaced={handleOrderPlaced} />
  );
};

export default DashboardUser;

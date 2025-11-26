import { useEffect, useState } from "react";
import {
  readToken,
  getUserOrdersByDate,
  getOrderWindows,
} from "../../lib/apis";
import Ordering from "./Ordering";
import YourOrder from "./YourOrder";
import { toast } from "react-hot-toast";
import OrderSkeleton from "../../components/skeleton/loading/order/OrderSkeleton";

const DashboardUser = () => {
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [isBreakfastWindow, setIsBreakfastWindow] = useState(false);

  // Initialize windows on mount
  useEffect(() => {
    (async () => {
      const windowsResponse = await getOrderWindows();
      const now = new Date();
      const hour = now.getHours();

      let ORDER_WINDOW_BREAKFAST_START = 11;
      let ORDER_WINDOW_BREAKFAST_END = 15;

      if (windowsResponse?.windows) {
        ORDER_WINDOW_BREAKFAST_START =
          parseInt(windowsResponse.windows.breakfast_start) || 11;
        ORDER_WINDOW_BREAKFAST_END =
          parseInt(windowsResponse.windows.breakfast_end) || 15;
      }

      const isBreakfast =
        hour >= ORDER_WINDOW_BREAKFAST_START &&
        hour < ORDER_WINDOW_BREAKFAST_END;
      setIsBreakfastWindow(isBreakfast);
    })();
  }, []);

  const fetchOrder = async () => {
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

      const dateToCheck = isBreakfastWindow ? today : tomorrow;

      const res = await getUserOrdersByDate(dateToCheck, token);
      if (res && res.error) {
        toast.error(res.error);
        setLoading(false);
        return;
      }
      if (Array.isArray(res) && res.length > 0) {
        setOrder(res[0]);
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

  useEffect(() => {
    setLoading(true);
    fetchOrder();
  }, [isBreakfastWindow]);

  const handleOrderPlaced = (createdOrder) => {
    // Add a small delay to ensure backend has processed the order
    setTimeout(async () => {
      setLoading(true);
      await fetchOrder();
    }, 200);
  };

  if (loading) return <OrderSkeleton />;

  return order ? (
    <YourOrder order={order} onOrderUpdated={handleOrderPlaced} />
  ) : (
    <Ordering onOrderPlaced={handleOrderPlaced} />
  );
};

export default DashboardUser;

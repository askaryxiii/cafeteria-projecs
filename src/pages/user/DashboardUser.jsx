import { useEffect, useState } from "react";
import { readToken, getUserOrdersByDate } from "../../lib/apis";
import Ordering from "./Ordering";
import YourOrder from "./YourOrder";
import { toast } from "react-hot-toast";
import OrderSkeleton from "../../components/skeleton/loading/order/OrderSkeleton";

const DashboardUser = () => {
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  // Breakfast window is defined via env vars. When inside the breakfast
  // window we must check for today's orders (breakfast is for today).
  const ORDER_WINDOW_BREAKFAST_START = import.meta.env
    .VITE_ORDER_WINDOW_BREAKFAST_START;
  const ORDER_WINDOW_BREAKFAST_END = import.meta.env
    .VITE_ORDER_WINDOW_BREAKFAST_END;
  const ORDER_WINDOW_LUNCH_START = import.meta.env
    .VITE_ORDER_WINDOW_LUNCH_START;
  const ORDER_WINDOW_LUNCH_END = import.meta.env.VITE_ORDER_WINDOW_LUNCH_END;

  const now = new Date();
  const hour = now.getHours();
  const isBreakfastWindow =
    hour >= ORDER_WINDOW_BREAKFAST_START && hour < ORDER_WINDOW_BREAKFAST_END;
  const isLunchWindow =
    hour >= ORDER_WINDOW_LUNCH_START || hour < ORDER_WINDOW_LUNCH_END;

  useEffect(() => {
    (async () => {
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

        // For breakfast we check today's orders; for lunch we keep the
        // existing behavior (checking tomorrow).
        const dateToCheck = isBreakfastWindow ? today : tomorrow;

        const res = await getUserOrdersByDate(dateToCheck, token);
        if (res && res.error) {
          toast.error(res.error);
          setLoading(false);
          return;
        }

        // res expected to be array of orders; find one for current user if multiple
        if (Array.isArray(res) && res.length > 0) {
          // if backend returns multiple, pick first
          setOrder(res[0]);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    })();

    console.log(order);
  }, []);

  const handleOrderPlaced = (createdOrder) => {
    setOrder(createdOrder);
  };

  if (loading) return <OrderSkeleton />;

  if (order) return <YourOrder order={order} />;

  return <Ordering onOrderPlaced={handleOrderPlaced} />;
};

export default DashboardUser;

import { useEffect, useState } from "react";
import { readToken, getUserOrdersByDate } from "../../lib/apis";
import Ordering from "./Ordering";
import YourOrder from "./YourOrder";
import { toast } from "react-hot-toast";
import OrderSkeleton from "../../components/skeleton/loading/order/OrderSkeleton";

const DashboardUser = () => {
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  const ORDER_WINDOW_BREAKFAST_START = import.meta.env
    .VITE_ORDER_WINDOW_BREAKFAST_START;
  const ORDER_WINDOW_BREAKFAST_END = import.meta.env
    .VITE_ORDER_WINDOW_BREAKFAST_END;

  const now = new Date();
  const hour = now.getHours();
  const isBreakfastWindow =
    hour >= ORDER_WINDOW_BREAKFAST_START && hour < ORDER_WINDOW_BREAKFAST_END;

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
  }, []);

  const handleOrderPlaced = (createdOrder) => {
    setOrder(createdOrder);
  };

  if (loading) return <OrderSkeleton />;

  return order ? (
    <YourOrder order={order} />
  ) : (
    <Ordering onOrderPlaced={handleOrderPlaced} />
  );
};

export default DashboardUser;

import { useEffect, useState } from "react";
import { readToken, getUserOrdersByDate } from "../../lib/apis";
import Ordering from "./Ordering";

const ORDER_WINDOW_BREAKFAST_START = import.meta.env
  .VITE_ORDER_WINDOW_BREAKFAST_START;
const ORDER_WINDOW_BREAKFAST_END = import.meta.env
  .VITE_ORDER_WINDOW_BREAKFAST_END;

const now = new Date();
const hour = now.getHours();
const isBreakfastWindow =
  hour >= ORDER_WINDOW_BREAKFAST_START && hour < ORDER_WINDOW_BREAKFAST_END;

const YourOrder = ({ order }) => {
  const [currentOrder, setCurrentOrder] = useState(order);

  useEffect(() => {
    (async () => {
      const token = readToken();
      const today = new Date().toISOString().split("T")[0];
      const fetchedOrder = await getUserOrdersByDate(today, token);
      const filteredOrder = fetchedOrder.find(
        (o) => o.meal_type === (isBreakfastWindow ? "breakfast" : "lunch")
      );
      setCurrentOrder(filteredOrder);
    })();
  }, []);

  if (!currentOrder) return <Ordering />;

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-3xl text-center font-semibold text-[#032552] drop-shadow-[0_3px_2px_rgba(0,0,0,0.3)]">
        Your Order
      </h2>
      <div className="px-32 py-8 your-order w-9/12">
        <div className="bg-[#032552] text-white py-8 px-10 rounded-lg shadow w-3/4 mx-auto">
          <div className="justify-center flex flex-col items-center">
            <div className="flex flex-col gap-7 pt-10 pb-5 w-full">
              {currentOrder?.items && currentOrder?.items.length ? (
                currentOrder?.items.map((it, idx) => (
                  <div
                    className="bg-[#D9D9D9B2] text-center py-1.5 text-xl font-medium rounded"
                    key={idx}>
                    <span>{it.item_name}</span> -{" "}
                    <span className="text-lg font-normal">{it.price}</span> جنيه
                  </div>
                ))
              ) : (
                <span>No items</span>
              )}
            </div>
            <span className="bg-[#D9D9D9B2] text-center py-1.5 px-3 text-lg rounded">
              {currentOrder.total_cost} LE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourOrder;

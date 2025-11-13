import { useEffect, useState } from "react";
import { getChefOrders } from "../../lib/apis";
import { TableHeader } from "./table-header";
import { TableRow } from "./table-row";
// import io from "socket.io-client";

export function OrdersTable() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    (async () => {
      const fetchedOrders = await getChefOrders();
      if (!fetchedOrders.error) {
        setOrders(fetchedOrders.items);
      }
    })();
  }, []);

  // useEffect(() => {
  //   const socket = io(import.meta.env.VITE_API_BASE);

  //   socket.on("orderAdded", (newOrder) => {
  //     setOrders((prevOrders) => [...prevOrders, newOrder]);
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  return (
    <div className="w-full bg-[#FDF6F633] border-none rounded-lg shadow p-3">
      <TableHeader label1="NUM" label2="ORDERS" />
      {orders.map((item) => (
        <TableRow
          key={item.menu_item_id}
          num={item.total_quantity}
          order={item.item_name}
        />
      ))}
    </div>
  );
}

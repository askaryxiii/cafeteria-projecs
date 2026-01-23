import { useEffect, useState } from "react";
import { getChefOrders } from "../../lib/apis";
import { TableHeader } from "./table-header";
import { TableRow } from "./table-row";

export function OrdersTable() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    (async () => {
      const fetchedOrders = await getChefOrders();
      if (!fetchedOrders.error) {
        // Sort orders by item name in ascending order
        const sortedOrders = [...fetchedOrders.items].sort((a, b) => {
          const nameA = a.item_name?.toLowerCase() || "";
          const nameB = b.item_name?.toLowerCase() || "";

          return nameA.localeCompare(nameB);
        });

        setOrders(sortedOrders);
      }
    })();
  }, []);

  return (
    <div className="w-full bg-mid-grey border-none rounded-b-lg shadow p-2 sm:p-2.5 md:p-3">
      <TableHeader label1="NUM" label2="ORDERS" />
      {orders.map((item) => (
        <TableRow
          key={item.menu_item_id}
          num={item.total_quantity}
          order={item.item_name}
          weight={item.weight_grams}
        />
      ))}
    </div>
  );
}

import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import Table from "../../components/user/orders-list/table";
import TableBody from "../../components/user/orders-list/table-body";
import TableRow from "../../components/user/orders-list/table-row";
import TableHeader from "../../components/user/orders-list/table-header";
import TableCell from "../../components/user/orders-list/table-cell";
import { getUserOrderFromTo, getVerifiedUser, readToken } from "../../lib/apis";
import { toast } from "react-hot-toast";

const OrdersList = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { dates } = useParams();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dates) {
      navigate("/user/orders", { replace: true });
    }
  }, [dates, navigate]);

  useEffect(() => {
    (async () => {
      try {
        if (!dates) return;

        const token = readToken();
        if (!token) {
          toast.error("No auth token found");
          setLoading(false);
          return;
        }

        const verifiedUser = await getVerifiedUser(token);
        if (!verifiedUser) {
          toast.error("Failed to verify user");
          setLoading(false);
          return;
        }

        const userId = verifiedUser.id;

        // dates format: DD-MM-YYYY_DD-MM-YYYY
        const decoded = decodeURIComponent(dates || "");
        const [fromStr, toStr] = decoded.split("_");

        // Convert DD-MM-YYYY to YYYY-MM-DD for API
        const convertToISO = (dateStr) => {
          const [day, month, year] = dateStr.split("-");
          return `${day}-${month}-${year}`;
        };

        const from = convertToISO(fromStr);
        const to = convertToISO(toStr);

        const res = await getUserOrderFromTo(userId, from, to);
        if (res && res.error) {
          toast.error(res.error);
          setTableData([]);
          setLoading(false);
          return;
        }

        // Transform API response to table format
        const transformed = (Array.isArray(res) ? res : []).map((order) => ({
          date: order.date
            ? new Date(order.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })
            : "N/A",
          orders:
            order.items && Array.isArray(order.items)
              ? order.items
                  .map((item) => item.item_name || item.code || "Unknown")
                  .join(" - ")
              : "No items",
          cost: order.total_cost ? Number(order.total_cost) : 0,
        }));

        setTableData(transformed);
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.error("Failed to load orders");
        setTableData([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [dates]);

  const totalPrice = tableData.reduce((sum, row) => sum + row.cost, 0);

  if (!dates) return null;

  if (loading)
    return (
      <div className="  p-4 md:p-8 flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading orders...</p>
      </div>
    );

  return (
    <div className="  p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {tableData.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500 text-lg">
              No orders found for this date range
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader
              columns={[
                { label: "Date", key: "date" },
                { label: "ORDER", key: "order" },
                { label: "Cost", key: "cost" },
              ]}
            />
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={index} isEven={index % 2 === 0}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell className="" dir="rtl">
                    {row.orders}
                  </TableCell>
                  <TableCell>{row.cost}</TableCell>
                </TableRow>
              ))}
              <TableRow className=" font-bold">
                <TableCell colSpan="2" className="text-right font-semibold ">
                  Total:
                </TableCell>
                <TableCell className="font-semibold ">
                  {totalPrice.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default OrdersList;

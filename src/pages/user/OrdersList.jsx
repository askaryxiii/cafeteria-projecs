import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import Table from "../../components/user/orders-list/table";
import TableBody from "../../components/user/orders-list/table-body";
import TableRow from "../../components/user/orders-list/table-row";
import TableHeader from "../../components/user/orders-list/table-header";
import TableCell from "../../components/user/orders-list/table-cell";

const tableData = [
  {
    date: "21/08/25",
    orders: "فراخ مشویه-ریخ فرخه-ارز ابیض-سلطه خضراء",
    cost: "100",
  },
  { date: "22/08/25", orders: "فراخ مشویه-نصف فرخه-مکرونه فرن", cost: "80" },
  { date: "23/08/25", orders: "فراخ شامیز-150-جرام", cost: "60" },
  { date: "24/08/25", orders: "فراخ شامیز-300-جرام-پنجر-دیل", cost: "80" },
  { date: "25/08/25", orders: "مکرونه فرن", cost: "45" },
  { date: "26/08/25", orders: "ارز ابیض", cost: "10" },
  {
    date: "27/08/25",
    orders: "فراخ شامیز-150-جرام-ارز ابیض-دیل-سلطه خضراء",
    cost: "120",
  },
  { date: "28/08/25", orders: "بطاطس کوركيت-سلطه خضراء", cost: "45" },
  { date: "29/08/25", orders: "بطاطس کوركيت-دیل", cost: "30" },
  { date: "30/08/25", orders: "سلطه خضراء", cost: "10" },
  { date: "01/09/25", orders: "مکرونه فرن-سلطه خضراء-دیل", cost: "55" },
  { date: "02/09/25", orders: "فراخ مشویه-ریخ فرخه-پنجر", cost: "100" },
  { date: "03/09/25", orders: "پنجر-دیل", cost: "20" },
];

const OrdersList = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { dates } = useParams();

  useEffect(() => {
    if (!dates) {
      navigate("/user/orders", { replace: true }); // redirect safely
    }
  }, [dates, navigate]);

  if (!dates) return null;

  // dates format: DD-MM-YYYY_DD-MM-YYYY
  const decoded = decodeURIComponent(dates || "");
  const [from, to] = decoded.split("_");

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Table>
          <TableHeader
            columns={[
              { label: "Date", key: "date" },
              { label: "ORDERS", key: "orders" },
              { label: "Cost", key: "cost" },
            ]}
          />
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow key={index} isEven={index % 2 === 0}>
                <TableCell>{row.date}</TableCell>
                <TableCell className="text-right" dir="rtl">
                  {row.orders}
                </TableCell>
                <TableCell>{row.cost}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrdersList;

// Updated UsersPage.jsx with table alignment fixes, edit button, and modal

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getVerifiedUser, readToken, userDetailed } from "../../lib/apis";
import toast from "react-hot-toast";
import Table from "../../components/user/orders-list/table";
import TableHeader from "../../components/user/orders-list/table-header";
import TableBody from "../../components/user/orders-list/table-body";
import TableRow from "../../components/user/orders-list/table-row";
import TableCell from "../../components/user/orders-list/table-cell";
import { IoClose } from "react-icons/io5";
import { RiMoreFill } from "react-icons/ri";
import SearchBar from "../../components/admin/menu/search-bar";
import { downloadOrdersExcel } from "../../lib/utils";

const UsersPage = () => {
  const navigate = useNavigate();
  const { dates } = useParams();
  const [tableData, setTableData] = useState({ users: [], period: {} });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredItems = useMemo(() => {
    let filtered = tableData.users;
    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((item) =>
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(term)
        )
      );
    }

    return filtered;
  }, [tableData, searchTerm]);

  useEffect(() => {
    if (!dates) {
      navigate("/accountant", { replace: true });
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

        const decoded = decodeURIComponent(dates || "");
        const [fromStr, toStr] = decoded.split("_");

        const convertToISO = (dateStr) => {
          const [day, month, year] = dateStr.split("-");
          return `${year}-${month}-${day}`;
        };

        const from = convertToISO(fromStr);
        const to = convertToISO(toStr);

        const res = await userDetailed(from, to);
        if (res && res.error) {
          toast.error(res.error);
          setTableData([]);
          setLoading(false);
          return;
        }

        setTableData(res);
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.error("Failed to load orders");
        setTableData([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [dates]);

  const openModal = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const getOrderItemsText = (items) => {
    if (!items) return "-";

    // ✅ Case 1: Normal array
    if (Array.isArray(items)) {
      return items.map((i) => i.item_name).join(" - ");
    }

    // ✅ Case 2: Lunch object { protein:[], carbs:[], ... }
    if (typeof items === "object") {
      return Object.values(items) // take all category arrays
        .flat() // merge into single array
        .map((i) => i.item_name) // extract names
        .join(" - ");
    }

    return "-";
  };

  return (
    <div className="p-4 md:p-8">
      {/* Search Bar & Export Button */}
      <div className="flex gap-2.5 mb-6 items-center px-2">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <button onClick={() => downloadOrdersExcel(tableData)} className="">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-9 h-9"
            viewBox="0 0 48 48"
            fill="none">
            <path
              fill="#4CAF50"
              d="M41,10H25v28h16c0.553,0,1-0.447,1-1V11C42,10.447,41.553,10,41,10z"></path>
            <path
              fill="#FFF"
              d="M32 15H39V18H32zM32 25H39V28H32zM32 30H39V33H32zM32 20H39V23H32zM25 15H30V18H25zM25 25H30V28H25zM25 30H30V33H25zM25 20H30V23H25z"></path>
            <path fill="#2E7D32" d="M27 42L6 38 6 10 27 6z"></path>
            <path
              fill="#FFF"
              d="M19.129,31l-2.411-4.561c-0.092-0.171-0.186-0.483-0.284-0.938h-0.037c-0.046,0.215-0.154,0.541-0.324,0.979L13.652,31H9.895l4.462-7.001L10.274,17h3.837l2.001,4.196c0.156,0.331,0.296,0.725,0.42,1.179h0.04c0.078-0.271,0.224-0.68,0.439-1.22L19.237,17h3.515l-4.199,6.939l4.316,7.059h-3.74V31z"></path>
          </svg>
        </button>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto bg-[#DDDBDB]">
        {tableData.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500 text-lg">
              No orders found for this date range
            </p>
          </div>
        ) : (
          <Table className="w-full table-fixed">
            <TableHeader
              className={
                "bg-[#DDDBDB] border-b border-b-[#ACA4A4] text-[#072A57]! "
              }
              columns={[...columns, { label: "", key: "actions" }]}
            />
            <TableBody>
              {filteredItems.map((row, index) => (
                <TableRow key={row.id} isEven={index % 2 === 0}>
                  {columns.map((col, i) => (
                    <TableCell className="text-[#072A57]!" key={i}>
                      {col.key === "date"
                        ? `${tableData?.period?.from_date} — ${tableData?.period?.to_date}`
                        : row[col.key]}
                    </TableCell>
                  ))}

                  <TableCell>
                    <button onClick={() => openModal(row)} className="">
                      <RiMoreFill className="w-5 h-5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* ------------------ MODAL ------------------ */}
      {modalOpen && (
        <div className="fixed inset-0 bg-[#868686]/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 relative">
            <button
              className="absolute top-3 right-3 text-2xl text-gray-700 hover:text-black"
              onClick={closeModal}>
              <IoClose />
            </button>

            <h2 className="text-xl font-semibold mb-4">
              Orders for {selectedUser?.name}
            </h2>

            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100 ">
                  <th className="p-2 border">Order Date</th>
                  <th className="p-2 border">Order Items</th>
                  <th className="p-2 border">Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedUser?.orders?.map((o, idx) => (
                  <tr key={idx}>
                    <td className="p-2 border text-center">
                      {o.date_of_order}
                    </td>
                    <td className="p-2 border text-center">
                      {" "}
                      {getOrderItemsText(o.items)}
                    </td>
                    <td className="p-2 border text-center">{o.total_cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const columns = [
  { label: "Date", key: "date" },
  { label: "Full Name", key: "name" },
  { label: "الاسم باللغة العربيه", key: "arabic_name" },
  { label: "E-mail", key: "email" },
  { label: "Total Cost", key: "total_cost" },
];

export default UsersPage;

// Updated UsersPage.jsx with table alignment fixes, edit button, and modal

import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
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

const UsersPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { dates } = useParams();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {tableData.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500 text-lg">
              No orders found for this date range
            </p>
          </div>
        ) : (
          <Table className="w-full table-fixed">
            <TableHeader
              columns={[...columns, { label: "", key: "actions" }]}
            />

            <TableBody>
              {tableData.users.map((row, index) => (
                <TableRow key={row.id} isEven={index % 2 === 0}>
                  {columns.map((col, i) => (
                    <TableCell key={i}>{row[col.key]}</TableCell>
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
                <tr className="bg-gray-100">
                  <th className="p-2 border">Order Date</th>
                  <th className="p-2 border">Items Count</th>
                  <th className="p-2 border">Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedUser?.orders?.map((o, idx) => (
                  <tr key={idx}>
                    <td className="p-2 border">{o.date_of_order}</td>
                    <td className="p-2 border">
                      {" "}
                      {o.items.map((i) => i.item_name).join(" - ")}
                    </td>
                    <td className="p-2 border">{o.total_cost}</td>
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

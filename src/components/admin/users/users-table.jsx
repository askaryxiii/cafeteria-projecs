import { useState, useMemo, useEffect } from "react";
import CreateUserModal from "./create-user-modal";
import EditUserModal from "./edit-user-modal";
import DeleteConfirmModal from "./delete-confirm-modal";
import { Plus } from "lucide-react";
import { FaUserGroup } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { RiPencilFill } from "react-icons/ri";
import { MdDelete, MdArrowUpward } from "react-icons/md";
import { getAllUsers, deleteUser } from "../../../lib/apis";
import toast from "react-hot-toast";
import DashboardHeader from "../../../layouts/navbar/admin/DashboardHeader";
import SearchBar from "../menu/search-bar";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const result = await getAllUsers();
      if (result?.error) {
        toast.error(result.error);
        setUsers([]);
      } else {
        setUsers(
          (Array.isArray(result) ? result : []).map((user) => ({
            id: user.id,
            name: user.name,
            arabic_name: user.arabic_name,
            email: user.email,
            role: user.role || "employee",
          }))
        );
      }
      setIsLoading(false);
    };
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    let filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.arabic_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (sortConfig.direction === "asc") {
        return aVal.localeCompare(bVal);
      }
      return bVal.localeCompare(aVal);
    });

    return filtered;
  }, [users, searchTerm, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleDeleteUser = async () => {
    if (!deletingUserId) return;
    const result = await deleteUser(deletingUserId);
    if (result?.error) {
      toast.error(result.error);
    } else {
      setUsers(users.filter((u) => u.id !== deletingUserId));
      toast.success("User deleted successfully");
    }
    setDeletingUserId(null);
  };

  return (
    <div className="w-full bg-[#E2E2E2]">
      <DashboardHeader
        title="Users"
        dist="/"
        icon={<FaUserGroup className="w-8 h-8 text-[#02356A]" />}
      />

      {isLoading && (
        <div className="p-6 text-center text-gray-500">Loading users...</div>
      )}

      {!isLoading && (
        <div>
          {/* Controls */}
          <div className="px-4 py-3 flex flex-wrap gap-3 bg-mid-grey">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 max-h-9 border border-light-grey bg-primary-navy text-light-grey hover:bg-navy-light">
              <Plus className="w-4 h-4" />
              Create New User
            </button>

            <SearchBar value={searchTerm} onChange={setSearchTerm} />

            <div className="px-4 max-h-9 border flex gap-2 justify-center items-center border-primary-navy bg-[#D9D9D9] text-primary-navy">
              Showing{" "}
              <span className="font-semibold">{filteredUsers.length}</span>{" "}
              users
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto p-3 bg-mid-grey">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="bg-burned-grey">
                  {[
                    { key: "name", label: "Full Name" },
                    { key: "arabic_name", label: "الاسم بالعربية" },
                    { key: "email", label: "E-mail" },
                  ].map((col) => (
                    <th
                      key={col.key}
                      className="px-4 py-3 text-center text-primary-navy ">
                      <button
                        onClick={() => handleSort(col.key)}
                        className="flex w-full items-center gap-2 justify-center whitespace-nowrap">
                        {col.label}
                        <MdArrowUpward
                          className={`transition ${
                            sortConfig.key === col.key &&
                            sortConfig.direction === "desc"
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </button>
                    </th>
                  ))}

                  {/* 🔒 LOCKED ACTIONS COLUMN */}
                  <th className="px-4 py-3 text-center text-primary-navy w-[110px]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b items-center text-center bg-light-grey hover:bg-mid-grey">
                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 w-full">
                        <FaUserCircle className="text-primary-navy" />
                        <span className="text-primary-navy font-medium truncate sm:whitespace-nowrap sm:overflow-visible">
                          {user.name}
                        </span>
                      </div>
                    </td>

                    {/* Arabic Name */}
                    <td className="px-4 py-3 text-right">
                      <span className="text-primary-navy font-medium truncate sm:whitespace-nowrap sm:overflow-visible">
                        {user.arabic_name}
                      </span>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3">
                      <span className="text-primary-navy truncate sm:whitespace-nowrap sm:overflow-visible">
                        {user.email}
                      </span>
                    </td>

                    {/* 🔒 Actions */}
                    <td className="px-4 py-3 w-[110px]">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => setEditingUser(user)}>
                          <RiPencilFill className="text-primary-navy w-5 h-5" />
                        </button>
                        <button onClick={() => setDeletingUserId(user.id)}>
                          <MdDelete className="text-primary-navy w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateUserModal onClose={() => setIsCreateModalOpen(false)} />
      )}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}
      {deletingUserId && (
        <DeleteConfirmModal
          onConfirm={handleDeleteUser}
          onCancel={() => setDeletingUserId(null)}
        />
      )}
    </div>
  );
}

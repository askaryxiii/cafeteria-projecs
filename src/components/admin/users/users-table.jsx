import { useState, useMemo, useEffect } from "react";
import CreateUserModal from "./create-user-modal";
import EditUserModal from "./edit-user-modal";
import DeleteConfirmModal from "./delete-confirm-modal";
import { Search, Plus } from "lucide-react";
import { ImHome } from "react-icons/im";
import { FaUserGroup } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { RiPencilFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { MdArrowUpward } from "react-icons/md";
import { getAllUsers, deleteUser } from "../../../lib/apis";
import toast from "react-hot-toast";
import DashboardHeader from "../../../layouts/navbar/admin/DashboardHeader";

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

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const result = await getAllUsers();
      if (result.error) {
        toast.error(result.error);
        setUsers([]);
      } else {
        // Transform API response to match component structure
        const transformedUsers = (Array.isArray(result) ? result : []).map(
          (user) => ({
            id: user.id,
            name: user.name,
            arabic_name: user.arabic_name,
            email: user.email,
            password: user.password_hash,
            role: user.role || "employee",
          })
        );
        setUsers(transformedUsers);
      }
      setIsLoading(false);
    };

    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    let filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.arabic_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort users
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === "string") {
        if (sortConfig.direction === "asc") {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      } else {
        if (sortConfig.direction === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      }
    });

    return filtered;
  }, [users, searchTerm, sortConfig]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleCreateUser = (userData) => {
    const newUser = {
      ...userData,
      id: Date.now().toString(),
    };
    setUsers([...users, newUser]);
    setIsCreateModalOpen(false);
  };

  const handleEditUser = (userData) => {
    setUsers(users.map((u) => (u.id === userData.id ? userData : u)));
    setEditingUser(null);
  };

  const handleDeleteUser = async () => {
    if (deletingUserId) {
      const result = await deleteUser(deletingUserId);
      if (result.error) {
        toast.error(result.error);
      } else {
        setUsers(users.filter((u) => u.id !== deletingUserId));
        toast.success("User deleted successfully");
      }
      setDeletingUserId(null);
    }
  };

  return (
    <div className="w-full bg-[#E2E2E2]">
      {/* Header */}
      <DashboardHeader
        title="Users"
        dist="/"
        icon={<FaUserGroup className="w-8 h-8 text-[#02356A]" />}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="p-4 sm:p-6 md:p-8 text-center text-gray-500 text-sm sm:text-base">
          Loading users...
        </div>
      )}

      {!isLoading && (
        <>
          {/* Controls */}
          <div className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 border-b flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 border border-[#072A57] shadow-lg bg-[#D9D9D9] text-[#072A57] hover:bg-[#b9b9b9] transition-colors font-normal text-xs sm:text-sm md:text-base min-h-9 sm:min-h-10 md:min-h-11 justify-center sm:justify-start whitespace-nowrap">
              <Plus className="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5" />
              Create New User
            </button>
            <div className="flex-1 relative shadow-lg">
              <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1 sm:py-1.5 md:py-2 border border-[#072A57] bg-[#D9D9D9] focus:outline-none text-xs sm:text-sm md:text-base min-h-9 sm:min-h-10 md:min-h-11"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm md:text-base">
              <thead>
                <tr className="bg-[#DDDBDB]">
                  <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-center font-medium text-[#072A57] cursor-pointer hover:bg-[#c5c3c3] transition min-w-24 sm:min-w-32">
                    <button
                      className="flex items-center gap-1 sm:gap-2 w-full justify-center"
                      onClick={() => handleSort("name")}>
                      Full Name
                      <MdArrowUpward
                        className={`w-3 sm:w-4 h-3 sm:h-4 text-gray-600 transition ${
                          sortConfig.key === "name" &&
                          sortConfig.direction === "desc"
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>
                  </th>
                  <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-center font-medium text-[#072A57] cursor-pointer hover:bg-[#c5c3c3] transition min-w-24 sm:min-w-32">
                    <button
                      className="flex items-center justify-center gap-1 sm:gap-2 w-full"
                      onClick={() => handleSort("arabic_name")}>
                      الاسم بالعربية
                      <MdArrowUpward
                        className={`w-3 sm:w-4 h-3 sm:h-4 text-gray-600 transition ${
                          sortConfig.key === "arabic_name" &&
                          sortConfig.direction === "desc"
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>
                  </th>
                  <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-center font-medium text-[#072A57] cursor-pointer hover:bg-[#c5c3c3] transition min-w-32 sm:min-w-40">
                    <button
                      className="flex items-center gap-1 sm:gap-2 w-full justify-center"
                      onClick={() => handleSort("email")}>
                      E-mail
                      <MdArrowUpward
                        className={`w-3 sm:w-4 h-3 sm:h-4 text-gray-600 transition ${
                          sortConfig.key === "email" &&
                          sortConfig.direction === "desc"
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>
                  </th>
                  <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-center font-medium text-[#072A57]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`border-b border-[#A9AFBAB2] ${
                      index % 2 === 0 ? "bg-[#E9E7E7]" : "bg-[#E9E7E7]"
                    } hover:bg-[#dadada] transition-colors text-xs sm:text-sm md:text-base`}>
                    <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                      <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                        <div className="flex items-center justify-center shrink-0">
                          <FaUserCircle className="w-4 sm:w-5 h-4 sm:h-5 text-[#072A57]" />
                        </div>
                        <span className="text-[#072A57] font-medium truncate">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2 md:gap-3">
                        <span className="text-[#072A57] font-medium truncate">
                          {user.arabic_name}
                        </span>
                        <div className="flex items-center justify-center shrink-0">
                          <FaUserCircle className="w-4 sm:w-5 h-4 sm:h-5 text-[#072A57]" />
                        </div>
                      </div>
                    </td>
                    <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                      <span className="text-[#072A57] truncate block">
                        {user.email}
                      </span>
                    </td>
                    <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2 md:gap-3">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="p-1 sm:p-1.5 md:p-2 hover:scale-110 transition min-h-8 sm:min-h-9 md:min-h-10 flex items-center justify-center"
                          title="Edit user">
                          <RiPencilFill className="w-4 sm:w-5 h-4 sm:h-5 text-[#072A57]" />
                        </button>
                        <button
                          onClick={() => setDeletingUserId(user.id)}
                          className="p-1 sm:p-1.5 md:p-2 hover:scale-110 transition min-h-8 sm:min-h-9 md:min-h-10 flex items-center justify-center"
                          title="Delete user">
                          <MdDelete className="w-4 sm:w-5 h-4 sm:h-5 text-[#072A57]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* No results message */}
          {filteredUsers.length === 0 && !isLoading && (
            <div className="p-4 sm:p-6 md:p-8 text-center text-gray-500 text-sm sm:text-base">
              No users found matching your search.
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateUserModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateUser}
        />
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSubmit={handleEditUser}
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

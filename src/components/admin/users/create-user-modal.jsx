import { useState, useContext } from "react";
import { IoMdClose } from "react-icons/io";
import AuthContext from "../../../context/AuthContext";
import toast from "react-hot-toast";
import { getCurrentTime } from "../../../lib/apis";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Button } from "../../../components/ui/button";

export default function CreateUserModal({ onClose, onSubmit }) {
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    arabic_name: "",
    email: "",
    password: "",
    role: "employee",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Available roles
  const roles = [
    { value: "employee", label: "Employee" },
    { value: "chef", label: "Chef" },
    { value: "cafeteria", label: "Cafeteria" },
    { value: "accountant", label: "Accountant" },
    { value: "admin", label: "Admin" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.name &&
      formData.arabic_name &&
      formData.email &&
      formData.password &&
      formData.role
    ) {
      setIsLoading(true);

      try {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          arabic_name: formData.arabic_name,
          role: formData.role,
        });

        toast.success("User created successfully");
        setIsLoading(false);
        onSubmit({
          id: getCurrentTime().getTime().toString(),
          ...formData,
        });
        onClose();
      } catch (err) {
        toast.error(err.message || "Failed to create user");
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-[#868686]/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-[#D9D9D9] rounded-sm w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 sticky top-0 bg-[#D9D9D9]">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Create New User
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors min-h-9 flex items-center justify-center">
            <IoMdClose className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-[#072A57] mb-1.5 sm:mb-2">
              User Role
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={
                    "bg-[#AEAEAE] py-1 sm:py-1.5 px-3 sm:px-5 w-full justify-start text-xs sm:text-sm min-h-9 sm:min-h-10"
                  }>
                  {roles.find((r) => r.value === formData.role)?.label ||
                    "Select Role"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 sm:w-56" align="start">
                <DropdownMenuLabel className="text-xs sm:text-sm">
                  Select User Role
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {roles.map((role) => (
                  <div
                    key={role.value}
                    className="flex items-center px-1.5 sm:px-2 py-1.5 sm:py-2 cursor-pointer hover:bg-gray-100 min-h-9"
                    onClick={() =>
                      setFormData({ ...formData, role: role.value })
                    }>
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={formData.role === role.value}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="w-3.5 sm:w-4 h-3.5 sm:h-4 cursor-pointer"
                    />
                    <label className="ml-1.5 sm:ml-2 cursor-pointer text-xs sm:text-sm font-medium">
                      {role.label}
                    </label>
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-[#072A57] mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border bg-[#072A57] text-[#C9C9CA] border-gray-300 rounded-sm focus:outline-none text-xs sm:text-sm min-h-9 sm:min-h-10"
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-[#072A57] mb-1">
              الاسم بالعربية
            </label>
            <input
              type="text"
              value={formData.arabic_name}
              onChange={(e) =>
                setFormData({ ...formData, arabic_name: e.target.value })
              }
              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border bg-[#072A57] text-[#C9C9CA] border-gray-300 rounded-sm focus:outline-none text-right text-xs sm:text-sm min-h-9 sm:min-h-10"
              placeholder="الاسم بالعربية"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-[#072A57] mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border bg-[#072A57] text-[#C9C9CA] border-gray-300 rounded-sm focus:outline-none text-xs sm:text-sm min-h-9 sm:min-h-10"
              placeholder="Enter email"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-[#072A57] mb-1">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border bg-[#072A57] text-[#C9C9CA] border-gray-300 rounded-sm focus:outline-none text-xs sm:text-sm min-h-9 sm:min-h-10"
              placeholder="Enter password"
              required
            />
          </div>

          <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4 justify-center">
            <button
              type="button"
              onClick={onClose}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#D9D9D9] text-[#072A57] border border-[#072A57] rounded-sm hover:bg-[#b9b9b9] transition-colors font-medium text-xs sm:text-sm min-h-9 sm:min-h-10">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#D9D9D9] text-[#072A57] border border-[#072A57] rounded-sm hover:bg-[#b3b3b3] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm min-h-9 sm:min-h-10">
              {isLoading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

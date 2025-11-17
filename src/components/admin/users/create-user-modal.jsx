import { useState, useContext } from "react";
import { IoMdClose } from "react-icons/io";
import AuthContext from "../../../context/AuthContext";
import toast from "react-hot-toast";
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
          id: Date.now().toString(),
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#D9D9D9] rounded-sm  w-full max-w-md">
        <div className="flex items-center justify-between p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Create New User
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors">
            <IoMdClose className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#072A57] mb-2">
              User Role
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={"bg-[#AEAEAE] py-1 px-5 w-full justify-start"}>
                  {roles.find((r) => r.value === formData.role)?.label ||
                    "Select Role"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>Select User Role</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {roles.map((role) => (
                  <div
                    key={role.value}
                    className="flex items-center px-2 py-2 cursor-pointer hover:bg-gray-100"
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
                      className="w-4 h-4 cursor-pointer"
                    />
                    <label className="ml-2 cursor-pointer text-sm font-medium">
                      {role.label}
                    </label>
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#072A57] mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border bg-[#072A57] text-[#C9C9CA] border-gray-300 rounded-sm focus:outline-none "
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#072A57] mb-1">
              الاسم بالعربية
            </label>
            <input
              type="text"
              value={formData.arabic_name}
              onChange={(e) =>
                setFormData({ ...formData, arabic_name: e.target.value })
              }
              className="w-full px-3 py-2 border bg-[#072A57] text-[#C9C9CA] border-gray-300 rounded-sm focus:outline-none text-right "
              placeholder="الاسم بالعربية"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#072A57] mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 border bg-[#072A57] text-[#C9C9CA] border-gray-300 rounded-sm focus:outline-none "
              placeholder="Enter email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#072A57] mb-1">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-3 py-2 border bg-[#072A57] text-[#C9C9CA] border-gray-300 rounded-sm focus:outline-none "
              placeholder="Enter password"
              required
            />
          </div>

          <div className="flex gap-3 pt-4 justify-center">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#D9D9D9] text-[#072A57] border border-[#072A57] rounded-sm hover:bg-[#b9b9b9] transition-colors font-medium">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-[#D9D9D9] text-[#072A57] border border-[#072A57] rounded-sm hover:bg-[#b3b3b3] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

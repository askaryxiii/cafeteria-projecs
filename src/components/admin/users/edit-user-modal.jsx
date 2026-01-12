import { useState } from "react";
import { IoMdClose, IoMdEye, IoMdEyeOff } from "react-icons/io";
import { editUser } from "../../../lib/apis";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Button } from "../../../components/ui/button";

export default function EditUserModal({ user, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: user.name || "",
    arabic_name: user.arabic_name || "",
    email: user.email || "",
    password: "", // ✅ always empty
    role: user.role || "employee",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const roles = [
    { value: "employee", label: "Employee" },
    { value: "chef", label: "Chef" },
    { value: "cafeteria", label: "Cafeteria" },
    { value: "accountant", label: "Accountant" },
    { value: "admin", label: "Admin" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.arabic_name || !formData.email) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsLoading(true);

    // ✅ Only send password if user typed a new one
    const userData = {
      name: formData.name,
      arabic_name: formData.arabic_name,
      email: formData.email,
      role: formData.role,
    };

    if (formData.password.trim() !== "") {
      userData.password = formData.password;
    }

    const result = await editUser(user.id, userData);

    if (result?.error) {
      toast.error(result.error);
      setIsLoading(false);
      return;
    }

    toast.success("User updated successfully");
    setIsLoading(false);

    onSubmit({
      ...user,
      ...userData,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-[#D9D9D9] rounded-sm w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sticky top-0 bg-[#D9D9D9]">
          <h2 className="text-lg font-semibold text-gray-900">Edit User</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <IoMdClose className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-[#072A57] mb-1">
              User Role
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-[#AEAEAE] w-full justify-start text-sm">
                  {roles.find((r) => r.value === formData.role)?.label}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Select User Role</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {roles.map((role) => (
                  <DropdownMenuItem
                    key={role.value}
                    onClick={() =>
                      setFormData({ ...formData, role: role.value })
                    }>
                    {role.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Full Name */}
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
              className="w-full px-3 py-2 bg-[#072A57] text-[#C9C9CA] rounded-sm"
              required
            />
          </div>

          {/* Arabic Name */}
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
              className="w-full px-3 py-2 bg-[#072A57] text-[#C9C9CA] rounded-sm text-right"
              required
            />
          </div>

          {/* Email */}
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
              className="w-full px-3 py-2 bg-[#072A57] text-[#C9C9CA] rounded-sm"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#072A57] mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-3 py-2 pr-10 bg-[#072A57] text-[#C9C9CA] rounded-sm"
                placeholder="Leave empty to keep current password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300">
                {showPassword ? (
                  <IoMdEyeOff size={20} />
                ) : (
                  <IoMdEye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-[#072A57] text-[#072A57] rounded-sm hover:bg-gray-300 disabled:opacity-50">
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

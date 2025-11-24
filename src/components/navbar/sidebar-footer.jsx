import { TbLogout } from "react-icons/tb";
import { SidebarItem } from "./sidebar-item";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

export function SidebarFooter({ onItemClick }) {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    onItemClick?.(); // Close drawer if onItemClick is provided
    logout();
  };

  return (
    <div className="p-2 sm:p-3 md:p-4 border-t border-gray-200">
      <SidebarItem Icon={TbLogout} label="Logout" onclickfunc={handleLogout} />
    </div>
  );
}

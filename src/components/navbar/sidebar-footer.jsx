import { TbLogout } from "react-icons/tb";
import { SidebarItem } from "./sidebar-item";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

export function SidebarFooter({ isExpanded }) {
  const { logout } = useContext(AuthContext);
  return (
    <div className="p-2 sm:p-3 md:p-4 border-t border-gray-200">
      <SidebarItem
        Icon={TbLogout}
        label="Logout"
        isExpanded={isExpanded}
        onclickfunc={logout}
      />
    </div>
  );
}

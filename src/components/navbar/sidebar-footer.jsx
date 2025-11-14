import { TbLogout } from "react-icons/tb";
import { SidebarItem } from "./sidebar-item";

export function SidebarFooter({ isExpanded }) {
  return (
    <div className="p-4 border-t border-gray-200">
      <SidebarItem Icon={TbLogout} label="Logout" isExpanded={isExpanded} />
    </div>
  );
}

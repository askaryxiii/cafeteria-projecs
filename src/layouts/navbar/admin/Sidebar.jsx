import { useContext } from "react";
import { FaUserGroup } from "react-icons/fa6";
import { PiChefHatBold, PiForkKnifeFill, PiBankFill } from "react-icons/pi";
import { TbMenu3 } from "react-icons/tb";
import { MdSettings, MdDashboard } from "react-icons/md";

import { SidebarHeader } from "../../../components/navbar/sidebar-header";
import { SidebarNav } from "../../../components/navbar/sidebar-nav";
import { SidebarFooter } from "../../../components/navbar/sidebar-footer";
import { cn } from "../../../lib/utils";
import AuthContext from "../../../context/AuthContext";

export function Sidebar({
  isExpanded,
  setIsExpanded,
  onSelectMenu,
  selectedMenuItem,
}) {
  const { logout } = useContext(AuthContext);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: MdDashboard },
    { id: "users", label: "Users", icon: FaUserGroup },
    { id: "chef", label: "Chef", icon: PiChefHatBold },
    { id: "cafeteria", label: "Cafeteria", icon: PiForkKnifeFill },
    { id: "accounts", label: "Accounts", icon: PiBankFill },
    { id: "menu", label: "Menu Items", icon: TbMenu3 },
    { id: "settings", label: "Settings", icon: MdSettings },
  ];

  return (
    <div
      className={cn(
        " row-start-2 min-h-screen flex flex-col bg-[#EFEFEF] border-r border-[#9C9393] transition-all duration-300",
        isExpanded ? "w-16 md:w-20 lg:w-64" : "w-16 md:w-20"
      )}>
      <SidebarHeader
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
      />
      <SidebarNav
        menuItems={menuItems}
        isExpanded={isExpanded}
        onSelectMenu={onSelectMenu}
        selectedMenuItem={selectedMenuItem}
      />
      <SidebarFooter isExpanded={isExpanded} />
    </div>
  );
}

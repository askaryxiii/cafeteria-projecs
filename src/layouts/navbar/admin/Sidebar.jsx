import { useContext, useState } from "react";
import { FaUserGroup } from "react-icons/fa6";
import { PiChefHatBold, PiForkKnifeFill, PiBankFill } from "react-icons/pi";
import { TbMenu3 } from "react-icons/tb";
import { MdSettings } from "react-icons/md";

import { SidebarHeader } from "../../../components/navbar/sidebar-header";
import { SidebarNav } from "../../../components/navbar/sidebar-nav";
import { SidebarFooter } from "../../../components/navbar/sidebar-footer";
import { cn } from "../../../lib/utils";
import AuthContext from "../../../context/AuthContext";

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const { user, logout } = useContext(AuthContext);

  const menuItems = [
    { label: "Users", icon: FaUserGroup },
    { label: "Chef", icon: PiChefHatBold },
    { label: "Cafeteria", icon: PiForkKnifeFill },
    { label: "Accounts", icon: PiBankFill },
    { label: "Menu Items", icon: TbMenu3 },
    { label: "Settings", icon: MdSettings },
  ];

  return (
    <div
      className={cn(
        " row-start-2 flex flex-col h-screen bg-gray-100 border-r border-gray-200 transition-all duration-300",
        isExpanded ? "w-16 md:w-20 lg:w-64" : "w-16 md:w-20"
      )}>
      <SidebarHeader
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
      />
      <SidebarNav menuItems={menuItems} isExpanded={isExpanded} />
      <SidebarFooter isExpanded={isExpanded} />
    </div>
  );
}

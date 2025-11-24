import { Link } from "react-router-dom";

import { SidebarHeader } from "../../../components/navbar/sidebar-header";
import { SidebarNav } from "../../../components/navbar/sidebar-nav";
import { SidebarFooter } from "../../../components/navbar/sidebar-footer";
import { cn } from "../../../lib/utils";

export function Sidebar({ selectedMenuItem, isMobile, menuItems }) {
  // Desktop sidebar with fixed widths
  return (
    <div className="w-20 md:w-20 lg:w-64 min-h-screen flex flex-col bg-[#EFEFEF] border-r border-[#9C9393]">
      <SidebarHeader />
      <SidebarNav menuItems={menuItems} selectedMenuItem={selectedMenuItem} />
      <SidebarFooter />
    </div>
  );
}

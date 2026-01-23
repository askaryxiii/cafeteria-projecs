import { SidebarNav } from "../../../components/navbar/sidebar-nav";
import { SidebarFooter } from "../../../components/navbar/sidebar-footer";

export function Sidebar({ selectedMenuItem, isMobile, menuItems }) {
  // Desktop sidebar with fixed widths
  return (
    <div className="w-20 md:w-20 lg:w-64 min-h-screen flex flex-col bg-light-grey border-r border-mid-grey">
      <SidebarNav menuItems={menuItems} selectedMenuItem={selectedMenuItem} />
      <SidebarFooter />
    </div>
  );
}

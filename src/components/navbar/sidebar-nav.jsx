import { Link } from "react-router-dom";
import { SidebarItem } from "./sidebar-item";

export function SidebarNav({ menuItems, selectedMenuItem, onItemClick }) {
  return (
    <nav className="flex-1 p-2 sm:p-3 md:p-4 flex flex-col gap-1.5 overflow-y-auto">
      {menuItems.map(({ path, id, icon, label }) => (
        <Link key={id} to={path} className="no-underline" onClick={onItemClick}>
          <SidebarItem
            Icon={icon}
            label={label}
            isActive={selectedMenuItem === id}
          />
        </Link>
      ))}
    </nav>
  );
}

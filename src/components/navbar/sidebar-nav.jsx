import { SidebarItem } from "./sidebar-item";

export function SidebarNav({
  menuItems,
  isExpanded,
  onSelectMenu,
  selectedMenuItem,
}) {
  return (
    <nav className="flex-1 p-2 sm:p-3 md:p-4 space-y-1 sm:space-y-1.5 md:space-y-2 overflow-y-auto">
      {menuItems.map((item) => (
        <SidebarItem
          key={item.id}
          Icon={item.icon}
          label={item.label}
          isExpanded={isExpanded}
          onclickfunc={() => onSelectMenu(item.id)}
          isActive={selectedMenuItem === item.id}
        />
      ))}
    </nav>
  );
}

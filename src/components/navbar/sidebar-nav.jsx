import { SidebarItem } from './sidebar-item'

export function SidebarNav({ menuItems, isExpanded }) {
  return (
    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
      {menuItems.map((item) => (
        <SidebarItem
          key={item.label}
          Icon={item.icon}
          label={item.label}
          isExpanded={isExpanded}
        />
      ))}
    </nav>
  )
}

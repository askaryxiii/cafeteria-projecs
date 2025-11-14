import { cn } from "../../lib/utils";


export function SidebarItem({ Icon, label, isExpanded }) {
  return (
    <button
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
        'hover:bg-gray-200 text-gray-700 font-medium',
        isExpanded ? 'justify-start' : 'justify-center'
      )}
      title={!isExpanded ? label : undefined}
      aria-label={label}
    >
      <Icon size={20} className="shrink-0" />
      {isExpanded && <span className="truncate">{label}</span>}
    </button>
  )
}

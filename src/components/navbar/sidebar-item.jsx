import { cn } from "../../lib/utils";

export function SidebarItem({
  Icon,
  label,
  isExpanded,
  onclickfunc,
  isActive,
}) {
  return (
    <button
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
        "text-gray-700 font-medium",
        isActive ? " bg-gray-200" : "hover:bg-gray-200",
        isExpanded ? "justify-start" : "justify-center"
      )}
      onClick={onclickfunc}
      title={!isExpanded ? label : undefined}
      aria-label={label}>
      <Icon size={20} className="shrink-0" />
      {isExpanded && <span className="truncate">{label}</span>}
    </button>
  );
}

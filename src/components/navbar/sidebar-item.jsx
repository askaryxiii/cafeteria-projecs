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
        "w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-lg transition-all duration-200 min-h-10 sm:min-h-11 md:min-h-12",
        "text-xs sm:text-sm md:text-base text-gray-700 font-medium",
        isActive ? " bg-gray-200" : "hover:bg-gray-200",
        isExpanded ? "justify-start" : "justify-center"
      )}
      onClick={onclickfunc}
      title={!isExpanded ? label : undefined}
      aria-label={label}>
      <Icon
        size={20}
        className="shrink-0 w-4 sm:w-5 md:w-5 h-4 sm:h-5 md:h-5"
      />
      {isExpanded && (
        <span className="truncate text-xs sm:text-sm md:text-base">
          {label}
        </span>
      )}
    </button>
  );
}

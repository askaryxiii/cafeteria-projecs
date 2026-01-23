import { cn } from "../../lib/utils";

export function SidebarItem({ Icon, label, onclickfunc, isActive }) {
  return (
    <button
      className={cn(
        "w-full flex items-center gap-3 px-3 md:px-4 rounded-sm transition-all duration-200 min-h-8 md:min-h-10",
        "text-xs sm:text-sm md:text-base text-text-dark font-medium",
        isActive ? " bg-burned-grey" : "hover:bg-mid-grey",
        "justify-start"
      )}
      onClick={onclickfunc}
      aria-label={label}>
      <Icon size={20} className="shrink-0 w-6 md:w-6 h-6 md:h-6" />
      <span className="truncate inline text-lg md:text-base">{label}</span>
    </button>
  );
}

import { CgArrowsExchangeAlt } from "react-icons/cg";

import { FaUserGroup } from "react-icons/fa6";

export function SidebarHeader({ isExpanded, onToggle }) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      {isExpanded && (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-gray-600 flex items-center justify-center flex-shrink-0">
            <FaUserGroup size={20} className="text-gray-600" />
          </div>
          <span className="font-semibold text-gray-800 truncate">Admin</span>
        </div>
      )}
      <button
        onClick={onToggle}
        className="p-2 hover:bg-gray-200 rounded-lg transition-colors ml-auto flex-shrink-0"
        aria-label="Toggle sidebar">
        <CgArrowsExchangeAlt size={25} className="text-gray-600" />
      </button>
    </div>
  );
}

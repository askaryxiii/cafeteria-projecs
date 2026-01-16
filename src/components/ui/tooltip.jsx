;
import { MdOutlineInfo } from "react-icons/md";

const ToolTip = ({ text }) => {
  return (
    <div className="relative group inline-flex items-center">
      {/* Info Icon */}
      <MdOutlineInfo className="w-3.5 h-3.5 text-gray-500 cursor-pointer" />
      {/* Tooltip */}
      <div
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs
                    rounded-md bg-gray-900 px-3 py-1.5 text-xs text-white
                    opacity-0 group-hover:opacity-100 transition-opacity
                    pointer-events-none z-50">
        {text}
      </div>
    </div>
  );
};

export default ToolTip;

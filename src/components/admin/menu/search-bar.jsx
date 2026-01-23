import { Search } from "lucide-react";
import { MdClear } from "react-icons/md";

export default function SearchBar({ value, onChange, width, height = "9" }) {
  return (
    <div className={`flex-1 relative shadow-lg h-${height}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#072A57]" />
      <input
        type="text"
        placeholder="Search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-10 h-full border border-[#072A57] bg-burned-grey focus:outline-none"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#072A57] hover:font-bold transition-colors"
          title="Clear search">
          <MdClear className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

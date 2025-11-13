export default function DropdownButton({
  categoryName,
  categoryNameAr,
  isOpen,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative w-full bg-[#032552] hover:bg-blue-900 text-white font-normal py-3 px-6 rounded-lg flex items-center justify-center transition duration-200">
      <span className="text-xl text-center">
        {categoryName} - {categoryNameAr}
      </span>

      <span
        className={`absolute right-6 text-2xl transition-transform duration-200 ${
          isOpen ? "rotate-180" : ""
        }`}>
        ▼
      </span>
    </button>
  );
}

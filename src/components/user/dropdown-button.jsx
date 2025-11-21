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
      className="relative w-full bg-[#032552] hover:bg-blue-900 text-white font-normal py-2 sm:py-2.5 md:py-3 sm:px-5 md:px-6 rounded-lg flex items-center justify-center transition duration-200 min-h-11 sm:min-h-11 md:min-h-12">
      <span className="text-sm sm:text-base md:text-lg lg:text-xl text-center">
        {categoryName} - {categoryNameAr}
      </span>

      <span
        className={`absolute right-4 sm:right-5 md:right-6 text-xl sm:text-2xl md:text-2xl transition-transform duration-200 ${
          isOpen ? "rotate-180" : ""
        }`}>
        ▼
      </span>
    </button>
  );
}

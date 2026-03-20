export default function DropdownButton({
  categoryName,
  categoryNameAr,
  isOpen,
  onClick,
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative w-full ${
        disabled
          ? "bg-gray-400 cursor-not-allowed text-gray-200"
          : "bg-primary-navy text-white"
      } ${
        isOpen ? "rounded-t-lg" : "rounded-lg"
      } font-normal py-2 sm:py-2.5 md:py-3 sm:px-5 md:px-6 flex items-center justify-center transition duration-200 min-h-11 sm:min-h-11 md:min-h-12`}
    >
      <span className="text-sm sm:text-base md:text-lg lg:text-xl text-center">
        {disabled ? "Today is on us 😉" : `${categoryName} - ${categoryNameAr}`}
      </span>

      <span
        className={`absolute right-4 sm:right-5 md:right-6 text-xl sm:text-2xl md:text-2xl transition-transform duration-200 ${
          isOpen ? "rotate-180" : ""
        }`}
      >
        ▼
      </span>
    </button>
  );
}

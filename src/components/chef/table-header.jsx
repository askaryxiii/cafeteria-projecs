export function TableHeader({ label1, label2 }) {
  return (
    <div className="flex bg-burned-grey">
      <div className="w-1/4 px-2 sm:px-3 md:px-6 py-2 sm:py-2.5 md:py-3 font-bold text-gray-900 text-xs sm:text-base md:text-lg lg:text-xl text-center min-h-9 sm:min-h-10 md:min-h-11">
        {label1}
      </div>
      <div className="flex-1 px-2 sm:px-3 md:px-6 py-2 sm:py-2.5 md:py-3 font-bold text-gray-900 text-xs sm:text-base md:text-lg lg:text-xl text-center min-h-9 sm:min-h-10 md:min-h-11">
        {label2}
      </div>
    </div>
  );
}

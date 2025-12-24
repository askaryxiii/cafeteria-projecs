export function TableRow({ num, order, weight }) {
  return (
    <div className="flex border-b border-gray-300">
      <div className="w-1/4 px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-gray-900 font-semibold text-center text-xs sm:text-base md:text-lg min-h-10 sm:min-h-11 md:min-h-12 flex items-center justify-center">
        {num}
      </div>
      <div className="flex-1 px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-gray-700 text-lg md:text-lg lg:text-xl font-semibold text-center min-h-10 sm:min-h-11 md:min-h-12 flex items-center justify-center">
        {order} {weight && `(${weight} جرام)`}
      </div>
    </div>
  );
}

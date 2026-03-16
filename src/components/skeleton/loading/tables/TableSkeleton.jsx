const TableSkeleton = () => {
  return (
    <div className="p-0 md:p-4 lg:p-4 animate-pulse">
      <div className="mb-4">
        <div className="h-7 w-40 bg-gray-300 rounded"></div>
      </div>

      <div className="border-none rounded-lg shadow">
        {/* Desktop Skeleton */}
        <div className="hidden md:block overflow-x-auto rounded-lg">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="border-b-2 border-gray-300 bg-burned-grey">
                <th className="px-4 py-3"></th>
                <th className="px-4 py-3">
                  <div className="h-4 w-24 bg-gray-300 rounded"></div>
                </th>
                <th className="px-4 py-3">
                  <div className="h-4 w-20 bg-gray-300 rounded"></div>
                </th>
                <th className="px-4 py-3">
                  <div className="h-4 w-16 bg-gray-300 rounded"></div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {[...Array(6)].map((_, i) => (
                <tr key={i} className="bg-[#f3f3f3]">
                  <td className="px-4 py-3">
                    <div className="h-5 w-5 bg-gray-300 rounded"></div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="h-5 w-40 bg-gray-300 rounded mb-2"></div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="h-4 w-56 bg-gray-300 rounded"></div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Skeleton */}
        <div className="md:hidden space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="p-4 border rounded-lg bg-white border-gray-200 flex justify-between items-center">
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 bg-gray-300 rounded"></div>

                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-300 rounded"></div>
                  <div className="h-3 w-40 bg-gray-300 rounded"></div>
                </div>
              </div>

              <div className="h-6 w-16 bg-gray-300 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableSkeleton;

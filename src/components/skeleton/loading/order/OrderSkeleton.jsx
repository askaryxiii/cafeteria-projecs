const OrderSkeleton = () => {
  return (
    <div className="px-6 md:px-12 lg:px-32 xl:px-44 py-6 md:py-8 flex flex-col w-full justify-center align-middle animate-pulse">
      {/* Title Skeleton */}
      <div className="flex justify-center mb-6 md:mb-8">
        <div className="h-7 md:h-10 w-56 md:w-120 bg-gray-200 rounded"></div>
      </div>

      <div className="space-y-6 md:space-y-6">
        {/* DishDropdown Skeletons */}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3">
            {/* Dropdown */}
            <div className="h-12 w-full bg-gray-200 rounded-lg"></div>
          </div>
        ))}

        {/* Footer Skeleton */}
        <div className="flex flex-row sm:items-center justify-between pt-4">
          <div className="h-10 w-32 bg-gray-200 rounded"></div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default OrderSkeleton;

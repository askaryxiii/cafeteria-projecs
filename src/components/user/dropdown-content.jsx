import CheckboxItem from "../user/checkbox-item";

export default function DropdownContent({
  items,
  loading,
  selectedIds,
  onChange,
}) {
  if (loading) {
    return (
      <div className="bg-gray-200 border-l-4 border-r-4 border-b-4 border-gray-300 p-3 sm:p-4 md:p-5">
        <div className="text-center text-gray-600 py-3 sm:py-4 md:py-5 animate-pulse text-sm sm:text-base">
          Loading items...
        </div>
      </div>
    );
  }

  if (items?.length === 0) {
    return (
      <div className="bg-gray-200 border-l-4 border-r-4 border-b-4 border-gray-300 p-3 sm:p-4 md:p-5">
        <div className="text-center text-gray-600 py-3 sm:py-4 md:py-5 text-sm sm:text-base">
          No items available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 border-2 rounded-2xl border-gray-300 p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-2.5 md:space-y-3">
      {items.map((item, index) => (
        <div
          key={item.code}
          style={{ animationDelay: `${index * 50}ms` }}
          className="animate-fadeIn">
          {(() => {
            const safeSelected = Array.isArray(selectedIds) ? selectedIds : [];
            return (
              <CheckboxItem
                key={item.code}
                item={item}
                isChecked={safeSelected.includes(item.code)}
                onChange={(isChecked) => {
                  const newValue = isChecked
                    ? [...safeSelected, item.code]
                    : safeSelected.filter((id) => id !== item.code);
                  onChange(newValue);
                }}
              />
            );
          })()}
        </div>
      ))}
    </div>
  );
}

import CheckboxItem from "../user/checkbox-item";

export default function DropdownContent({
  items,
  loading,
  selectedIds,
  onChange,
  isOpen,
  selectionMode = "multiple",
  maxSelections = null,
}) {
  if (loading) {
    return (
      <div className="bg-mid-grey border-2 border-gray-300 rounded-b-lg p-3 sm:p-4 md:p-5 space-y-3 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between pb-4">
            {/* left side (checkbox + text) */}
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 bg-gray-300 rounded-sm"></div>
              <div className="h-7 w-56 bg-gray-300 rounded"></div>
            </div>

            {/* price */}
            <div className="h-7 w-16 bg-gray-300 rounded"></div>
          </div>
        ))}
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

  const handleItemChange = (item, isChecked) => {
    const safeSelected = Array.isArray(selectedIds) ? selectedIds : [];

    if (selectionMode === "single") {
      // Radio-like behavior: only one item can be selected
      if (isChecked) {
        onChange([item.code]);
      } else {
        onChange([]);
      }
    } else if (
      maxSelections &&
      isChecked &&
      safeSelected.length >= maxSelections
    ) {
      // Prevent adding more items if max is reached
      return;
    } else {
      // Multiple selection with optional limit
      const newValue = isChecked
        ? [...safeSelected, item.code]
        : safeSelected.filter((id) => id !== item.code);
      onChange(newValue);
    }
  };

  return (
    <div
      className={`bg-mid-grey border-2 ${
        isOpen ? "rounded-b-lg" : "rounded-lg"
      } border-gray-300 p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-2.5 md:space-y-3`}>
      {items.map((item, index) => (
        <div
          key={item.code}
          style={{ animationDelay: `${index * 50}ms` }}
          className="animate-fadeIn">
          {(() => {
            const safeSelected = Array.isArray(selectedIds) ? selectedIds : [];
            const isChecked = safeSelected.includes(item.code);
            const isDisabled =
              maxSelections &&
              safeSelected.length >= maxSelections &&
              !isChecked;

            return (
              <div
                className={isDisabled ? "opacity-50 cursor-not-allowed" : ""}>
                <CheckboxItem
                  key={item.code}
                  item={item}
                  isChecked={isChecked}
                  onChange={(checked) => handleItemChange(item, checked)}
                  disabled={isDisabled}
                />
              </div>
            );
          })()}
        </div>
      ))}
    </div>
  );
}

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

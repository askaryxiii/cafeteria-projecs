export function CheckboxInput({ checked, onChange, disabled = false }) {
  return (
    <input
      type="checkbox"
      className="checkbox w-4 sm:w-5 md:w-5 h-4 sm:h-5 md:h-5 cursor-pointer bg-gray-50 border border-gray-300 shadow-md disabled:cursor-not-allowed"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
  );
}

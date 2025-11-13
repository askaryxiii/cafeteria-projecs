export function CheckboxInput({ checked, onChange, disabled = false }) {
  return (
    <input
      type="checkbox"
      className="checkbox w-5 h-5 cursor-pointer"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
  );
}

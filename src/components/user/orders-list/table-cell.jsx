export default function TableCell({ children, isHeader, className, ...props }) {
  const baseStyles = "px-4 md:px-6 py-3 md:py-4 text-sm md:text-base";

  if (isHeader) {
    return (
      <th
        className={`${baseStyles} font-bold text-gray-900 text-left ${className}`}
        {...props}>
        {children}
      </th>
    );
  }

  return (
    <td className={`${baseStyles} text-gray-700 ${className}`} {...props}>
      {children}
    </td>
  );
}

export default function TableCell({ children, isHeader, className, ...props }) {
  const baseStyles = "px-4 md:px-6 py-3 md:py-2 text-sm md:text-lg text-center";

  if (isHeader) {
    return (
      <th
        className={`${baseStyles} font-bold text-[#011844]  ${className}`}
        {...props}>
        {children}
      </th>
    );
  }

  return (
    <td
      className={`${baseStyles} font-medium text-[#011844] ${className}`}
      {...props}>
      {children}
    </td>
  );
}

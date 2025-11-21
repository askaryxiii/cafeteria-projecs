export default function TableCell({ children, isHeader, className, ...props }) {
  const baseStyles =
    "px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-2.5 md:py-3  md:text-base lg:text-lg text-center min-h-9 sm:min-h-10 md:min-h-11";

  if (isHeader) {
    return (
      <th
        className={`${baseStyles} font-bold text-[#011844] ${className}`}
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

export default function TableRow({ children, isEven }) {
  return <tr className={isEven ? "bg-white" : "bg-gray-50 border-b border-gray-200"}>{children}</tr>
}

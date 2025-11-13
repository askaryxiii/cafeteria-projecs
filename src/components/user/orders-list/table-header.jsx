import TableCell from "./table-cell";

export default function TableHeader({ columns }) {
  return (
    <thead>
      <tr className="bg-gray-300">
        {columns.map((column) => (
          <TableCell key={column.key} isHeader>
            {column.label}
          </TableCell>
        ))}
      </tr>
    </thead>
  );
}

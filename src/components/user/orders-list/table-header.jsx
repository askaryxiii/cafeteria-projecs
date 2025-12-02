import TableCell from "./table-cell";

export default function TableHeader({ columns, className }) {
  return (
    <thead>
      <tr className={`bg-[#DDDBDB] ${className || ""}`}>
        {columns.map((column) => (
          <TableCell className={"text-center"} key={column.key} isHeader>
            {column.label}
          </TableCell>
        ))}
      </tr>
    </thead>
  );
}

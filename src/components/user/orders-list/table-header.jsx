import TableCell from "./table-cell";

export default function TableHeader({ columns }) {
  return (
    <thead>
      <tr className="bg-[#DDDBDB]">
        {columns.map((column) => (
          <TableCell className={"text-center"} key={column.key} isHeader>
            {column.label}
          </TableCell>
        ))}
      </tr>
    </thead>
  );
}

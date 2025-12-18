import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as XLSX from "xlsx";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function downloadOrdersExcel(apiResponse) {
  const { period, users } = apiResponse;

  // Create a new workbook and worksheet
  const wb = XLSX.utils.book_new();

  // Header row
  const wsData = [["No", "Date Range", "Email", "Name", "Price"]];

  // Fill rows
  users.forEach((user, index) => {
    wsData.push([
      index + 1,
      `${period.from_date} - ${period.to_date}`,
      user.email,
      user.name,
      Number(user.total_cost).toFixed(2),
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // --- Styling ---

  // Header styling (yellow background)
  const headerCells = ["A1", "B1", "C1", "D1", "E1"];
  headerCells.forEach((cell) => {
    if (!ws[cell]) return;
    ws[cell].s = {
      fill: { fgColor: { rgb: "FFC000" } },
      font: { bold: true },
    };
  });

  // Column widths (auto-fit style)
  ws["!cols"] = [
    { wch: 6 }, // No
    { wch: 25 }, // Date Range
    { wch: 35 }, // Email
    { wch: 20 }, // Name
    { wch: 12 }, // Price
  ];

  // Append worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, "Report");

  // Save the file
  XLSX.writeFile(
    wb,
    `Orders_Report_${period.from_date}_to_${period.to_date}.xlsx`
  );
}

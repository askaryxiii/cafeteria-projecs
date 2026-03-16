import { useState } from "react";
import Modal from "./modal-base";
import ImportFile from "../import-file";
import { FiDownload } from "react-icons/fi";
import toast from "react-hot-toast";
import {
  getAllMenuItems,
  readToken,
  getServerTime,
} from "../../../../lib/apis";

const ImportModal = ({ isOpen, onClose, isLoading }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      // Fetch all menu items
      const result = await getAllMenuItems();
      if (result.error) {
        toast.error(result.error);
        setIsExporting(false);
        return;
      }

      const items = Array.isArray(result) ? result : [];
      if (items.length === 0) {
        toast.error("No items to export");
        setIsExporting(false);
        return;
      }

      // Prepare CSV headers and data
      const headers = [
        "ID",
        "Item Name",
        "Category",
        "Price",
        "Weight (grams)",
        "Meal Type",
        "Code",
        "Protein Type",
      ];

      // Map items to CSV format
      const csvData = items.map((item) => [
        item.id || "",
        item.item_name || "",
        item.category || "",
        item.price || "",
        item.weight_grams || "",
        item.meal_type || "",
        item.code || "",
        item.protein_type || "",
      ]);

      // Create CSV string with UTF-8 BOM for proper encoding
      let csvContent = "\uFEFF"; // UTF-8 BOM
      csvContent += headers.map((h) => `"${h}"`).join(",") + "\n";
      csvContent += csvData
        .map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
        )
        .join("\n");

      // Create blob with UTF-8 encoding
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      const { date: serverTime } = await getServerTime();
      link.setAttribute(
        "download",
        `menu_items_${serverTime.toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Menu items exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export menu items");
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportSuccess = () => {
    // This will be called after successful import to refresh data
    // Parent component should handle data refresh
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import / Export Items">
      <div className="space-y-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-[#072A57] mb-3">
            Import CSV File
          </label>
          <ImportFile onImportSuccess={handleImportSuccess} />
        </div>

        <div className="flex gap-3 justify-center pt-6">
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={isExporting || isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-[#D9D9D9] text-[#072A57] border border-[#072A57] rounded-sm hover:bg-[#b3b3b3] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
            <FiDownload className="w-4 h-4" />
            {isExporting ? "Exporting..." : "Export CSV"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isExporting || isLoading}
            className="px-4 py-2 bg-gray-400 text-white border border-gray-500 rounded-sm hover:bg-gray-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ImportModal;

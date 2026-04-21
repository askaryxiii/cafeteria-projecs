import { useState, useMemo } from "react";
import SearchBar from "./search-bar";
import ItemsTableContent from "./table-content";
import EditModal from "./modals/edit-modal";
import DeleteConfirmation from "./modals/delete-confirmation";
import CreateItemModal from "./modals/create-item-modal";
import ImportModal from "./modals/import-modal";

export default function DrinksTable({ drinks, onUpdate, onDelete, onCreate }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "item_name",
    direction: "asc",
  });

  // Filter and sort drinks
  const filteredDrinks = useMemo(() => {
    let filtered = drinks;

    // Filter by category (drink)
    filtered = filtered.filter(
      (item) => item.meal_type && item.meal_type.toLowerCase() === "drinks"
    );

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((item) =>
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(term)
        )
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle null or undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === "asc" ? 1 : -1;
      if (bValue == null) return sortConfig.direction === "asc" ? -1 : 1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        if (sortConfig.direction === "asc") {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      } else {
        if (sortConfig.direction === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      }
    });

    return filtered;
  }, [drinks, searchTerm, sortConfig]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleEdit = async (itemId, updatedData) => {
    setIsLoading(true);
    try {
      await onUpdate(itemId, updatedData);
      setEditingItem(null);
    } catch (error) {
      console.error("Error updating drink:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async (importData) => {
    setIsLoading(true);
    try {
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating drink:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    setIsLoading(true);
    try {
      await onDelete(itemId);
      setDeletingItemId(null);
    } catch (error) {
      console.error("Error deleting drink:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (newData) => {
    setIsLoading(true);
    try {
      await onCreate(newData);
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating drink:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-2.5 mb-6 items-center px-2">
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#072A57] hover:bg-[#0a3c7e] shadow-lg text-white font-semibold py-1.5 px-4  whitespace-nowrap transition-colors">
          + Create Drink
        </button>
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <button onClick={() => setShowImport(true)} className="">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-9 h-9"
            viewBox="0 0 48 48"
            fill="none">
            <path
              fill="#4CAF50"
              d="M41,10H25v28h16c0.553,0,1-0.447,1-1V11C42,10.447,41.553,10,41,10z"></path>
            <path
              fill="#FFF"
              d="M32 15H39V18H32zM32 25H39V28H32zM32 30H39V33H32zM32 20H39V23H32zM25 15H30V18H25zM25 25H30V28H25zM25 30H30V33H25zM25 20H30V23H25z"></path>
            <path fill="#2E7D32" d="M27 42L6 38 6 10 27 6z"></path>
            <path
              fill="#FFF"
              d="M19.129,31l-2.411-4.561c-0.092-0.171-0.186-0.483-0.284-0.938h-0.037c-0.046,0.215-0.154,0.541-0.324,0.979L13.652,31H9.895l4.462-7.001L10.274,17h3.837l2.001,4.196c0.156,0.331,0.296,0.725,0.42,1.179h0.04c0.078-0.271,0.224-0.68,0.439-1.22L19.237,17h3.515l-4.199,6.939l4.316,7.059h-3.74V31z"></path>
          </svg>
        </button>
      </div>

      <ItemsTableContent
        items={filteredDrinks}
        onEdit={setEditingItem}
        onDeleteConfirm={setDeletingItemId}
        sortConfig={sortConfig}
        onSort={handleSort}
      />

      {editingItem && (
        <EditModal
          item={editingItem}
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleEdit}
          isLoading={isLoading}
          drinks={true}
        />
      )}

      {deletingItemId && (
        <DeleteConfirmation
          isOpen={!!deletingItemId}
          onConfirm={() => handleDelete(deletingItemId)}
          onCancel={() => setDeletingItemId(null)}
          isLoading={isLoading}
        />
      )}

      {showImport && (
        <ImportModal
          isOpen={!!showImport}
          onClose={() => setShowImport(false)}
          isLoading={isLoading}
        />
      )}

      {showCreateModal && (
        <CreateItemModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreate}
          isLoading={isLoading}
          drinks={true}
        />
      )}
    </div>
  );
}

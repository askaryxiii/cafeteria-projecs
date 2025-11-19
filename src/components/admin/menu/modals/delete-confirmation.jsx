import Modal from "./modal-base";

export default function DeleteConfirmation({
  isOpen,
  onConfirm,
  onCancel,
  isLoading,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Delete Item">
      <div className="space-y-4">
        <p className="text-gray-700">
          Are you sure you want to delete this item? This action cannot be
          undone.
        </p>

        <div className="flex gap-3 justify-end pt-4">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

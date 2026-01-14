import { IoMdClose } from "react-icons/io";

export default function DeleteConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-lg w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-gray-200 px-4 py-3">
          <span className="text-sm font-medium text-gray-700"></span>
          <button onClick={onCancel}>
            <IoMdClose className="w-5 h-5 text-gray-600 hover:text-gray-800" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <p className="text-gray-800 text-sm font-medium mb-1">
            Are you sure you want to delete this?
          </p>
          <p className="text-gray-500 text-xs mb-6">
            This action cannot be undone.
          </p>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-1.5 border border-gray-300 text-gray-600 rounded-md text-sm hover:bg-gray-100">
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-1.5 bg-orange-600 text-white rounded-md text-sm hover:bg-orange-700">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

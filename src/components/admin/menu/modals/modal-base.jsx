import { IoMdClose } from "react-icons/io";

export default function Modal({ isOpen, onClose, title, children }) {
  console.log(onClose);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#868686]/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-[#D9D9D9] rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex justify-between items-center p-6 ">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors">
              <IoMdClose size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </>
  );
}

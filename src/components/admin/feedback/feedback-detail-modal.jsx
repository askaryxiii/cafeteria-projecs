import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { updateFeedbackStatus, getAllMenuItemById } from "../../../lib/apis";

const FeedbackDetailModal = ({ feedback, onClose, onUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [menuItemName, setMenuItemName] = useState("Loading...");
  const [currentStatus, setCurrentStatus] = useState(feedback.status);

  useEffect(() => {
    fetchMenuItemName();
  }, [feedback.menu_item_id]);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const fetchMenuItemName = async () => {
    try {
      const result = await getAllMenuItemById(null, feedback.menu_item_id);
      if (result.error) {
        setMenuItemName("Unknown Item");
      } else {
        setMenuItemName(result.item_name || "Unknown Item");
      }
    } catch (error) {
      setMenuItemName("Unknown Item");
    }
  };

  const handleStatusToggle = async () => {
    const newStatus = currentStatus.toLowerCase() === "new" ? "read" : "new";

    // Update UI immediately
    setCurrentStatus(newStatus);
    setIsUpdating(true);

    try {
      const result = await updateFeedbackStatus(feedback.id, newStatus);

      if (result.error) {
        toast.error(result.error);
        // Revert on error
        setCurrentStatus(feedback.status);
        return;
      }

      toast.success("Feedback status updated successfully");
      onUpdate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
      // Revert on error
      setCurrentStatus(feedback.status);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    return status.toLowerCase() === "new" ? "text-green-600" : "text-gray-600";
  };

  return (
    <>
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}>
        {/* Modal Content */}
        <div
          className="bg-white rounded-lg shadow-lg max-w-md w-full"
          onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-2.5 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Feedback Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none">
              ×
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-3 space-y-2.5">
            {/* Profile Summary Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Profile Summary:
              </h3>
              <div className="border rounded-lg px-4 py-2.5 space-y-2.5">
                {/* Name and Status Row */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Name:</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {feedback.name}
                    </p>
                  </div>
                  <div className="">
                    <p className="text-xs text-gray-500 font-medium">Status:</p>
                    <p
                      className={`text-sm font-semibold capitalize transition-colors duration-300 ${getStatusColor(
                        currentStatus
                      )}`}>
                      {currentStatus}
                    </p>
                  </div>
                </div>

                {/* Email Row /  Date of Feedback Row*/}
                <div className="flex justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Email:</p>
                    <p className="text-sm text-gray-900 truncate">
                      {feedback.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Feedback Date:
                    </p>
                    <p className="text-sm text-gray-900">
                      {feedback.date_of_feedback}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Info Section (Feedback Info) */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Feedback Info:
              </h3>
              <div className="border rounded-lg px-4 py-2.5 space-y-2.5">
                {/* Date of Meal / Category */}
                <div className="flex gap-10">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Date of Meal:
                    </p>
                    <p className="text-sm text-gray-900">
                      {feedback.date_of_meal}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Category:
                    </p>
                    <p className="text-sm text-gray-900 capitalize">
                      {feedback.category}
                    </p>
                  </div>
                </div>

                {/* Menu Item */}
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Menu Item:
                  </p>
                  <p className="text-sm text-gray-900">{menuItemName}</p>
                </div>

                {/* Feedback Paragraph */}
                <div>
                  <p className="text-xs text-gray-500 font-medium">Feedback:</p>
                  <p className="text-sm text-gray-900 mt-1 max-h-32 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {feedback.feedback_paragraph}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Toggle Switch */}
            <div className="flex items-center justify-center gap-4">
              <span
                className={`text-sm font-semibold transition-colors duration-300 ${
                  currentStatus.toLowerCase() === "new"
                    ? "text-[#072A57]"
                    : "text-gray-400"
                }`}>
                New
              </span>
              <button
                onClick={handleStatusToggle}
                disabled={isUpdating}
                className={`relative inline-flex h-7 w-15 items-center rounded-full transition-all duration-300 ease-in-out ${
                  currentStatus.toLowerCase() === "new"
                    ? "bg-white border-2 border-[#072A57]"
                    : "bg-white border-2 border-gray-400"
                } ${
                  isUpdating
                    ? "opacity-75 cursor-not-allowed"
                    : "cursor-pointer hover:shadow-lg"
                }`}>
                <span
                  className={`inline-block h-5 w-5 transform rounded-full transition-all duration-300 ease-in-out ${
                    currentStatus.toLowerCase() === "new"
                      ? "translate-x-1 bg-[#072A57]"
                      : "translate-x-8 bg-gray-400"
                  } shadow-md`}
                />
              </button>
              <span
                className={`text-sm font-semibold transition-colors duration-300 ${
                  currentStatus.toLowerCase() === "read"
                    ? "text-gray-400"
                    : "text-gray-400"
                }`}>
                Read
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedbackDetailModal;

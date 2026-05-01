import { useState, useMemo, useEffect } from "react";
import DashboardHeader from "../../layouts/navbar/admin/DashboardHeader";
import { MdOutlineRateReview, MdArrowUpward, MdDelete } from "react-icons/md";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import { getAllFeedbacks, deleteFeedback } from "../../lib/apis";
import FeedbackDetailModal from "../../components/admin/feedback/feedback-detail-modal";
import DeleteConfirmModal from "../../components/admin/users/delete-confirm-modal";
import time from "@/utils/timeClient";

const FeedbackDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [deletingFeedbackId, setDeletingFeedbackId] = useState(null);

  // Fetch feedbacks on component mount
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setIsLoading(true);
    try {
      const result = await getAllFeedbacks();
      if (result.error) {
        toast.error(result.error);
        setFeedbacks([]);
      } else {
        setFeedbacks(Array.isArray(result) ? result : []);
      }
    } catch (error) {
      toast.error("Failed to fetch feedbacks");
      setFeedbacks([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort feedbacks
  const filteredFeedbacks = useMemo(() => {
    const filtered = feedbacks.filter(
      (feedback) =>
        feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.category.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // Sort feedbacks
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === "string") {
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
  }, [feedbacks, searchTerm, sortConfig]);

  // Count new and read feedbacks
  const feedbackCounts = useMemo(() => {
    const newCount = filteredFeedbacks.filter(
      (f) => f.status.toLowerCase() === "new",
    ).length;
    const readCount = filteredFeedbacks.filter(
      (f) => f.status.toLowerCase() === "read",
    ).length;
    return { newCount, readCount };
  }, [filteredFeedbacks]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleDeleteFeedback = async (e) => {
    e.stopPropagation();
    if (deletingFeedbackId) {
      try {
        const result = await deleteFeedback(deletingFeedbackId);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Feedback deleted successfully");
          await fetchFeedbacks();
        }
      } catch (error) {
        toast.error("Failed to delete feedback");
      } finally {
        setDeletingFeedbackId(null);
      }
    }
  };

  const getStatusColor = (status) => {
    return status.toLowerCase() === "new"
      ? "bg-green-500 text-gray-600"
      : "bg-gray-200 text-gray-600";
  };

  return (
    <div className="w-full bg-mid-grey">
      {/* Header */}
      <DashboardHeader
        title="Feedback"
        dist="/"
        icon={<MdOutlineRateReview className="w-8 h-8 text-[#02356A]" />}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="p-4 sm:p-6 md:p-8 text-center text-gray-500 text-sm sm:text-base">
          Loading feedbacks...
        </div>
      )}

      {!isLoading && (
        <>
          {/* Controls */}
          <div className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 border-b flex gap-2 sm:gap-3 md:gap-4">
            <div className="flex-1 relative shadow-lg h-8">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1 sm:py-1.5 md:py-2 border border-[#072A57] bg-[#D9D9D9] focus:outline-none text-xs sm:text-sm md:text-base  h-8"
              />
            </div>
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 border border-[#072A57] shadow-lg bg-[#D9D9D9] text-[#072A57]  transition-colors font-normal text-xs sm:text-sm md:text-base h-8 justify-center sm:justify-start whitespace-nowrap">
                <span className="font-medium">New:</span>
                <span className="font-bold ">{feedbackCounts.newCount}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 border border-[#072A57] shadow-lg bg-[#D9D9D9] text-[#072A57]  transition-colors font-normal text-xs sm:text-sm md:text-base h-8 justify-center sm:justify-start whitespace-nowrap">
                <span className="font-medium">Read:</span>
                <span className="font-bold ">{feedbackCounts.readCount}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 border border-[#072A57] shadow-lg bg-[#D9D9D9] text-[#072A57]  transition-colors font-normal text-xs sm:text-sm md:text-base h-8 justify-center sm:justify-start whitespace-nowrap">
                <span className="font-medium">Total:</span>
                <span className="font-bold">{filteredFeedbacks.length}</span>
              </div>
            </div>
          </div>

          <div className="hidden md:block overflow-x-auto p-5">
            <table className="w-full text-xs sm:text-sm md:text-base">
              <thead>
                <tr className="bg-burned-grey">
                  <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-center font-medium text-primary-navy cursor-pointer min-w-24 sm:min-w-32">
                    <button
                      className="flex items-center gap-1 sm:gap-2 w-full justify-center"
                      onClick={() => handleSort("name")}>
                      User
                      <MdArrowUpward
                        className={`w-3 sm:w-4 h-3 sm:h-4 text-gray-600 transition ${
                          sortConfig.key === "name" &&
                          sortConfig.direction === "desc"
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>
                  </th>
                  <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-center font-medium text-primary-navy cursor-pointer min-w-28 sm:min-w-40">
                    <button
                      className="flex items-center justify-center gap-1 sm:gap-2 w-full"
                      onClick={() => handleSort("created_at")}>
                      Created At
                      <MdArrowUpward
                        className={`w-3 sm:w-4 h-3 sm:h-4 text-gray-600 transition ${
                          sortConfig.key === "created_at" &&
                          sortConfig.direction === "desc"
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>
                  </th>
                  <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-center font-medium text-primary-navy cursor-pointer min-w-24 sm:min-w-32">
                    <button
                      className="flex items-center gap-1 sm:gap-2 w-full justify-center"
                      onClick={() => handleSort("status")}>
                      Feedback
                      <MdArrowUpward
                        className={`w-3 sm:w-4 h-3 sm:h-4 text-gray-600 transition ${
                          sortConfig.key === "status" &&
                          sortConfig.direction === "desc"
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>
                  </th>
                  <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-center font-medium text-primary-navy cursor-pointer min-w-20 sm:min-w-24">
                    <button
                      className="flex items-center gap-1 sm:gap-2 w-full justify-center"
                      onClick={() => handleSort("status")}>
                      Status
                      <MdArrowUpward
                        className={`w-3 sm:w-4 h-3 sm:h-4 text-gray-600 transition ${
                          sortConfig.key === "status" &&
                          sortConfig.direction === "desc"
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>
                  </th>
                  <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-center font-medium text-primary-navy min-w-16 sm:min-w-20">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedbacks.map((feedback, index) => (
                  <tr
                    key={feedback.id}
                    onClick={() => setSelectedFeedback(feedback)}
                    className={`border-b border-[#A9AFBAB2] ${
                      index % 2 === 0 ? "bg-[#E9E7E7]" : "bg-[#E9E7E7]"
                    } hover:bg-[#dadada] transition-colors text-xs sm:text-sm md:text-base cursor-pointer`}>
                    <td className="px-3 md:px-6 py-2 sm:py-3 md:py-4 flex flex-col gap-1 items-center">
                      <span className="text-primary-navy font-medium truncate">
                        {feedback.name}
                      </span>
                      <span className="truncate text-xs font-light text-gray-500">
                        {feedback.email}
                      </span>
                    </td>
                    <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-center">
                      <span className="text-primary-navy text-xs sm:text-sm">
                        {time
                          .parseISO(feedback.created_at)
                          .toFormat("MM/dd/yyyy")}
                      </span>
                    </td>
                    <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-center">
                      <p className="text-primary-navy text-sm line-clamp-2 max-w-[35ch] mx-auto">
                        {feedback.feedback_paragraph}
                      </p>
                    </td>

                    <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs sm:text-sm font-medium capitalize ${getStatusColor(
                          feedback.status,
                        )}`}>
                        {feedback.status}
                      </span>
                    </td>

                    <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingFeedbackId(feedback.id);
                        }}
                        className="p-1 sm:p-1.5 hover:text-red-600 transition text-gray-600"
                        title="Delete feedback">
                        <MdDelete className="w-4 sm:w-5 h-4 sm:h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* phone */}
          <div className="block md:hidden px-3 py-3 space-y-3">
            {filteredFeedbacks.map((feedback) => (
              <div
                key={feedback.id}
                onClick={() => setSelectedFeedback(feedback)}
                className="bg-white border border-[#D9D9D9] rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                {/* Top Section: Amount and Status Badge */}
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-[#E9E7E7]">
                  <div className="flex flex-col">
                    <span className="text-primary-navy font-medium text-xl truncate">
                      {feedback.name}
                    </span>
                    <span className="truncate text-base font-light text-gray-500">
                      {feedback.email}
                    </span>
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                      feedback.status,
                    )}`}>
                    {feedback.status}
                  </span>
                </div>

                {/* Details Section: Key-Value Pairs */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Created:</span>
                    <span className="text-primary-navy text-right">
                      {time
                        .parseISO(feedback.created_at)
                        .toFormat("MM/dd/yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Category:</span>
                    <span className="text-primary-navy font-medium text-right">
                      {feedback.category || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Footer Section: Actions */}
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#E9E7E7]">
                  <button
                    onClick={() => setSelectedFeedback(feedback)}
                    className="text-primary-navy font-medium text-sm hover:text-[#02356A] transition-colors underline">
                    View Details
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingFeedbackId(feedback.id);
                    }}
                    className="p-2 hover:text-red-600 transition text-gray-600"
                    title="Delete feedback">
                    <MdDelete className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No results message */}
          {filteredFeedbacks.length === 0 && !isLoading && (
            <div className="p-4 sm:p-6 md:p-8 text-center text-gray-500 text-sm sm:text-base">
              No feedbacks found matching your search.
            </div>
          )}
        </>
      )}

      {/* Feedback Detail Modal */}
      {selectedFeedback && (
        <FeedbackDetailModal
          feedback={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
          onUpdate={fetchFeedbacks}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingFeedbackId && (
        <DeleteConfirmModal
          onConfirm={handleDeleteFeedback}
          onCancel={() => setDeletingFeedbackId(null)}
        />
      )}
    </div>
  );
};

export default FeedbackDashboard;

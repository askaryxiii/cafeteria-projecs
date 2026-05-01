import { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PulseLoader } from "react-spinners";
import { getMenuByCategoryAndDate, submitFeedback } from "../../lib/apis";
import time from "@/utils/timeClient";
import { MdOutlineInfo } from "react-icons/md";
import ToolTip from "../../components/ui/tooltip";

const Feedback = () => {
  const { user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      name: user?.user?.name || "",
      email: user?.user?.email || "",
      category: "",
      date_of_meal: time.now().toJSDate(),
      feedback_paragraph: "",
    },
  });

  const [feedbackDate, setFeedbackDate] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCategory = watch("category");
  const selectedDate = watch("date_of_meal");

  useEffect(() => {
    const initializeFeedbackDate = async () => {
      try {
        await time.initTimeSync();
        const serverDate = time.nowDate();
        setFeedbackDate(serverDate);
        setValue("date_of_feedback", serverDate);
      } catch {
        const fallbackDate = time.nowDate();
        setFeedbackDate(fallbackDate);
        setValue("date_of_feedback", fallbackDate);
      }
    };
    initializeFeedbackDate();
  }, [setValue]);

  useEffect(() => {
    if (selectedCategory && selectedDate) {
      loadMenuItems();
    }
  }, [selectedCategory, selectedDate]);

  const loadMenuItems = async () => {
    setLoadingMenu(true);

    try {
      const dateString = selectedDate
        ? time.toISODate(selectedDate)
        : time.nowDate();

      const result = await getMenuByCategoryAndDate(
        selectedCategory,
        dateString,
      );

      if (result?.error) {
        toast.error(result.error);
        setMenuItems([]);
        return;
      }

      setMenuItems(Array.isArray(result) ? result : []);
    } catch (error) {
      toast.error("Failed to load menu items");
      setMenuItems([]);
    } finally {
      setLoadingMenu(false);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const submissionData = {
        name: data.name,
        email: data.email,
        date_of_meal: time.toISODate(data.date_of_meal),
        date_of_feedback: data.date_of_feedback,
        category: data.category,
        menu_item_id: Number(data.menu_item_id),
        feedback_paragraph: data.feedback_paragraph,
      };

      const result = await submitFeedback(submissionData);

      // Add 3 second delay to show loading animation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Feedback submitted successfully!");
      reset({
        name: user.user.name,
        email: user.user.email,
        category: "",
        date_of_meal: time.now().toJSDate(),
        menu_item_id: "",
        feedback_paragraph: "",
        date_of_feedback: feedbackDate,
      });

      setMenuItems([]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-10 ">
      <div className="max-w-6xl mx-auto ">
        <div className="mb-8 w-full flex flex-col items-center">
          <h1 className="text-3xl font-bold" style={{ color: "#02356A" }}>
            Feedback
          </h1>
          <p className="text-gray-600 mt-2">
            Share your meal experience with us
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 ">
          {/* Email Field / Name Field  - Read Only */}
          <div className="flex flex-col md:flex-row gap-5 md:gap-14 justify-center">
            <div className="w-full  md:w-1/3">
              <label
                className="block gap-1.5 text-sm font-medium mb-2"
                style={{ color: "#02356A" }}>
                Name <ToolTip text="This is not editable." />
              </label>
              <input
                {...register("name", { required: "Name is required" })}
                value={user.user.name}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
              />
              {errors.name && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="w-full md:w-1/3">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#02356A" }}>
                Email <ToolTip text="This is not editable." />
              </label>
              <input
                {...register("email", { required: "Email is required" })}
                value={user.user.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
              />
              {errors.email && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </span>
              )}
            </div>
          </div>

          {/* Date of Meal / Date of Feedback - Calendar Picker */}
          <div className="flex flex-col md:flex-row gap-5 md:gap-14 justify-center">
            <div className="w-full md:w-1/3">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#02356A" }}>
                Today's Date <ToolTip text="This is not editable." />
              </label>
              <input
                type="text"
                value={feedbackDate}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>
            <div className="w-full md:w-1/3">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#02356A" }}>
                Date of Meal *
              </label>
              <div className="w-full">
                <DatePicker
                  wrapperClassName="w-full"
                  selected={getValues("date_of_meal")}
                  onChange={(date) =>
                    setValue("date_of_meal", date || time.now().toJSDate())
                  }
                  dateFormat="yyyy-MM-dd"
                  className="w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-lg focus:outline-none"
                  style={{ color: "#02356A" }}
                />
              </div>
              {errors.date_of_meal && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.date_of_meal.message}
                </span>
              )}
            </div>
          </div>

          {/* Category Dropdown / Menu Item */}
          <div className="flex flex-col md:flex-row gap-5 md:gap-14 justify-center">
            <div className="w-full md:w-1/3">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#02356A" }}>
                Category of Meal *
              </label>
              <select
                {...register("category", {
                  required: "Please select a category",
                })}
                className="w-full px-4 py-2 border bg-gray-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1"
                style={{ "--tw-ring-color": "#02356A" }}>
                <option value="">Select a category</option>
                <option value="protein">Protein</option>
                <option value="carbs">Carbs</option>
                <option value="salad">Salad</option>
                <option value="side">Side</option>
              </select>
              {errors.category && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.category.message}
                </span>
              )}
            </div>
            <div className="w-full md:w-1/3">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#02356A" }}>
                Menu Item *{" "}
                <ToolTip text="Must choose a date and a category first." />
              </label>
              <select
                {...register("menu_item_id", {
                  required: "Please select a menu item",
                  valueAsNumber: true,
                })}
                disabled={!selectedCategory || loadingMenu}
                className="w-full px-4 py-2 border bg-gray-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:bg-gray-100 disabled:cursor-not-allowed"
                style={{ "--tw-ring-color": "#02356A" }}>
                <option value="">
                  {loadingMenu ? "Loading menu items..." : "Select a menu item"}
                </option>
                {menuItems.map((item) => (
                  <option
                    key={item.menu_item_id}
                    value={item.menu_item_id}
                    className="text-[#02356A]">
                    {item.item_name}
                  </option>
                ))}
              </select>
              {errors.menu_item_id && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.menu_item_id.message}
                </span>
              )}
            </div>
          </div>

          {/* Feedback Paragraph */}
          <div className="flex flex-col items-center">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "#02356A" }}>
              Your Feedback *
            </label>
            <textarea
              {...register("feedback_paragraph", {
                required: "Please enter your feedback",
                minLength: {
                  value: 10,
                  message: "Feedback must be at least 10 characters",
                },
              })}
              rows={5}
              className="w-full md:w-3/4 px-4 py-2 border bg-gray-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 resize-none"
              style={{ "--tw-ring-color": "#02356A" }}
              placeholder="Share your thoughts about the meal..."
            />
            {errors.feedback_paragraph && (
              <span className="text-red-500 text-xs mt-1">
                {errors.feedback_paragraph.message}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <div className="w-full flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-1/3 py-3 rounded-lg font-medium text-white transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#02356A" }}>
              {isSubmitting ? (
                <PulseLoader color="#FFFAEE" size={8} />
              ) : (
                "Submit Feedback"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Feedback;

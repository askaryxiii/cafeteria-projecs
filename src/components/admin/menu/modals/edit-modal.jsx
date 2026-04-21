import { useState, useEffect } from "react";
import Modal from "./modal-base";
import { getAllMenuItemById } from "../../../../lib/apis";
import toast from "react-hot-toast";

export default function EditModal({
  item,
  isOpen,
  onClose,
  onSave,
  isLoading,
  drinks = false,
}) {
  const [formData, setFormData] = useState(item);
  const [isFetchingItem, setIsFetchingItem] = useState(false);

  // Fetch item details when modal opens
  useEffect(() => {
    if (isOpen && item && item.id) {
      const fetchItemData = async () => {
        setIsFetchingItem(true);
        const result = await getAllMenuItemById(null, item.id);
        if (result.error) {
          toast.error(result.error);
          setFormData(item);
        } else {
          setFormData(result);
        }
        setIsFetchingItem(false);
      };
      fetchItemData();
    } else {
      setFormData(item);
    }
  }, [isOpen, item]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Map input names to formData properties
    let propertyName = name;
    if (name === "itemName") propertyName = "item_name";
    if (name === "weightGrams") propertyName = "weight_grams";
    if (name === "mealType") propertyName = "meal_type";
    if (name === "proteinType") propertyName = "protein_type";

    setFormData((prev) => ({
      ...prev,
      [propertyName]:
        propertyName === "price" || propertyName === "weight_grams"
          ? value === ""
            ? ""
            : parseFloat(value)
          : value.toLowerCase(), // Convert to lowercase
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(item.id, formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Item">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-[#072A57] mb-1">
              Item Name
            </label>
            <input
              type="text"
              name="itemName"
              value={formData.item_name || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 text-white bg-[#072A57] border border-gray-300 rounded-sm focus:outline-none "
              required
              disabled={isFetchingItem || isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#072A57] mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 text-white bg-[#072A57] border border-gray-300 rounded-sm focus:outline-none "
              required
              disabled={isFetchingItem || isLoading}>
              <option value="">Select a category</option>
              {formData.meal_type === "drinks" ? (
                <>
                  <option value="drinks">Drinks</option>
                  <option value="drinks can">Drinks Can</option>
                </>
              ) : (
                <>
                  <option value="breakfast">Breakfast</option>
                  <option value="carbs">Carbs</option>
                  <option value="protein">Protein</option>
                  <option value="salad">Salad</option>
                  <option value="side">Side</option>
                </>
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#072A57] mb-1">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price || ""}
              onChange={handleChange}
              step="0.01"
              className="w-full px-3 py-2 text-white bg-[#072A57] border border-gray-300 rounded-sm focus:outline-none "
              required
              disabled={isFetchingItem || isLoading}
            />
          </div>
          {!drinks && (
            <div>
              <label className="block text-sm font-medium text-[#072A57] mb-1">
                Weight (grams)
              </label>
              <input
                type="number"
                name="weightGrams"
                value={formData.weight_grams || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 text-white bg-[#072A57] border border-gray-300 rounded-sm focus:outline-none "
                disabled={isFetchingItem || isLoading}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-[#072A57] mb-1">
              Meal Type
            </label>
            <select
              name="mealType"
              value={formData.meal_type || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 text-white bg-[#072A57] border border-gray-300 rounded-sm focus:outline-none "
              required
              disabled={isFetchingItem || isLoading}>
              <option value="">Select a meal type</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="drinks">Drinks</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#072A57] mb-1">
              Code
            </label>
            <input
              type="text"
              name="code"
              value={formData.code || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 text-white bg-[#072A57] border border-gray-300 rounded-sm focus:outline-none "
              required
              disabled={isFetchingItem || isLoading}
            />
          </div>
          {!drinks && (
            <div>
              <label className="block text-sm font-medium text-[#072A57] mb-1">
                Protein Type
              </label>
              <select
                name="proteinType"
                value={formData.protein_type || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 text-white bg-[#072A57] border border-gray-300 rounded-sm focus:outline-none "
                disabled={isFetchingItem || isLoading}>
                <option value="">Select a protein type</option>
                <option value="meat">Meat</option>
                <option value="chicken">Chicken</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-center pt-4">
          <button
            type="submit"
            disabled={isFetchingItem || isLoading}
            className="px-4 py-2 bg-[#D9D9D9] text-[#072A57] border border-[#072A57] rounded-sm hover:bg-[#b3b3b3] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
            {isFetchingItem ? "Loading..." : isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

import { useState } from "react";
import Modal from "./modal-base";

const emptyForm = {
  itemName: "",
  category: "",
  price: 0,
  weightGrams: 0,
  mealType: "",
  proteinType: "",
};

export default function CreateItemModal({
  isOpen,
  onClose,
  onSave,
  isLoading,
  drinks = false,
}) {
  const [formData, setFormData] = useState(emptyForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes("price") || name.includes("Weight")
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData(emptyForm);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Item">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-[#072A57] mb-1">
              Item Name
            </label>
            <input
              type="text"
              name="itemName"
              placeholder="Enter item name"
              value={formData.itemName}
              onChange={handleChange}
              className="w-full px-3 py-2 text-white bg-[#072A57] border border-gray-300 rounded-sm focus:outline-none "
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#072A57] mb-1">
              Category
            </label>
            <input
              type="text"
              name="category"
              placeholder="Enter category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 text-white bg-[#072A57] border border-gray-300 rounded-sm focus:outline-none "
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#072A57] mb-1">
              Price
            </label>
            <input
              type="number"
              name="price"
              placeholder="Enter price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 text-white bg-[#072A57] border border-gray-300 rounded-sm focus:outline-none "
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#072A57] mb-1">
              Weight (grams)
            </label>
            <input
              type="number"
              name="weightGrams"
              placeholder="Enter weight in grams"
              value={formData.weightGrams}
              onChange={handleChange}
              className="w-full px-3 py-2 text-white bg-[#072A57] border border-gray-300 rounded-sm focus:outline-none "
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#072A57] mb-1">
              Meal Type
            </label>
            <input
              type="text"
              name="mealType"
              placeholder="Enter meal type"
              value={formData.mealType}
              onChange={handleChange}
              className="w-full px-3 py-2 text-white bg-[#072A57] border border-gray-300 rounded-sm focus:outline-none "
              required
            />
          </div>
          {!drinks && (
            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#072A57] mb-1">
                Protein Type
              </label>
              <input
                type="text"
                name="proteinType"
                placeholder="Enter protein type"
                value={formData.proteinType}
                onChange={handleChange}
                className="w-full px-3 py-2 text-white bg-[#072A57] border border-gray-300 rounded-sm focus:outline-none "
                required
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-center pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-[#D9D9D9] text-[#072A57] border border-[#072A57] rounded-sm hover:bg-[#b3b3b3] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? "Creating..." : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

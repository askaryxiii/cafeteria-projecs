import { MdOutlineFastfood } from "react-icons/md";
export default function FoodList({ items }) {

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
              <MdOutlineFastfood className="text-gray-600 w-6 h-6" />
            </div>
            <span className="text-gray-700 text-sm font-medium">
              {item.name}{" "}
              {typeof item.weight_grams === "number" && (
                <> - {item.weight_grams} جرام</>
              )}
            </span>
          </div>
          <span className="text-gray-600 text-sm">{item.orders} Order</span>
        </div>
      ))}
    </div>
  );
}

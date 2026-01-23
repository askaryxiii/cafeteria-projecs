import { MdOutlineFastfood } from "react-icons/md";
export default function FoodList({ items }) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between py-2 border-b border-dark-grey last:border-b-0">
          <div className="flex items-center gap-3">
            <div className=" w-12 h-12 rounded-full flex items-center justify-center">
              <img
                src="/assets/logo/dish.webp"
                alt="Food icon"
                className=" object-contain"
              />
            </div>
            <span className="text-text-dark text-base font-medium">
              {item.name}{" "}
              {typeof item.weight_grams === "number" && (
                <> - {item.weight_grams} جرام</>
              )}
            </span>
          </div>
          <span className="text-dark-grey text-sm">{item.orders} Order</span>
        </div>
      ))}
    </div>
  );
}

import { useEffect, useState } from "react";
import { getTotalPrice } from "../../lib/apis";
import { readToken } from "../../lib/apis";
import { LiaMoneyBillWaveAltSolid } from "react-icons/lia";

export default function FormFooter({ selectedItems, onTotalChange }) {
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const token = readToken();
    if (!token) return;

    getTotalPrice(selectedItems, token).then((value) => {
      setTotalPrice(value);
      if (typeof onTotalChange === "function") onTotalChange(value);
    });
  }, [selectedItems, onTotalChange]);

  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-300">
      <div className="flex items-center gap-2 text-black bg-gray-200 font-normal border-2 border-gray-400 px-1.5 py-1 rounded">
        <LiaMoneyBillWaveAltSolid className="w-8 h-8 text-[#02356A]" />
        <span>{totalPrice.toFixed(2)} LE</span>
      </div>
      <button
        type="submit"
        className="px-6 py-2 border-2 border-gray-400 rounded font-normal text-gray-800 hover:bg-gray-200 transition">
        Submit
      </button>
    </div>
  );
}

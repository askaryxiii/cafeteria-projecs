import { useEffect, useState } from "react";
import { getTotalPrice } from "../../lib/apis";
import { readToken } from "../../lib/apis";
import { LiaMoneyBillWaveAltSolid } from "react-icons/lia";
import { PulseLoader } from "react-spinners";

export default function FormFooter({
  selectedItems,
  onTotalChange,
  isSubmitting,
  disabled = false,
  mealType,
}) {
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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 md:gap-6 pt-4 sm:pt-5 md:pt-6 border-t border-gray-300">
      <div className="flex items-center gap-2 text-navy-dark bg-light-grey font-normal border-2 border-dark-grey/50 px-2  md:px-4 py-1.5 rounded text-sm sm:text-base md:text-lg w-full sm:w-auto justify-center sm:justify-start">
        <LiaMoneyBillWaveAltSolid className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-navy-dark" />
        <span className="whitespace-nowrap">{totalPrice.toFixed(2)} LE</span>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || disabled}
        className={`px-4 md:px-6 py-1.5 md:py-2 border-2 border-dark-grey/50 rounded font-normal text-sm sm:text-base md:text-lg ${
          disabled
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "text-primary-navy hover:bg-mid-grey"
        } transition w-full sm:w-auto min-h-11 sm:min-h-10 md:min-h-11 flex items-center justify-center disabled:opacity-50`}>
        {isSubmitting ? <PulseLoader color="#02356A" size={8} /> : "Submit"}
      </button>
    </div>
  );
}

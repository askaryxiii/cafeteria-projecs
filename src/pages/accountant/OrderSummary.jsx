import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getExcelData } from "../../lib/apis";

const OrderSummary = () => {
  const { dates } = useParams();
  const navigate = useNavigate();

  const [mainTableData, setMainTableData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [priceData, setPriceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dates) {
      navigate("/accountant", { replace: true });
    }
  }, [dates, navigate]);

  const decoded = decodeURIComponent(dates || "");
  const [fromStr, toStr] = decoded.split("_");

  const convertToISO = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  };

  const from = convertToISO(fromStr);
  const to = convertToISO(toStr);

  useEffect(() => {
    fetchData();
  }, [from, to]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await getExcelData(from, to);

      const mappedMainData = res.mainData.map((item) => ({
        class:
          item.category === "protein"
            ? `Protein - ${item.protein_type}`
            : item.category,
        meal: item.meal_item,
        count: Number(item.count),
      }));

      const ordersTotal = res.ordersData.reduce(
        (sum, row) => sum + Number(row.count),
        0
      );

      const mappedOrdersData = [
        ...res.ordersData,
        { date: "Grand Total", count: ordersTotal, isTotal: true },
      ];

      const priceTotal = res.priceData.reduce(
        (sum, row) => sum + Number(row.total_price),
        0
      );

      const mappedPriceData = [
        ...res.priceData.map((r) => ({
          date: r.date,
          sum: Number(r.total_price).toLocaleString(),
        })),
        {
          date: "Grand Total",
          sum: priceTotal.toLocaleString(),
          isTotal: true,
        },
      ];

      setMainTableData(mappedMainData);
      setOrdersData(mappedOrdersData);
      setPriceData(mappedPriceData);
    } catch (err) {
      console.error("Failed to fetch summary:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-5 text-center">Loading...</div>;
  }

  return (
    <section className="px-3 pt-10">
      <div className="min-h-fit">
        <div className="flex flex-col lg:flex-row gap-5 overflow-x-auto">
          {/* Main Large Table */}
          <div className="lg:shrink-0 overflow-x-auto">
            <table className="border-collapse border border-gray-300 bg-white w-full lg:w-auto min-w-max">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">Class</th>
                  <th className="border px-4 py-2">Meal</th>
                  <th className="border px-4 py-2 text-center">
                    Count of Meal
                  </th>
                </tr>
              </thead>
              <tbody>
                {mainTableData.map((row, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{row.class}</td>
                    <td className="border px-4 py-2">{row.meal}</td>
                    <td className="border px-4 py-2 text-center">
                      {row.count}
                    </td>
                  </tr>
                ))}

                {/* ✅ TOTAL ROW */}
                <tr className="bg-gray-300 font-bold">
                  <td colSpan={2} className="border px-4 py-2 text-right">
                    Total
                  </td>
                  <td className="border px-4 py-2 text-center">98</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Right Side Tables */}
          <div className="w-full lg:w-auto flex flex-col gap-6">
            {/* Orders Table */}
            <table className="border-collapse border border-gray-300 bg-white w-full min-w-max">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">date</th>
                  <th className="border px-4 py-2 text-center">
                    Count of Orders
                  </th>
                </tr>
              </thead>
              <tbody>
                {ordersData.map((row, index) => (
                  <tr
                    key={index}
                    className={row.isTotal ? "bg-gray-300 font-bold" : ""}>
                    <td className="border px-4 py-2">{row.date}</td>
                    <td className="border px-4 py-2 text-center">
                      {row.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Price Table */}
            <table className="border-collapse border border-gray-300 bg-white w-full min-w-max">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">date</th>
                  <th className="border px-4 py-2 text-center">Sum of Price</th>
                </tr>
              </thead>
              <tbody>
                {priceData.map((row, index) => (
                  <tr
                    key={index}
                    className={row.isTotal ? "bg-gray-300 font-bold" : ""}>
                    <td className="border px-4 py-2">{row.date}</td>
                    <td className="border px-4 py-2 text-center">{row.sum}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <button className="flex items-center gap-1 bg-[#008000] text-white px-4 py-1.5 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                viewBox="0 0 48 48"
                fill="none">
                <path
                  fill="#FFF"
                  d="M41,10H25v28h16c0.553,0,1-0.447,1-1V11C42,10.447,41.553,10,41,10z"></path>
                <path
                  fill="#4CAF50"
                  d="M32 15H39V18H32zM32 25H39V28H32zM32 30H39V33H32zM32 20H39V23H32zM25 15H30V18H25zM25 25H30V28H25zM25 30H30V33H25zM25 20H30V23H25z"></path>
                <path fill="#FFF" d="M27 42L6 38 6 10 27 6z"></path>
                <path
                  fill="#4CAF50"
                  d="M19.129,31l-2.411-4.561c-0.092-0.171-0.186-0.483-0.284-0.938h-0.037c-0.046,0.215-0.154,0.541-0.324,0.979L13.652,31H9.895l4.462-7.001L10.274,17h3.837l2.001,4.196c0.156,0.331,0.296,0.725,0.42,1.179h0.04c0.078-0.271,0.224-0.68,0.439-1.22L19.237,17h3.515l-4.199,6.939l4.316,7.059h-3.74V31z"></path>
              </svg>
              <span>Export Excel</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderSummary;

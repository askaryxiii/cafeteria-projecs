export function TableRow({ num, order }) {
  return (
    <div className="flex border-b border-gray-300">
      <div className="w-1/4 px-6 py-4 text-gray-900 font-semibold text-center">
        {num}
      </div>
      <div className="flex-1 px-6 py-4 text-gray-700 text-xl font-semibold text-center">
        {order}
      </div>
    </div>
  );
}

export function TableHeader({ label1, label2 }) {
  return (
    <div className="flex bg-gray-200">
      <div className="w-1/4 px-6 py-3 font-bold text-gray-900 text-xl text-center">
        {label1}
      </div>
      <div className="flex-1 px-6 py-3 font-bold text-gray-900 text-xl text-center">
        {label2}
      </div>
    </div>
  );
}

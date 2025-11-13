export default function Table({ children }) {
  return (
    <div className="w-full overflow-x-auto rounded-lg shadow-sm border border-gray-200">
      <table className="w-full border-collapse">{children}</table>
    </div>
  );
}

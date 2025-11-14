export default function Table({ children }) {
  return (
    <div className="w-full overflow-x-auto rounded-lg">
      <table className="w-full border-collapse">{children}</table>
    </div>
  );
}

export default function Table({ children }) {
  return (
    <div className="w-full overflow-x-auto rounded-lg text-xs sm:text-sm md:text-base">
      <table className="w-full border-collapse">{children}</table>
    </div>
  );
}

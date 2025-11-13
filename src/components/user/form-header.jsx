export default function FormHeader() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-4xl font-bold text-blue-950">»</span>
          <h1 className="text-3xl font-bold text-blue-950">PROJECTS</h1>
        </div>
        <p className="text-sm text-gray-600 uppercase tracking-wider">Engineering Consulting Services</p>
      </div>
      <div className="flex gap-2">
        <button className="w-10 h-10 border-2 border-gray-400 rounded flex items-center justify-center hover:bg-gray-200">
          🏠
        </button>
        <button className="w-10 h-10 border-2 border-gray-400 rounded flex items-center justify-center hover:bg-gray-200">
          👤
        </button>
      </div>
    </div>
  )
}

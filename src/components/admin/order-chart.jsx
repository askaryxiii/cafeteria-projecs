import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'

const data = [
  { name: '01', orders: 2200 },
  { name: '02', orders: 2100 },
  { name: '03', orders: 2300 },
  { name: '04', orders: 2000 },
  { name: '05', orders: 2400 },
  { name: '06', orders: 2568 },
]

export default function OrderChart() {
  return (
    <div className="w-full">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" fontSize={12} stroke="#9ca3af" />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              formatter={(value) => `${value} orders`}
            />
            <Line 
              type="monotone" 
              dataKey="orders" 
              stroke="#6366f1" 
              strokeWidth={3}
              dot={{ fill: '#6366f1', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between mt-4 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          <span>Last 6 days</span>
        </div>
        <span>Last Month</span>
      </div>
    </div>
  )
}
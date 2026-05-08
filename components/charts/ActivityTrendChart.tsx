'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface ActivityPoint {
  date: string
  count: number
}

interface ActivityTrendChartProps {
  data?: ActivityPoint[]
  title?: string
}

export function ActivityTrendChart({
  data = [],
  title = '近7天活跃度趋势',
}: ActivityTrendChartProps) {
  // 若无数据，生成占位空白条目
  const chartData =
    data.length > 0
      ? data
      : Array.from({ length: 7 }, (_, i) => {
          const d = new Date()
          d.setDate(d.getDate() - (6 - i))
          return {
            date: `${d.getMonth() + 1}/${d.getDate()}`,
            count: 0,
          }
        })

  return (
    <div className="w-full">
      <h3 className="text-base font-semibold text-gray-700 mb-3">{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
          <Tooltip
            labelFormatter={(label) => `日期：${label}`}
            formatter={(value: number) => [`${value} 次`, '活跃行为']}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#3b82f6"
            fill="url(#activityGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

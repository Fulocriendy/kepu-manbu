'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

const CATEGORY_COLORS: Record<string, string> = {
  astronomy: '#8b5cf6',
  paleontology: '#f59e0b',
  botany: '#10b981',
  ecology: '#3b82f6',
  neighborhood: '#6b7280',
}

const CATEGORY_LABELS: Record<string, string> = {
  astronomy: '天文',
  paleontology: '古生物',
  botany: '植物',
  ecology: '生态',
  neighborhood: '社区',
}

interface CategoryBarItem {
  category: string
  count: number
}

interface CategoryBarChartProps {
  data?: CategoryBarItem[]
  title?: string
}

export function CategoryBarChart({
  data = [],
  title = '各分类资源访问量',
}: CategoryBarChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    label: CATEGORY_LABELS[d.category] ?? d.category,
  }))

  return (
    <div className="w-full">
      <h3 className="text-base font-semibold text-gray-700 mb-3">{title}</h3>
      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
          暂无数据
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip
              formatter={(value: number) => [`${value} 次`, '访问次数']}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CATEGORY_COLORS[entry.category] ?? '#3b82f6'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

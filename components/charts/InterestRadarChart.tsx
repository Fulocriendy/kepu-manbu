'use client'

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

interface InterestTag {
  category: string
  label: string
  value: number
  fullMark: number
}

interface InterestRadarChartProps {
  data?: InterestTag[]
}

const DEFAULT_DATA: InterestTag[] = [
  { category: 'astronomy', label: '天文', value: 0, fullMark: 100 },
  { category: 'paleontology', label: '古生物', value: 0, fullMark: 100 },
  { category: 'botany', label: '植物', value: 0, fullMark: 100 },
  { category: 'ecology', label: '生态', value: 0, fullMark: 100 },
  { category: 'neighborhood', label: '社区', value: 0, fullMark: 100 },
]

export function InterestRadarChart({ data = DEFAULT_DATA }: InterestRadarChartProps) {
  return (
    <div className="w-full">
      <h3 className="text-base font-semibold text-gray-700 mb-3">兴趣分布雷达图</h3>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis
            dataKey="label"
            tick={{ fontSize: 13, fill: '#555' }}
          />
          <Radar
            name="兴趣指数"
            dataKey="value"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.35}
          />
          <Tooltip
            formatter={(value: number) => [`${value}`, '兴趣指数']}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { InterestRadarChart } from '@/components/charts/InterestRadarChart'
import { ActivityTrendChart } from '@/components/charts/ActivityTrendChart'
import { CategoryBarChart } from '@/components/charts/CategoryBarChart'
import { getActivityStats, getUserActivities } from '@/lib/supabase/queries'

const CATEGORY_LABELS: Record<string, string> = {
  astronomy: '天文',
  paleontology: '古生物',
  botany: '植物',
  ecology: '生态',
  neighborhood: '社区',
}

const HONOR_LEVELS = {
  explorer: { label: '探索者', emoji: '🔍', color: 'bg-green-100 text-green-800' },
  communicator: { label: '传播者', emoji: '📢', color: 'bg-blue-100 text-blue-800' },
  leader: { label: '领袖', emoji: '🏆', color: 'bg-yellow-100 text-yellow-800' },
}

interface ResidentPortraitProps {
  userId: string
  userNickname?: string
  userPoints?: number
  honorLevel?: 'explorer' | 'communicator' | 'leader' | null
}

export function ResidentPortrait({
  userId,
  userNickname = '居民',
  userPoints = 0,
  honorLevel,
}: ResidentPortraitProps) {
  const [activities, setActivities] = useState<any[]>([])
  const [activityStats, setActivityStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    loadData()
  }, [userId])

  async function loadData() {
    setLoading(true)
    try {
      const [actRes, statsRes] = await Promise.all([
        getUserActivities(userId, 50),
        getActivityStats(7),
      ])
      setActivities(actRes.data || [])
      setActivityStats(statsRes.data || [])
    } catch (e) {
      console.error('Failed to load portrait data:', e)
    } finally {
      setLoading(false)
    }
  }

  // --- 兴趣雷达图数据 ---
  const interestData = useMemo(() => {
    const counts: Record<string, number> = {
      astronomy: 0, paleontology: 0, botany: 0, ecology: 0, neighborhood: 0,
    }
    activities.forEach((a) => {
      if (a.resource?.category && counts[a.resource.category] !== undefined) {
        counts[a.resource.category]++
      }
    })
    const max = Math.max(...Object.values(counts), 1)
    return Object.entries(counts).map(([category, value]) => ({
      category,
      label: CATEGORY_LABELS[category],
      value: Math.round((value / max) * 100),
      fullMark: 100,
    }))
  }, [activities])

  // --- 近7天趋势数据 ---
  const trendData = useMemo(() => {
    const map: Record<string, number> = {}
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const key = `${d.getMonth() + 1}/${d.getDate()}`
      map[key] = 0
    }
    ;(activityStats || []).forEach((a: any) => {
      if (!a.created_at) return
      const d = new Date(a.created_at)
      const key = `${d.getMonth() + 1}/${d.getDate()}`
      if (map[key] !== undefined) map[key]++
    })
    return Object.entries(map).map(([date, count]) => ({ date, count }))
  }, [activityStats])

  // --- 分类访问量柱状图 ---
  const categoryBarData = useMemo(() => {
    const counts: Record<string, number> = {}
    activities.forEach((a) => {
      const cat = a.resource?.category
      if (cat) counts[cat] = (counts[cat] || 0) + 1
    })
    return Object.entries(counts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
  }, [activities])

  const honor = honorLevel ? HONOR_LEVELS[honorLevel] : null

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* 头部用户信息 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-2xl text-white font-bold">
              {userNickname.charAt(0)}
            </div>
            <div>
              <CardTitle className="text-xl">{userNickname}</CardTitle>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm text-gray-600">
                  🏅 积分：<span className="font-semibold text-blue-600">{userPoints}</span>
                </span>
                {honor && (
                  <Badge className={honor.color}>
                    {honor.emoji} {honor.label}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : (
        <>
          {/* 数据总览卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: '总互动次数', value: activities.length, emoji: '⚡' },
              { label: '音频播放', value: activities.filter(a => a.action_type === 'play_audio').length, emoji: '🎧' },
              { label: 'AR体验', value: activities.filter(a => a.action_type === 'scan_ar').length, emoji: '📱' },
              { label: '搜索次数', value: activities.filter(a => a.action_type === 'search').length, emoji: '🔍' },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="pt-4 text-center">
                  <div className="text-3xl mb-1">{stat.emoji}</div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 图表区域：三列布局 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <InterestRadarChart data={interestData} />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <ActivityTrendChart data={trendData} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <CategoryBarChart data={categoryBarData} title="我的分类访问偏好" />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

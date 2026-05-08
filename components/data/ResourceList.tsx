'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Resource } from '@/lib/supabase/types'

const CATEGORY_INFO = {
  astronomy: { label: '天文', emoji: '🔭', color: 'bg-purple-100 text-purple-800' },
  paleontology: { label: '古生物', emoji: '🦕', color: 'bg-amber-100 text-amber-800' },
  botany: { label: '植物', emoji: '🌿', color: 'bg-green-100 text-green-800' },
  ecology: { label: '生态', emoji: '🌍', color: 'bg-blue-100 text-blue-800' },
  neighborhood: { label: '社区', emoji: '🏘️', color: 'bg-gray-100 text-gray-800' },
}

const TYPE_INFO = {
  audio: { label: '音频', emoji: '🎧' },
  video: { label: '视频', emoji: '🎬' },
  ar_model: { label: 'AR模型', emoji: '📱' },
  text: { label: '图文', emoji: '📖' },
}

interface ResourceListProps {
  resources: Resource[]
  onResourceClick: (resource: Resource) => void
  searchTerm?: string
}

export function ResourceList({ resources, onResourceClick, searchTerm }: ResourceListProps) {
  // 过滤搜索结果
  const filteredResources = useMemo(() => {
    if (!searchTerm) return resources
    const term = searchTerm.toLowerCase()
    return resources.filter(r => 
      r.title?.toLowerCase().includes(term) ||
      r.description?.toLowerCase().includes(term)
    )
  }, [resources, searchTerm])

  if (filteredResources.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          没有找到相关资源
        </h3>
        <p className="text-gray-600">
          尝试调整搜索关键词或筛选条件
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredResources.map((resource) => {
        const catInfo = CATEGORY_INFO[resource.category] || CATEGORY_INFO.neighborhood
        const typeInfo = TYPE_INFO[resource.type] || TYPE_INFO.text

        return (
          <Card 
            key={resource.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onResourceClick(resource)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg line-clamp-2">
                  {resource.title}
                </CardTitle>
              </div>
              <div className="flex gap-2 mt-2">
                <Badge className={catInfo.color}>
                  {catInfo.emoji} {catInfo.label}
                </Badge>
                <Badge variant="outline">
                  {typeInfo.emoji} {typeInfo.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {resource.description && (
                <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                  {resource.description}
                </p>
              )}
              
              {/* 标签 */}
              {resource.tags && Array.isArray(resource.tags) && resource.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {(resource.tags as string[]).slice(0, 3).map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                  {(resource.tags as string[]).length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{(resource.tags as string[]).length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* 来源 */}
              {resource.source_provider && (
                <p className="text-xs text-gray-500">
                  来源：{resource.source_provider}
                </p>
              )}

              {/* 时长 */}
              {resource.duration_seconds && (
                <p className="text-xs text-gray-500 mt-1">
                  时长：{Math.floor(resource.duration_seconds / 60)}分{resource.duration_seconds % 60}秒
                </p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

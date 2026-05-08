'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Resource } from '@/lib/supabase/types'

const CATEGORY_INFO = {
  astronomy: { label: '天文', emoji: '🔭', color: 'bg-purple-100 text-purple-800' },
  paleontology: { label: '古生物', emoji: '🦕', color: 'bg-amber-100 text-amber-800' },
  botany: { label: '植物', emoji: '🌿', color: 'bg-green-100 text-green-800' },
  ecology: { label: '生态', emoji: '🌍', color: 'bg-blue-100 text-blue-800' },
  neighborhood: { label: '社区', emoji: '🏘️', color: 'bg-gray-100 text-gray-800' },
}

const TYPE_INFO = {
  audio: { label: '音频', emoji: '🎧', color: 'bg-pink-100 text-pink-800' },
  video: { label: '视频', emoji: '🎬', color: 'bg-red-100 text-red-800' },
  ar_model: { label: 'AR模型', emoji: '📱', color: 'bg-indigo-100 text-indigo-800' },
  text: { label: '图文', emoji: '📖', color: 'bg-teal-100 text-teal-800' },
}

interface ResourceDetailProps {
  resource: Resource
  onBack: () => void
}

export function ResourceDetail({ resource, onBack }: ResourceDetailProps) {
  const catInfo = CATEGORY_INFO[resource.category] || CATEGORY_INFO.neighborhood
  const typeInfo = TYPE_INFO[resource.type] || TYPE_INFO.text

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* 返回按钮 */}
      <Button variant="ghost" onClick={onBack} className="mb-4">
        ← 返回资源列表
      </Button>

      {/* 标题区域 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={catInfo.color}>
            {catInfo.emoji} {catInfo.label}
          </Badge>
          <Badge className={typeInfo.color}>
            {typeInfo.emoji} {typeInfo.label}
          </Badge>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {resource.title}
        </h1>

        {resource.description && (
          <p className="text-lg text-gray-700 mb-4">
            {resource.description}
          </p>
        )}

        {/* 元信息 */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {resource.source_provider && (
            <span>📢 来源：{resource.source_provider}</span>
          )}
          {resource.duration_seconds && (
            <span>⏱️ 时长：{Math.floor(resource.duration_seconds / 60)}分{resource.duration_seconds % 60}秒</span>
          )}
        </div>
      </div>

      {/* 内容区域 */}
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">内容</TabsTrigger>
          <TabsTrigger value="related">相关内容</TabsTrigger>
          <TabsTrigger value="feedback">反馈</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>资源内容</CardTitle>
            </CardHeader>
            <CardContent>
              {resource.content_url ? (
                <div className="space-y-4">
                  <p className="text-gray-600">点击下方按钮访问完整内容：</p>
                  <Button asChild>
                    <a href={resource.content_url} target="_blank" rel="noopener noreferrer">
                      打开资源链接 →
                    </a>
                  </Button>
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  暂无内容链接
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="related" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>相关推荐</CardTitle>
            </CardHeader>
            <CardContent>
              {/* 标签 */}
              {resource.tags && Array.isArray(resource.tags) && resource.tags.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">标签：</h4>
                  <div className="flex flex-wrap gap-2">
                    {(resource.tags as string[]).map((tag, idx) => (
                      <Badge key={idx} variant="secondary">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <p className="text-gray-500">
                更多相关内容将根据标签自动推荐
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>用户反馈</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-4">
                您对这份资源有什么感受？
              </p>
              <div className="flex gap-4">
                <Button variant="outline">👍 有帮助</Button>
                <Button variant="outline">📝 写评论</Button>
                <Button variant="outline">🔖 收藏</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

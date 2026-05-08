'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const CATEGORIES = [
  { value: 'astronomy', label: '天文', emoji: '🔭' },
  { value: 'paleontology', label: '古生物', emoji: '🦕' },
  { value: 'botany', label: '植物', emoji: '🌿' },
  { value: 'ecology', label: '生态', emoji: '🌍' },
  { value: 'neighborhood', label: '社区', emoji: '🏘️' },
]

interface ResourceFilterProps {
  currentCategory?: string
  onSearch: (search: string) => void
  onCategoryChange: (category: string) => void
}

export function ResourceFilter({ currentCategory, onSearch, onCategoryChange }: ResourceFilterProps) {
  const [searchValue, setSearchValue] = useState('')

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(e.target.value)
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSearch(searchValue)
  }

  function handleCategoryChange(value: string) {
    onCategoryChange(value === 'all' ? '' : value)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
      {/* 搜索栏 */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="搜索科普资源..."
          value={searchValue}
          onChange={handleSearchChange}
          className="flex-1"
        />
        <Button type="submit" variant="default">
          搜索
        </Button>
      </form>

      {/* 分类筛选 */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium text-gray-700">分类：</span>
        
        {/* 快速筛选按钮 */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!currentCategory ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange('')}
          >
            全部
          </Button>
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.value}
              variant={currentCategory === cat.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategoryChange(cat.value)}
              className="flex items-center gap-1"
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* 统计信息 */}
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>按分类浏览：</span>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <Badge
              key={cat.value}
              variant={currentCategory === cat.value ? 'default' : 'secondary'}
              className="cursor-pointer"
              onClick={() => onCategoryChange(cat.value)}
            >
              {cat.emoji} {cat.label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

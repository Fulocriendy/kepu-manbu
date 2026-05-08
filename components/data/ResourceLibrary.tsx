'use client'

import { useState, useEffect } from 'react'
import { getResources } from '@/lib/supabase/queries'
import type { Resource } from '@/lib/supabase/types'
import { ResourceList } from './ResourceList'
import { ResourceFilter } from './ResourceFilter'
import { ResourceDetail } from './ResourceDetail'

interface CategoryFilter {
  category?: string
  type?: string
  search?: string
}

export function ResourceLibrary() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [filter, setFilter] = useState<CategoryFilter>({})

  useEffect(() => {
    loadResources()
  }, [filter])

  async function loadResources() {
    setLoading(true)
    try {
      const { data, error } = await getResources(filter.category)
      if (error) throw error
      setResources(data || [])
    } catch (error) {
      console.error('Failed to load resources:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(searchTerm: string) {
    setFilter(prev => ({ ...prev, search: searchTerm }))
  }

  function handleCategoryChange(category: string) {
    setFilter(prev => ({ ...prev, category: category || undefined }))
  }

  function handleResourceClick(resource: Resource) {
    setSelectedResource(resource)
  }

  function handleBack() {
    setSelectedResource(null)
  }

  if (selectedResource) {
    return (
      <ResourceDetail 
        resource={selectedResource} 
        onBack={handleBack}
      />
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          科普资源库
        </h1>
        <p className="text-gray-600">
          探索天文、古生物、植物、生态、社区五大领域的科普资源
        </p>
      </div>

      <ResourceFilter
        currentCategory={filter.category}
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
      />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <ResourceList
          resources={resources}
          onResourceClick={handleResourceClick}
          searchTerm={filter.search}
        />
      )}
    </div>
  )
}

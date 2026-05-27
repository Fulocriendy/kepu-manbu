'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ResidentPortrait } from '@/components/data'

function PortraitContent() {
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId') ?? ''

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">请先登录以查看居民画像</p>
      </div>
    )
  }

  return <ResidentPortrait userId={userId} />
}

export default function PortraitPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    }>
      <PortraitContent />
    </Suspense>
  )
}

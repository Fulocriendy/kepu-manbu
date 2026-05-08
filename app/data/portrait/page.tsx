'use client'

import { useSearchParams } from 'next/navigation'
import { ResidentPortrait } from '@/components/data'

export default function PortraitPage() {
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

// Supabase 数据库类型定义
// 由成员1维护，成员3消费

export interface Resource {
  id: string
  title: string
  description?: string
  category: 'astronomy' | 'paleontology' | 'botany' | 'ecology' | 'neighborhood'
  type: 'audio' | 'video' | 'ar_model' | 'text'
  content_url?: string
  thumbnail_url?: string
  duration_seconds?: number
  tags?: string[]
  source_provider?: string
  created_at: string
  updated_at: string
}

export interface Device {
  id: string
  name: string
  type: 'audio_station' | 'screen' | 'ar_point' | 'star_corner'
  status: 'online' | 'offline' | 'maintenance'
  location?: string
  lat?: number
  lng?: number
  battery_level: number
  last_active: string
  created_at: string
  updated_at: string
}

export interface Activity {
  id: string
  user_id: string
  action_type: 'play_audio' | 'scan_ar' | 'browse' | 'search' | 'share'
  resource_id?: string
  resource?: Resource
  duration_seconds?: number
  created_at: string
}

export interface User {
  id: string
  nickname: string
  avatar_url?: string
  points: number
  honor_level: 'explorer' | 'communicator' | 'leader' | null
  created_at: string
  updated_at: string
}

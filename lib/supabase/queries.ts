// Supabase 数据库查询接口
// 由成员1维护，成员3调用
import { supabase } from './client'
import type { Resource, Device, Activity } from './types'

/**
 * 获取科普资源列表
 * @param category 可选，按分类过滤
 */
export async function getResources(category?: string) {
  let query = supabase
    .from('resources')
    .select('*')
    .order('created_at', { ascending: false })

  if (category) {
    query = query.eq('category', category)
  }

  return query
}

/**
 * 获取设备列表
 * @param status 可选，按状态过滤
 */
export async function getDevices(status?: 'online' | 'offline' | 'maintenance') {
  let query = supabase
    .from('devices')
    .select('*')
    .order('name')

  if (status) {
    query = query.eq('status', status)
  }

  return query
}

/**
 * 获取用户行为记录
 * @param userId 用户ID
 * @param limit 返回条数
 */
export async function getUserActivities(userId: string, limit = 50) {
  return supabase
    .from('activities')
    .select('*, resource:resources(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
}

/**
 * 获取活跃统计数据
 * @param days 统计天数
 */
export async function getActivityStats(days = 7) {
  const since = new Date()
  since.setDate(since.getDate() - days)

  return supabase
    .from('activities')
    .select('created_at')
    .gte('created_at', since.toISOString())
}

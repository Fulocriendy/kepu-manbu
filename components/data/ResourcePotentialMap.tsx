'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getDevices } from '@/lib/supabase/queries'
import type { Device } from '@/lib/supabase/types'

// Leaflet 动态导入（SSR 安全）
let L: any = null
let HeatLayer: any = null

const DEVICE_TYPE_INFO = {
  audio_station: { label: '音频站', emoji: '🔊', color: '#8b5cf6' },
  screen: { label: '科普屏', emoji: '🖥️', color: '#3b82f6' },
  ar_point: { label: 'AR点位', emoji: '📱', color: '#10b981' },
  star_corner: { label: '星空角', emoji: '⭐', color: '#f59e0b' },
}

const STATUS_STYLE = {
  online: { label: '在线', color: 'bg-green-100 text-green-800' },
  offline: { label: '离线', color: 'bg-red-100 text-red-800' },
  maintenance: { label: '维护中', color: 'bg-yellow-100 text-yellow-800' },
}

// 默认中心坐标（展览路街道，北京市海淀区）
const DEFAULT_CENTER: [number, number] = [39.9505, 116.3313]
const DEFAULT_ZOOM = 15

type LayerToggle = {
  base: boolean
  devices: boolean
  heatmap: boolean
}

export function ResourcePotentialMap() {
  const mapRef = useRef<any>(null)
  const mapDivRef = useRef<HTMLDivElement>(null)
  const markersLayerRef = useRef<any>(null)
  const heatLayerRef = useRef<any>(null)

  const [devices, setDevices] = useState<Device[]>([])
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [loading, setLoading] = useState(true)
  const [layers, setLayers] = useState<LayerToggle>({
    base: true,
    devices: true,
    heatmap: false,
  })

  // 加载设备数据
  useEffect(() => {
    async function loadDevices() {
      try {
        const { data } = await getDevices()
        setDevices(data || [])
      } catch (e) {
        console.error('Failed to load devices:', e)
      } finally {
        setLoading(false)
      }
    }
    loadDevices()
  }, [])

  // 初始化地图
  useEffect(() => {
    if (typeof window === 'undefined' || mapRef.current || !mapDivRef.current) return

    async function initMap() {
      L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')
      const leafletHeat = await import('leaflet.heat')
      HeatLayer = leafletHeat.default

      // 修复默认 icon 路径
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapDivRef.current!, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: true,
      })

      // 基础底图（OpenStreetMap）
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      // 标记层组
      markersLayerRef.current = L.layerGroup().addTo(map)

      mapRef.current = map
    }

    initMap()

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  // 设备点位渲染
  useEffect(() => {
    if (!mapRef.current || !L || !markersLayerRef.current) return

    markersLayerRef.current.clearLayers()
    if (!layers.devices) return

    devices.forEach((device) => {
      if (device.lat == null || device.lng == null) return

      const info = DEVICE_TYPE_INFO[device.type] || DEVICE_TYPE_INFO.screen
      const statusStyle = STATUS_STYLE[device.status] || STATUS_STYLE.offline

      const icon = L.divIcon({
        html: `<div style="
          background:${info.color};
          width:32px; height:32px;
          border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          font-size:16px;
          border:3px solid white;
          box-shadow:0 2px 6px rgba(0,0,0,0.3);
          cursor:pointer;
        ">${info.emoji}</div>`,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })

      const marker = L.marker([device.lat, device.lng], { icon })
        .on('click', () => setSelectedDevice(device))
        .bindTooltip(device.name, { direction: 'top', offset: [0, -16] })

      markersLayerRef.current!.addLayer(marker)
    })
  }, [devices, layers.devices])

  // 热力图层渲染
  useEffect(() => {
    if (!mapRef.current || !L) return

    if (heatLayerRef.current) {
      mapRef.current.removeLayer(heatLayerRef.current)
      heatLayerRef.current = null
    }
    if (!layers.heatmap) return

    const heatPoints = devices
      .filter((d) => d.lat != null && d.lng != null)
      .map((d) => [d.lat!, d.lng!, d.battery_level / 100])

    if (heatPoints.length === 0) return

    try {
      heatLayerRef.current = (L as any).heatLayer(heatPoints, {
        radius: 35,
        blur: 20,
        maxZoom: 17,
        gradient: { 0.2: '#3b82f6', 0.5: '#10b981', 0.8: '#f59e0b', 1.0: '#ef4444' },
      }).addTo(mapRef.current)
    } catch {
      console.warn('leaflet.heat not available, skipping heatmap')
    }
  }, [devices, layers.heatmap])

  // 图层开关
  function toggleLayer(key: keyof LayerToggle) {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // 统计
  const stats = useMemo(() => ({
    total: devices.length,
    online: devices.filter((d) => d.status === 'online').length,
    offline: devices.filter((d) => d.status === 'offline').length,
    maintenance: devices.filter((d) => d.status === 'maintenance').length,
  }), [devices])

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">资源潜力地图</h1>
        <p className="text-gray-600 text-sm mt-1">
          展示辖区内科普设施点位分布与活跃热力
        </p>
      </div>

      {/* 设备统计概览 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '设备总数', value: stats.total, color: 'text-blue-600' },
          { label: '在线', value: stats.online, color: 'text-green-600' },
          { label: '离线', value: stats.offline, color: 'text-red-600' },
          { label: '维护中', value: stats.maintenance, color: 'text-yellow-600' },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-3 text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 图层控制 */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-700 self-center">图层：</span>
        <Button
          size="sm"
          variant={layers.devices ? 'default' : 'outline'}
          onClick={() => toggleLayer('devices')}
        >
          📍 设备点位
        </Button>
        <Button
          size="sm"
          variant={layers.heatmap ? 'default' : 'outline'}
          onClick={() => toggleLayer('heatmap')}
        >
          🌡️ 热力图
        </Button>
      </div>

      <div className="flex gap-4">
        {/* 地图主体 */}
        <div className="flex-1 relative rounded-xl overflow-hidden shadow border" style={{ height: 480 }}>
          {loading && (
            <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
            </div>
          )}
          <div ref={mapDivRef} style={{ width: '100%', height: '100%' }} />
        </div>

        {/* 设备详情侧栏 */}
        {selectedDevice && (
          <div className="w-72 shrink-0">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{selectedDevice.name}</CardTitle>
                  <button
                    onClick={() => setSelectedDevice(null)}
                    className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                  >
                    ✕
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {(() => {
                  const info = DEVICE_TYPE_INFO[selectedDevice.type] || DEVICE_TYPE_INFO.screen
                  const statusStyle = STATUS_STYLE[selectedDevice.status] || STATUS_STYLE.offline
                  return (
                    <>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline">{info.emoji} {info.label}</Badge>
                        <Badge className={statusStyle.color}>{statusStyle.label}</Badge>
                      </div>

                      {selectedDevice.location && (
                        <div className="text-sm text-gray-700">
                          <span className="font-medium">位置：</span>
                          {selectedDevice.location}
                        </div>
                      )}

                      {selectedDevice.lat != null && selectedDevice.lng != null && (
                        <div className="text-xs text-gray-500">
                          坐标：{selectedDevice.lat.toFixed(5)}, {selectedDevice.lng.toFixed(5)}
                        </div>
                      )}

                      <div className="text-sm">
                        <span className="font-medium">电量：</span>
                        <div className="mt-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              selectedDevice.battery_level > 50 ? 'bg-green-500' :
                              selectedDevice.battery_level > 20 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${selectedDevice.battery_level}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 mt-1">
                          {selectedDevice.battery_level}%
                        </span>
                      </div>

                      <div className="text-xs text-gray-500">
                        最后活跃：{new Date(selectedDevice.last_active).toLocaleString('zh-CN')}
                      </div>
                    </>
                  )
                })()}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* 图例 */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        <span className="font-medium">图例：</span>
        {Object.entries(DEVICE_TYPE_INFO).map(([key, val]) => (
          <span key={key} className="flex items-center gap-1">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: val.color }}
            />
            {val.emoji} {val.label}
          </span>
        ))}
      </div>
    </div>
  )
}

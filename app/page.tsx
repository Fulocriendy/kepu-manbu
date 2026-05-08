import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* 头部 */}
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">🔭 科普漫步</h1>
          <nav className="flex gap-6 text-sm">
            <Link href="/data/resources" className="hover:text-blue-600">资源库</Link>
            <Link href="/data/portrait?userId=demo" className="hover:text-blue-600">我的画像</Link>
            <Link href="/data/map" className="hover:text-blue-600">设施地图</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          让科普走进<br />每一个社区
        </h2>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          展览路街道科普教育互动平台，汇聚天文、古生物、植物、生态、社区五大领域资源，
          通过音频、视频、AR等多媒体形式，让科学知识触手可及。
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/data/resources"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            探索资源库 →
          </Link>
          <Link
            href="/data/map"
            className="px-8 py-3 bg-white border text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            查看设施地图
          </Link>
        </div>

        {/* 分类卡片 */}
        <div className="grid grid-cols-5 gap-4 mt-16">
          {[
            { emoji: '🔭', label: '天文', color: 'bg-purple-50 border-purple-200' },
            { emoji: '🦕', label: '古生物', color: 'bg-amber-50 border-amber-200' },
            { emoji: '🌿', label: '植物', color: 'bg-green-50 border-green-200' },
            { emoji: '🌍', label: '生态', color: 'bg-blue-50 border-blue-200' },
            { emoji: '🏘️', label: '社区', color: 'bg-gray-50 border-gray-200' },
          ].map((cat) => (
            <div key={cat.label} className={`p-6 rounded-xl border ${cat.color} text-center`}>
              <div className="text-4xl mb-2">{cat.emoji}</div>
              <div className="font-medium text-gray-800">{cat.label}</div>
            </div>
          ))}
        </div>
      </main>

      {/* 数据概览 */}
      <section className="bg-white border-t mt-12">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <h3 className="text-center text-gray-500 text-sm uppercase tracking-wider mb-8">
            平台数据概览
          </h3>
          <div className="grid grid-cols-4 gap-8 text-center">
            {[
              { value: '200+', label: '科普资源' },
              { value: '50+', label: '智能设施' },
              { value: '5', label: '内容领域' },
              { value: '1000+', label: '活跃居民' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

# 科普漫步 (kepu-manbu)

社区科普教育互动平台，基于 Next.js 14 + Supabase 构建。

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI组件**: shadcn/ui + Tailwind CSS
- **数据可视化**: Recharts
- **地图**: Leaflet + leaflet.heat
- **后端**: Supabase (PostgreSQL + Auth + Realtime)

## 快速开始

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 填写 .env.local 中的 Supabase 配置

# 开发
npm run dev
```

## 目录结构

```
├── app/                    # Next.js App Router 页面
│   ├── data/
│   │   ├── resources/      # 科普资源库
│   │   ├── portrait/       # 居民画像
│   │   └── map/           # 资源潜力地图
│   └── page.tsx           # 首页
├── components/
│   ├── ui/               # shadcn/ui 基础组件
│   ├── charts/           # 数据图表组件
│   └── data/            # 数据展示层组件
└── lib/
    └── supabase/         # Supabase 客户端
```

## 团队分工

- **成员1**: 基础架构（框架/Supabase配置）
- **成员2**: 导航与首页（Header/Footer/Layout）
- **成员3**: 数据层（资源库/居民画像/潜力地图）
- **成员4**: 管理后台

## 许可证

MIT

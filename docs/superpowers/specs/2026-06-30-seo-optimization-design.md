# SEO 全面优化 — 设计规格说明

**日期：** 2026-06-30  
**目标：** 对永益吹塑网站进行全面的 SEO 优化，提升搜索引擎排名，增加搜索结果子链接（sitelinks），覆盖中英西三语国内外市场。

---

## 一、整体架构与页面结构

将当前 4 页扁平结构扩展为约 20 页的层级结构：

```
yy-hz.com/
├── /                   关于我们 (index.html)
├── /products/          产品总览 (product.html)
│   ├── /products/kayak/          吹塑皮划艇
│   ├── /products/cooler-box/     蓝色保温箱
│   ├── /products/table-set/      户外桌凳套装
│   ├── /products/slide/          儿童滑梯
│   ├── /products/playhouse/      儿童游戏屋
│   ├── /products/tool-box/       工具箱
│   ├── /products/traffic-cone/   路锥
│   ├── /products/chemical-drum/  化工桶
│   ├── /products/vent-duct/      汽车通风管
│   ├── /products/water-tank/     蓄水箱
│   ├── /products/pallet/         托盘
│   └── /products/humidifier/     加湿器水壶
├── /hardware/          硬件实力 (hardware.html)
├── /team/              领导团队 (team.html)
├── /faq/               常见问题（新增）
├── /blog/              行业资讯（新增，后续迭代）
└── /contact/           联系/报价（新增独立页，从弹窗升级）
```

**URL 策略：** 通过 `.htaccess` 重写去掉 `.html` 后缀，使用干净 URL。

**多语言 URL 结构：**
- 中文（默认）：`https://yy-hz.com/products/kayak/`
- 英文：`https://yy-hz.com/en/products/kayak/`
- 西班牙语：`https://yy-hz.com/es/products/kayak/`

---

## 二、元数据与结构化数据

### 2.1 Meta 标签（每页必备）

- `<title>`：含主关键词，每页不重复，格式 `页面主题 — 关键词 | 品牌名`
- `<meta name="description">`：150-160 字符，含关键词，有吸引力
- `<link rel="canonical">`：指向规范 URL
- Open Graph 标签：`og:title`、`og:description`、`og:image`、`og:url`、`og:type`
- Twitter Card：`twitter:card`、`twitter:title`、`twitter:description`、`twitter:image`
- hreflang：每个页面声明中/英/西三语对应关系

### 2.2 修复 `lang` 属性

初始值改为 `lang="zh-CN"`，JS 语言切换时动态更新。

### 2.3 结构化数据（JSON-LD）

| 页面 | Schema 类型 |
|------|------------|
| 全站 | Organization、WebSite（含 SearchAction） |
| 产品列表 | ItemList |
| 产品详情页 | Product（含 name、description、image、category、manufacturer） |
| 硬件页 | 不强制，可加 Product 或 Article |
| 团队页 | Person ×3（各自含 jobTitle、description 等） |
| FAQ 页 | FAQPage（每个问答一组 Question/Answer） |
| 联系页 | ContactPage |
| 所有内页 | BreadcrumbList |

---

## 三、内容与内链策略

### 3.1 面包屑导航

全站统一使用 `<nav aria-label="breadcrumb">` + `<ol>` 结构，配合 BreadcrumbList 结构化数据。

### 3.2 产品详情页模板

每个产品详情页包含：
1. 产品大图
2. 产品名称 + 一句话卖点
3. 规格参数表
4. 产品描述（200-300 字）
5. 应用场景（含使用场景图）
6. 认证标识
7. CTA 按钮
8. 相关产品推荐（3-4 个）

Title 格式：`产品名 — 核心卖点关键词 | 永益吹塑`  
Description：含产品关键词、规格亮点和 CTA 引导。

### 3.3 交叉推荐链接

产品详情页之间根据品类关联性互相推荐，形成内链网络。

### 3.4 FAQ 页面内容

回答潜在客户常搜问题，如：
- 吹塑工艺介绍
- 最小起订量
- OEM/ODM 定制流程
- 出口认证
- 工厂参观
- 交货周期

配合 FAQPage 结构化数据。

### 3.5 博客（可选，后续迭代）

每月 1-2 篇行业文章，覆盖长尾关键词。

---

## 四、性能与技术优化

### 4.1 图片优化

- 压缩所有图片至合理大小（产品图 ≤200KB）
- 生成多尺寸响应式图片（400w、800w）
- 使用 `srcset` + `sizes` 属性
- 优化 `alt` 文本，含描述性关键词
- 所有图片添加明确的 `width`/`height` 属性防止 CLS

### 4.2 CSS/JS 优化

- 生成 `main.min.css` 和 `main.min.js` 压缩版本
- HTML 引用压缩版本
- 关键 CSS 内联到 `<head>` 或使用 `preload`

### 4.3 .htaccess 优化

- URL 重写：去掉 `.html` 后缀
- HTML 缓存策略：改为 `max-age=3600`（配合版本号刷新）
- 静态资源长期缓存：`max-age=31536000, immutable`
- 启用 Gzip 压缩
- 强制 HTTPS 重定向（如已部署 SSL）

### 4.4 Sitemap 完善

- 包含全部页面 URL
- 每个 URL 含 hreflang 备用链接
- 添加 `<lastmod>`、`<changefreq>`、`<priority>`
- 产品页可含 `<image:image>` 图片信息

### 4.5 其他

- 新增 404 页面（含导航和搜索建议）
- 全站 HTTPS
- 确保移动端响应式体验良好
- 机器人元标签：重要页面 `index,follow`，非重要页面按需调整

---

## 实施顺序

1. **第一阶段（基础修复）：** 修复 lang、添加 meta description/canonical/OG/hreflang、修正 sitemap、.htaccess 优化
2. **第二阶段（结构化数据）：** 添加全站 JSON-LD、面包屑导航
3. **第三阶段（内容扩展）：** 创建 12 个产品详情页、FAQ 页、联系页
4. **第四阶段（性能优化）：** 图片压缩、CSS/JS 压缩、缓存策略调优
5. **第五阶段（后续迭代）：** 博客板块、404 页面、细化各页内容

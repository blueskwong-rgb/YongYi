# 全站路径问题排查与修复日志

> 最后更新：2026-07-22
> 项目：永益吹塑官网 (yy-hz.com)

---

## 一、问题现象

线上部署后，点击导航栏链接出现的网页动态效果丢失，只有纯文字。

---

## 二、排查过程（3 轮，2 次失败）

### 第 1 轮：`document.write` 注入 `<base>` ❌

**假设：** `.htaccess` 将 URL 重写到 `/hardware/`（带斜杠），相对路径 `assets/css/main.css` 被错误解析。

**尝试：** 用 `document.write('<base href="/">')` 仅在线上注入 `<base>` 标签。

**失败原因：** 浏览器**预加载扫描器**（preload scanner）在脚本执行前就开始抓取资源，缓存了 404 响应。

### 第 2 轮：修改 `.htaccess` 去尾部斜杠 ❌

**尝试：** 去掉干净 URL 的尾部斜杠（`/hardware/` → `/hardware`）。

**失败原因：** 用户 URL 带有 `/zh/` 语言前缀（`/zh/hardware/`），`assets/css/main.css` 解析到 `/zh/assets/css/main.css`，而 `.htaccess` 中的资源修正规则在用户的服务器上未生效。

### 第 3 轮：根相对路径 `/assets/...` ❌（本地失效）

**尝试：** 所有资源路径改为 `/assets/...`（根相对路径），彻底不受 URL 影响。

**失败原因：** `file://` 协议下 `/assets/...` 指向磁盘根目录 `C:\assets\...`，本地双击打开全部失效。

---

## 三、最终方案 ✅

### 核心思路

在 HTML 中**直接写** `<base href="/">`，然后用一个紧跟其后的脚本在 `file://` 协议下**移除**它。

```html
<head>
<meta charset="UTF-8">
<base href="/">
<script>if(location.protocol==='file:'){var b=document.querySelector('base');if(b)b.remove();}</script>
```

### 工作原理

| 环境 | `<base>` 状态 | `assets/css/main.css` 解析为 |
|------|:---:|---|
| 线上 `https://` | **保留** | `https://yy-hz.com/assets/css/main.css` ✅ |
| 本地 `file://` | **被移除** | 相对于文件位置的正确路径 ✅ |
| `/zh/hardware/` | **保留** | `https://yy-hz.com/assets/css/main.css` ✅ |
| `/products/kayak/` | **保留** | `https://yy-hz.com/assets/css/main.css` ✅ |

**无论 URL 是什么深度、什么前缀，资源路径永远正确。**

### 修改范围

```
19 个 HTML 文件 — 每个加 2 行（<base> + 移除脚本）
assets/css/main.css — 未修改
assets/js/main.js   — 未修改
.htaccess           — 未修改
```

### 为什么之前 `document.write` 失败，这次直接写 `<base>` 能行？

- `document.write` 方案：浏览器解析到 `<script>` 时才写入 `<base>`，预加载扫描器早已用错误路径抓取了资源
- 直接写 `<base>` 方案：`<base>` 就在 HTML 源码中，**预加载扫描器能在第一时间看到它**，用正确的根路径预加载资源

`file://` 下的时序：
1. 预加载扫描器看到 `<base href="/">` 和 `<link>` → 尝试预加载 `file:///assets/...`（失败，但不影响）
2. 解析器到达 `<script>` → 立即移除 `<base>`
3. 解析器到达 `<link>` → **此时无 `<base>`**，相对路径正确解析 → 200 ✅

---

## 四、验证清单

部署后逐项检查：

- [ ] 本地双击 `index.html` — 样式/图片/轮播正常
- [ ] 本地双击 `products/index.html` — 样式/图片正常
- [ ] 线上 `https://yy-hz.com/` — 首页正常
- [ ] 线上 `/hardware/` — CSS/JS/图片 200
- [ ] 线上 `/products/kayak/` — CSS/JS/图片 200
- [ ] 线上 `/zh/hardware/` — CSS 返回 200（关键！）
- [ ] DevTools Network 面板无 404

---

## 五、资源路径规范（铁律）

```
CSS  : assets/css/main.css      ← 相对路径（配合 <base href="/">）
JS   : assets/js/main.js        ← 同上
图片  : assets/images/xxx.webp   ← 同上
导航  : index.html / products/... ← 同上
```

**永远配合 `<base href="/">` 使用相对路径。不要用 `/assets/...` 根相对路径（会破坏 file://），也不要用 `../assets/...`（多级目录下会出错）。**

---

## 六、失败方案速查

| 方案 | 失败原因 |
|------|----------|
| `document.write('<base>')` | 预加载扫描器抢先抓取，缓存错误 URL |
| 仅改 `.htaccess` 去斜杠 | 语言前缀 `/zh/` 场景未覆盖 |
| `/assets/...` 根相对路径 | `file://` 下指向磁盘根 |
| `../assets/` (二级子目录) | 2 层深度下 `../` 回不到根 |

---

## 七、添加 `<base>` 的标准模板

新建 HTML 页面时，`<head>` 开头固定用这个结构：

```html
<head>
<meta charset="UTF-8">
<base href="/">
<script>if(location.protocol==='file:'){var b=document.querySelector('base');if(b)b.remove();}</script>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>...</title>
```

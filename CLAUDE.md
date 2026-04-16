# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Figma 设计稿还原项目。将 Figma 设计稿逐像素还原为 HTML + Tailwind CSS 静态页面。

技术栈：HTML + Tailwind CSS v4 + Vite（无框架）。

## 构建命令

```bash
npm run dev      # 启动开发服务器（含热重载），默认端口 5173
npm run build    # 生产构建，输出到 dist/
npm run preview  # 预览生产构建结果
```

开发时访问页面：`http://localhost:5173/src/pages/<页面名>.html`

## 项目架构

```
src/pages/       — HTML 页面，每个文件对应一个 Figma 设计稿页面
src/css/main.css — Tailwind CSS 入口 + @theme 自定义设计令牌
src/js/          — 页面 JavaScript
src/assets/      — 图片、图标、字体等静态资源
public/          — 不经 Vite 处理的静态资源
vite.config.js   — Vite 配置（Tailwind 插件 + 多页面入口）
```

所有页面共享同一个 `main.css`。Tailwind 扫描所有 HTML 文件生成统一 CSS。

## 新增页面步骤

1. 在 `src/pages/` 下创建 HTML 文件，引入 `/src/css/main.css`
2. 在 `vite.config.js` 的 `rollupOptions.input` 中添加新入口
3. 重启开发服务器

## Tailwind CSS v4 注意事项

- **无 tailwind.config.js** — 配置通过 CSS 完成
- 使用 `@import "tailwindcss"` 引入（不是 `@tailwind` 三行指令）
- 自定义令牌在 `src/css/main.css` 的 `@theme {}` 中定义
- 颜色用 `--color-*`，字体用 `--font-*`，间距用 `--spacing-*`

## Figma 还原工作流

1. **分析设计稿**：识别页面结构、组件、间距、颜色
2. **提取设计令牌**：将颜色、字体、间距等写入 `@theme`
3. **搭建页面骨架**：HTML 语义化标签
4. **填充样式**：Tailwind 工具类还原视觉
5. **响应式适配**：按设计稿断点添加响应式样式
6. **细节微调**：对照设计稿检查间距、字号、颜色

## 还原标准

- 间距误差不超过 2px
- 颜色使用 Figma 标注的精确色值
- 覆盖设计稿中所有断点
- 使用设计稿指定的字体族和字重

## 命名规范

- 文件名：kebab-case（如 `product-detail.html`）
- 自定义 CSS 类名（如需要）：BEM 规范
- 优先使用 Tailwind 工具类，避免自定义 CSS

## 踩坑记录

### 背景装饰图的正确实现方式

**场景：** 页面顶部有装饰性背景图，需要在状态栏/导航栏后面显示（沉浸式效果），且跟随页面滚动。

**错误做法（已验证会失败）：**
- 用 `<img>` + `absolute`/`fixed` 定位 + z-index 控制 → `overflow-x-clip` + `relative` + `z-index` 组合会创建新的格式化上下文，导致 z-index 层级混乱，bg 图被内容遮住或定位失效
- 把 bg 图放在主容器外面作为 body 直接子元素 → `z-index: -1` 会沉到 body 背景之下不可见，正 z-index 又被内容容器遮住

**正确做法：**
- 将 bg 图作为 body 的 CSS `background-image` 属性（内联 style）
- `background-position: top center` → 与屏幕顶部对齐
- `background-repeat: no-repeat` + `background-size` → 控制大小
- 默认 `background-attachment: scroll` → 跟随页面滚动
- bg 图自动在 body 最底层，所有内容在其上方，无需任何 z-index

**示例：**
```html
<body class="bg-bg-gray"
  style="background-image: url('../assets/images/bg-header.svg'); background-repeat: no-repeat; background-position: top center; background-size: 375px 302px;">
```

### `position: sticky` 失效的常见原因

- **父容器 `overflow-x: hidden`**：CSS 规范中设置 `overflow-x: hidden` 会隐式将 `overflow-y` 设为 `auto`，创建滚动上下文导致 sticky 失效。改用 `overflow-x: clip` 可裁剪横向溢出且不影响 sticky。

### 导航栏透明→白色背景切换

- 导航栏 `fixed top-0`，初始 `background-color: transparent`
- 监听 `scroll` 事件：`scrollY > 0` 时设为白色，否则设为透明
- 用 `transition-[background-color] duration-200` 添加过渡动画

### sticky 元素的圆角动态切换

- 日期选择器 `sticky top-[88px]`，正常时有顶部圆角
- 通过 JS 检测 `getBoundingClientRect().top <= 89` 时去掉圆角（吸顶状态），否则恢复圆角

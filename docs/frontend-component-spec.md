# 前端组件开发规范

## 1. 项目结构
- `pages/` 页面级组件
- `components/` 通用组件
- `utils/` 工具方法
- `api/` 请求封装
- `styles/` 全局样式与主题
- `assets/` 静态资源（图片、字体、图标）

## 2. 公共组件列表
- 顶部导航栏 `AppNavBar`
- 服务卡片 `ServiceCard`
- 订单状态标签 `OrderTag`
- 步骤条 `StepBar`
- 宠物信息卡 `PetInfoCard`
- 聊天气泡 `ChatBubble`

## 3. 命名规范
- 组件名采用大驼峰，如 `ServiceCard`
- `props` 使用小驼峰，如 `userId`
- 事件使用 `onXxx` 约定，并通过 `emit('update:xxx')` 或 `emit('action')` 触发

## 4. 风格统一
- 字体：统一使用 `14px`/`16px`，主要字体为 `-apple-system, BlinkMacSystemFont`
- 边距：基于 `4px` 的倍数，如 `8px`, `12px`
- 圆角：卡片 `8px`，按钮 `4px`
- 按钮：首选 `primary`、`secondary` 两种样式
- 空状态：使用统一图标和文案 `暂无数据`

## 5. TDesign 与 Naive UI 一致性
- 组件优先选用二者的原子组件，扩展时保持 API 风格一致
- 样式变量统一在 `styles/theme.scss` 中定义
- 若存在重名或功能相近的组件，保持 props 命名相同

## 6. 页面通用布局
```
<AppNavBar title="页面标题" />
<main class="content">页面内容</main>
<section class="actions">操作按钮/入口</section>
```
- 顶部导航栏高度 `48px`
- 内容区滚动，操作区固定底部

## 7. 全局主题接入
- 在 `styles/theme.scss` 中定义色彩、字体、布局变量
- 在入口文件加载主题，并通过 CSS 变量暴露
- 组件中使用 `var(--primary-color)` 方式引用

## 8. 图标方案
- 推荐使用 `iconfont` 统一管理自定义图标
- 结合 TDesign Icon 或 Naive Icon 做补充
- 所有图标保持 `1em` 大小，可通过 CSS `font-size` 控制

